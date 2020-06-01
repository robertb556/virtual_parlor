'use strict';


//##############################################
//-----------------INPUT------------------------
//##############################################
var MOUSE_MOVE = 0;
var MOUSE_DOWN = 1;
var MOUSE_UP = 2;
var PASS_CONTROL = 3;

var Input = function(){
	var me = {};

	me.outboundBuffer = [];

	me.DELAY = 50;
	me.startTime = Date.now();
	me.tickTime = Date.now();

	me.x = 0;
	me.y = 0;
	me.ctrlDown = false;
	me.shiftDown = false;

	me.heldObjects = [];
	var holdSpacing = 68;
	me.holdXPositions = [0, holdSpacing,   0,  holdSpacing, 2*holdSpacing, 2*holdSpacing, 0, holdSpacing, 2*holdSpacing];
	me.holdYPositions = [0, 0, holdSpacing, holdSpacing,  0, holdSpacing, 2*holdSpacing, 2*holdSpacing, 2*holdSpacing];


	me.server;
	me.connected = false;

	//web server methods
	me.init = function(){
		me.server = new WebSocket('ws://18.224.202.15:9191');
		console.log("trying to connnect");
		me.server.onopen = function(){
			me.connected = true;
			console.log("connected");
			me.send("hello world");
		};

		me.server.onerror = function(error){
			alert('WebSocket Error ' + error); console.log(error);
		};

		me.server.onmessage	= function(e){
			console.log("got message["+e.data+"]");
			var data = JSON.parse(e.data);

			
			//WORLD STATE
			if(data.WORLD_STATE){
				gameObjects.setWorldState(data.state);
			}
			
			//UPDATE
			else if(data.UPDATE){
				var player = players[data.playerIndex];

				//add to buffer
				for(var i=0; i<data.buffer.length; i++) player.buffer.push(data.buffer[i]);
			}
			


			//YOU ARE HOST
			else if(data.YOU_ARE_HOST){

			}
			
		};
	};

	me.sendPacket = function(){
		//prepare packet
		var data = {};
		data.UPDATE = true;
		data.playerIndex = localPlayer.index;
		data.buffer = me.outboundBuffer;
		var message = JSON.stringify(data);

		//send it
		me.send(message);

		//clear outbound
		me.outboundBuffer.length = 0;
	};

	me.send = function(message){
		if(me.connected){
			me.server.send(message);
		}
	};


	//holding methods
	me.grab = function(object){
		if(!me.isHolding(object) && (me.heldObjects.length === 0 || me.ctrlDown)){
			me.heldObjects.push(object);
			object.moveToTop = true;
		}
	};

	me.drop = function(object){
		var index = me.holdIndex(object);
		if(index >= 0){
			me.heldObjects.splice(index, 1);
			object.drop();
		}
	};

	me.isHolding = function(object){
		if(me.holdIndex(object) >= 0) return true;
		else return false;
	};

	me.holdIndex = function(object){
		for(var i=0; i<me.heldObjects.length; i++){
			if(me.heldObjects[i] === object) return i;
		}

		return -1;
	};

	me.getHeldX = function(object){
		var index = me.holdIndex(object);
		if(index >= 0){
			return me.x + me.holdXPositions[index];
		}
		else return null;
	};
	me.getHeldY = function(object){
		var index = me.holdIndex(object);
		if(index >= 0){
			return me.y + me.holdYPositions[index];
		}
		else return null;
	};






	//general methods
	me.play = function(buffer){
		if(buffer.length === 0) return;

		var delay = Math.floor(1 / buffer.length); //for localPlayer
		//var delay = Math.floor(1000 / buffer.length); //for remote players
		var now = Date.now();
		var dt = now - me.tickTime;
		if(dt > delay){
			me.tickTime = now;
			//release event
			var f = buffer.shift();
			if(f !== null){
				var e = {};
				e.player = players[f[0]];
				e.type = f[1];
				e.x = f[2];
				e.y = f[3];
				e.rawX = f[4];
				e.rawY = f[5];
				e.leftDown = f[6];
				e.rightDown = f[7];
				e.ctrlDown = f[8];
				e.shiftDown = f[9];

				me.x = e.x;
				me.y = e.y;
				me.ctrlDown = e.ctrlDown;
				me.shiftDown = e.shiftDown;

				if(!e.shiftDown){
					if(e.type === MOUSE_DOWN){
						//console.log("play down");
						if(localPlayer === players[ACTIVE_PLAYER]) gameObjects.mouseDown(e);
					}
					else if(e.type === MOUSE_UP){
						//console.log("play up");
						if(localPlayer === players[ACTIVE_PLAYER]) gameObjects.mouseUp(e);
					}
					else if(e.type === MOUSE_MOVE){
						//console.log("play move");
						if(localPlayer === players[ACTIVE_PLAYER]) gameObjects.mouseMove(e);

						//syncing mice for visual communication
						e.player.mouseMove(e);
					}
					else if(e.type === PASS_CONTROL){
						players[ACTIVE_PLAYER] = e.player;
					}
				}
			}
		}
	};

	me.tick = function(){
		var max = me.getCurrentEventIndex();
		while(localPlayer.buffer.addCount < max){
			localPlayer.buffer.push(null);
			me.outboundBuffer.push(null);
		}
	};

	me.add = function(playerIndex, type, x, y, rawX, rawY, leftDown, rightDown, ctrlDown, shiftDown){
		var player = players[playerIndex];

		//keep buffer full up to date
		me.tick();

		//add
		if(player.buffer.addCount < me.getCurrentEventIndex()+2 || type !== MOUSE_MOVE){
			var e = [];
			e[0] = playerIndex;
			e[1] = type;
			e[2] = Math.round(x);
			e[3] = Math.round(y);
			e[4] = Math.round(rawX);
			e[5] = Math.round(rawY);
			e[6] = leftDown;
			e[7] = rightDown;
			e[8] = ctrlDown;
			e[9] = shiftDown;
			player.buffer.push(e);
			me.outboundBuffer.push(e);
		}
		
	};

	me.getTime = function(){
		return Date.now() - me.startTime;
	};

	me.getCurrentEventIndex = function(){
		return Math.floor(me.getTime() / me.DELAY);
	};

	me.init();
	return me;
};



var LinkedList = function(){
	var me = {};

	me.head = null;
	me.tail = null;
	me.length = 0;
	me.addCount = 0;

	me.at = function(index){
		var val = null;
		if(index < me.length){
			var n = me.head;
			for(var i=0; i<index; i++) n = n.next;
			val = n.value;
		}
		return val;
	};

	me.push = function(value){
		var n = LinkedListNode(value);

		if(me.length === 0){
			me.head = n;
			me.tail = n;
		}
		else{
			me.tail.next = n;
			n.prev = me.tail;
			me.tail = n;
		}

		me.length++;
		me.addCount++;
	};

	me.shift = function(){
		var val = null;

		if(me.head !== null){
			val = me.head.value;
			me.head = me.head.next;
			me.length--;

			if(me.length === 0){
				me.head = null;
				me.tail = null;
			}
			else{
				me.head.prev = null;
			}
		}

		return val;
	};

	return me;
};


var LinkedListNode = function(value){
	var me = {};

	me.value = value;
	me.next = null;
	me.prev = null;

	return me;
};