'use strict';


//##############################################
//-----------------GAME OBJECTS-----------------
//##############################################

var GameObjects = function(){
	var me = {};

	me.objects = [];

	me.tick = function(){
		me.removeDead();
		me.moveToTop();
	};

	me.add = function(obj){
		me.objects.push(obj);
		me.sortObjects();
	};

	me.getAt = function(x,y){
		for(var i=me.objects.length-1; i>=0; i--){
			var obj = me.objects[i];
			if(obj.contains(x,y)) return obj;
		}
		return null;
	};

	me.getDeckIntersectsAt = function(topLeft, bottomRight){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			if(obj.isDeck && (obj.contains(topLeft[0], topLeft[1]) || obj.contains(bottomRight[0], bottomRight[1]) || obj.contains(topLeft[0], bottomRight[1]) || obj.contains(bottomRight[0], topLeft[1]))){
				return obj;
			}
		}
		return null;
	};

	me.sortObjects = function(){
		var temp = [];
		var maxLayer = 10;
		for(var layer=0; layer<=maxLayer; layer++){
			for(var i=0; i<me.objects.length; i++){
				var obj = me.objects[i];
				if(obj.sortLayer === layer) temp.push(obj);
			}
		}

		me.objects = temp;
	};

	me.moveToTop = function(object){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			if(obj.moveToTop){
				me.remove(obj);
				me.add(obj);
				obj.moveToTop = false;
			}
		}
	};

	me.removeDead = function(){
		var index = 0;
		while(index < me.objects.length){
			var obj = me.objects[index];
			if(obj.deleteMe){
				obj.deleteMe = false;
				me.objects.splice(index, 1);
			}
			else{
				index++;
			}
		}
	};

	
	me.remove = function(object){
		var index = 0;
		while(index < me.objects.length){
			if(me.objects[index] === object){
				me.objects.splice(index, 1);
			}
			else{
				index++;
			}
		}
	};
	

	me.draw = function(ctx){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			obj.draw(ctx);
		}
	};

	me.mouseDown = function(e){
		for(var i=me.objects.length-1; i>=0; i--){
			var obj = me.objects[i];
			var result = obj.mouseDown(e);
			if(result) break;
		}
	};

	me.mouseUp = function(e){
		for(var i=me.objects.length-1; i>=0; i--){
			var obj = me.objects[i];
			obj.mouseUp(e);
		}
	};

	me.mouseMove = function(e){
		for(var i=me.objects.length-1; i>=0; i--){
			var obj = me.objects[i];
			obj.mouseMove(e);
		}
	};

	return me;
};



//##############################################
//-----------------GAME OBJECT------------------
//##############################################
var GameObject = function(){
	var me = {};

	me.x = 0;
	me.y = 0;
	me.w = 0;
	me.h = 0;
	me.sortLayer = 4;
	me.ownerIndex = ACTIVE_PLAYER;
	me.deleteMe = false;
	me.moveToTop = false;

	me.viewX = 0;
	me.viewY = 0;

	gameObjects.add(me);

	me.getOwner = function(){
		return players[me.ownerIndex];
	};

	me.contains = function(x,y){
		if(x>me.x && x<me.x+me.w && y>me.y && y<me.y+me.h) return true;
		else return false;
	};

	me.draw = function(ctx){
		//calculate
		me.viewX = lerp(me.viewX, me.x, 0.2);
		me.viewY = lerp(me.viewY, me.y, 0.2);
		if(Math.abs(me.viewX-me.x) < 0.1) me.viewX = me.x;
		if(Math.abs(me.viewY-me.y) < 0.1) me.viewY = me.y;

		me.onDraw(ctx);
	};

	me.drawDetails = function(ctx){
		me.onDrawDetails(ctx);
	};

	me.mouseDown = function(e){
		return me.onMouseDown(e);
	};

	me.mouseUp = function(e){
		me.onMouseUp(e);
	};

	me.mouseMove = function(e){
		me.onMouseMove(e);
	};

	me.drop = function(){
		me.onDrop();
	};


	//child implements
	me.onDraw = function(ctx){};
	me.onDrawDetails = function(ctx){};
	me.onMouseDown = function(e){};
	me.onMouseUp = function(e){};
	me.onMouseMove = function(e){};
	me.onDrop = function(){};

	return me;
};



var MovableObject = function(){
	var me = GameObject();

	me.sortLayer = 5;

	me.mouseDown = function(e){
		var success = false;
		if(e.leftDown && me.contains(e.x, e.y)){
			input.grab(me);
			success = true;
		}

		if(success || me.onMouseDown(e)) return true;
		else return false;
	};

	me.mouseMove = function(e){
		if(e.leftDown && me.contains(e.x, e.y)){
			input.grab(me);
		}

		if(input.isHolding(me)){
			me.x = Math.floor(input.getHeldX(me) - (me.w/2));
			me.y = Math.floor(input.getHeldY(me) - (me.h/2));
		}

		me.onMouseMove(e);
	};

	me.mouseUp = function(e){
		input.drop(me);

		me.onMouseUp(e);
	};

	return me;
};
