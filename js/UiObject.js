'use strict';


//##############################################
//-----------------UI OBJECT--------------------
//##############################################
var UiObject = function(){
	var me = {};

	me.x = 0;
	me.y = 0;
	me.w = 0;
	me.h = 0;
	me.children = [];
	me.parent;


	me.addChild = function(obj){
		obj.parent = me;
		me.children.push(obj);
	};

	me.removeChild = function(obj){
		var index = -1;
		for(var i=0; i<me.children.length; i++){
			if(me.children[i] === obj) index = i;
		}

		if(index >= 0){
			me.children.splice(index, 1);
		}
	};

	me.contains = function(x,y){
		if(x>me.x && x<me.x+me.w && y>me.y && y<me.y+me.h) return true;
		else return false;
	};

	//on becoming activeEelement
	me.focus = function(){
		me.onFocus();
	};

	me.draw = function(ctx){
		me.onDraw(ctx);

		for(var i=0; i<me.children.length; i++) me.children[i].draw(ctx);
	};

	me.mouseDown = function(){
		if(me.contains(mouse.x, mouse.y))  me.onMouseDown();

		for(var i=0; i<me.children.length; i++) me.children[i].mouseDown();
	};
	me.mouseUp = function(){
		if(me.contains(mouse.x, mouse.y)) me.onMouseUp();

		for(var i=0; i<me.children.length; i++) me.children[i].mouseUp();
	};
	me.mouseMove = function(){
		if(me.contains(mouse.x, mouse.y))  me.onMouseMove();

		for(var i=0; i<me.children.length; i++) me.children[i].mouseMove();
	};

	//child implements
	me.onFocus = function(){};
	me.onDraw = function(ctx){};
	me.onMouseDown = function(){};
	me.onMouseUp = function(){};
	me.onMouseMove = function(){};

	return me;
};


