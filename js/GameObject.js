'use strict';


//##############################################
//-----------------GAME OBJECTS-----------------
//##############################################

var GameObjects = function(){
	var me = {};

	me.objects = [];

	me.add = function(obj){
		me.objects.push(obj);
	};

	me.draw = function(ctx){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			obj.onDraw(ctx);
		}
	};

	me.mouseDown = function(){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			obj.onMouseDown();
		}
	};

	me.mouseUp = function(){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			obj.onMouseUp();
		}
	};

	me.mouseMove = function(){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			obj.onMouseMove();
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

	gameObjects.add(me);


	me.contains = function(x,y){
		if(x>me.x && x<me.x+me.w && y>me.y && y<me.y+me.h) return true;
		else return false;
	};

	//child implements
	me.onDraw = function(ctx){};
	me.onFocus = function(){};
	me.onDraw = function(ctx){};
	me.onMouseDown = function(){};
	me.onMouseUp = function(){};
	me.onMouseMove = function(){};

	return me;
};


