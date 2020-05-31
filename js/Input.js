'use strict';


//##############################################
//-----------------INPUT------------------------
//##############################################
var MOUSE_MOVE = 0;
var MOUSE_DOWN = 1;
var MOUSE_UP = 2;

var Input = function(){
	var me = {};

	me.DELAY = 50;
	me.startTime = Date.now();
	me.buffer = LinkedList();
	me.tickTime = Date.now();

	me.x = 0;
	me.y = 0;
	me.ctrlDown = false;
	me.shiftDown = false;

	me.heldObjects = [];
	var holdSpacing = 68;
	me.holdXPositions = [0, holdSpacing,   0,  holdSpacing, 2*holdSpacing, 2*holdSpacing, 0, holdSpacing, 2*holdSpacing];
	me.holdYPositions = [0, 0, holdSpacing, holdSpacing,  0, holdSpacing, 2*holdSpacing, 2*holdSpacing, 2*holdSpacing];

	//holding methods
	me.grab = function(object){
		if(!me.isHolding(object) && (me.heldObjects.length === 0 || me.ctrlDown)){
			me.heldObjects.push(object);
			object.moveToTop = true;
			//gameObjects.moveToTop(object);
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
	me.play = function(){
		if(me.buffer.length === 0) return;

		var delay = Math.floor(1 / me.buffer.length); //for localPlayer
		//var delay = Math.floor(1000 / me.buffer.length); //for remote players
		var now = Date.now();
		var dt = now - me.tickTime;
		if(dt > delay){
			me.tickTime = now;
			//release event
			var e = me.buffer.shift();
			if(e !== null){
				e.player = players[e.playerIndex];
				me.x = e.x;
				me.y = e.y;
				me.ctrlDown = e.ctrlDown;
				me.shiftDown = e.shiftDown;

				if(!e.shiftDown){
					if(e.type === MOUSE_DOWN){
						//console.log("play down");
						gameObjects.mouseDown(e);
					}
					else if(e.type === MOUSE_UP){
						//console.log("play up");
						gameObjects.mouseUp(e);
					}
					else if(e.type === MOUSE_MOVE){
						//console.log("play move");
						gameObjects.mouseMove(e);
					}
				}
			}
		}
	};

	me.tick = function(){
		var max = me.getCurrentEventIndex();
		while(me.buffer.addCount < max){
			me.buffer.push(null);
		}
	};

	me.add = function(playerIndex, type, x, y, leftDown, rightDown, ctrlDown, shiftDown){
		//keep buffer full up to date
		me.tick();

		//add
		if(me.buffer.addCount < me.getCurrentEventIndex()+2 || type !== MOUSE_MOVE){
			var e = {};
			e.playerIndex = playerIndex;
			e.type = type;
			e.x = Math.round(x);
			e.y = Math.round(y);
			e.leftDown = leftDown;
			e.rightDown = rightDown;
			e.ctrlDown = ctrlDown;
			e.shiftDown = shiftDown;
			me.buffer.push(e);
		}
		
	};

	me.getTime = function(){
		return Date.now() - me.startTime;
	};

	me.getCurrentEventIndex = function(){
		return Math.floor(me.getTime() / me.DELAY);
	};

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