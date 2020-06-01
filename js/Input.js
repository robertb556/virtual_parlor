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

	me.server;
	me.connected = false;

	//web server methods
	me.init = function(){
		me.server = new WebSocket('ws://18.224.202.15:9191');
		console.log("trying to connnect");
		me.server.onopen = function(){
			me.connected = true;
			console.log("connected");
			
			var data = {};
			data.JOIN = true;
			data.name = "N"+Math.floor(Math.random()*1000);
			var message = JSON.stringify(data);
			me.send(message);
		};

		me.server.onerror = function(error){
			alert('WebSocket Error ' + error); console.log(error);
		};

		me.server.onmessage	= function(e){
			console.log("got message["+e.data+"]");
			var data = JSON.parse(e.data);

			
			//WORLD STATE
			if(data.WORLD_STATE){
				gameObjects.setWorldState(data.worldState);
			}
			
			//UPDATE
			else if(data.UPDATE){
				var player = players[data.playerIndex];

				//add to buffer
				for(var i=0; i<data.buffer.length; i++) player.buffer.push(data.buffer[i]);
			}
			

			else if(data.PLAYER_LIST){
				//players
				players = [];
				for(var i=1; i<data.players.length; i++){
					var player = Player(i, data.players[i]);
					players[i] = player;
				}

				//active player
				players[0] = players[1];

				//local player
				localPlayer = players[data.localPlayerIndex];
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









	//general methods
	me.play = function(player){
		var buffer = player.buffer;
		if(buffer.length === 0) return;

		var delay;
		if(player === localPlayer) delay = Math.floor(1 / buffer.length); //for localPlayer
		else delay = Math.floor(300 / buffer.length); //for remote players
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
				e.leftDown = !!f[6];
				e.rightDown = !!f[7];
				e.ctrlDown = !!f[8];
				e.shiftDown = !!f[9];

				player.x = e.x;
				player.y = e.y;
				player.ctrlDown = e.ctrlDown;
				player.shiftDown = e.shiftDown;

				if(!e.shiftDown){
					if(e.type === MOUSE_DOWN){
						//console.log("play down");
						if(e.player === players[ACTIVE_PLAYER]) gameObjects.mouseDown(e);
					}
					else if(e.type === MOUSE_UP){
						//console.log("play up");
						if(e.player === players[ACTIVE_PLAYER]) gameObjects.mouseUp(e);
					}
					else if(e.type === MOUSE_MOVE){
						//console.log("play move");
						if(e.player === players[ACTIVE_PLAYER]) gameObjects.mouseMove(e);

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
			e[6] = leftDown + 0;
			e[7] = rightDown + 0;
			e[8] = ctrlDown + 0;
			e[9] = shiftDown + 0;
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