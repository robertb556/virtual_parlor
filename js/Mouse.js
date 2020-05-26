'use strict';


//##############################################
//-----------------MOUSE------------------------
//##############################################
var Mouse = function(){
	var me = {};

	me.isDown = false;
	me.x = 0;
	me.y = 0;
	me.xDown = 0;
	me.yDown = 0;
	me.useTouch = false;

	me.canvas = graphics.getTopCanvas();

	
	me.init = function(){
		//input listeners
		me.canvas.addEventListener('mouseup', me.mouseup,   false);
		me.canvas.addEventListener('mousedown', me.mousedown, false);
		me.canvas.addEventListener('mousemove', me.mousemove, false);
		me.canvas.addEventListener('touchstart', me.touchstart, false);
		me.canvas.addEventListener('touchend', me.touchend, false);
		me.canvas.addEventListener('touchmove', me.touchmove, false);
	};

	me.refresh = function(){
		me.isDown = false;
		me.x = 0;
		me.y = 0;
	};

	me.up = function(event){
		//console.log("event up");
		if(!me.isDown) return; //don't double call
		me.isDown = false;
		me.saveState(event);
		activeElement.mouseUp();
	};
	
	me.down = function(event){
		//console.log("event down");
		if(me.isDown) return; //don't double call
		me.isDown = true;
		me.saveState(event);

		me.xDown = me.x;
		me.yDown = me.y;

		activeElement.mouseDown();
	};

	me.move = function(event){
		//console.log("event move");
		me.saveState(event);

		if(me.isDown && keyboard.isDown(CHAR_TO_KEYCODE["Ctrl"])){
			graphics.xOffset = me.x - me.xDown;
			graphics.yOffset = me.y - me.yDown;
		}

		activeElement.mouseMove();
	};

	me.saveState = function(e){
		var r = me.canvas.getBoundingClientRect();
		me.x = (e.pageX - r.left)/graphics.scale;
		me.y = (e.pageY - r.top)/graphics.scale;

		//graphics offset
		//me.x -= graphics.xOffset;
		//me.y -= graphics.yOffset;
	};

	me.mouseup = function(event){
		//eventLog.add("mouse up");
		if(me.useTouch) return;
		me.up(event);
	};
	
	me.mousedown = function(event){
		//eventLog.add("mouse down");
		if(me.useTouch) return;
		me.down(event);
	};

	me.mousemove = function(event){
		//eventLog.add("mouse move");
		if(me.useTouch) return;
		me.move(event);
	};
	
	me.touchstart = function(event){
		//eventLog.add("touch start");
		me.useTouch = true;
		event.preventDefault();
		event = event.touches[0];
		me.down(event);
	};

	me.touchend = function(event){
		//eventLog.add("touch end");
		event = event.changedTouches[0];
		me.up(event);
	};

	me.touchmove = function(event){
		//eventLog.add("touch move");
		event = event.touches[0];
		me.move(event);
	};

	me.init();
	return me;
};