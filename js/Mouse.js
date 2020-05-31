'use strict';


//##############################################
//-----------------MOUSE------------------------
//##############################################
var Mouse = function(){
	var me = {};

	me.isDown = false;
	me.leftDown = false;
	me.rightDown = false;
	me.x = 0;
	me.y = 0;
	me.rawX = 0;
	me.rawY = 0;
	me.lastRawX = 0;
	me.lastRawY = 0;
	me.xDown = 0;
	me.yDown = 0;
	me.useTouch = false;

	me.canvas = graphics.getTopCanvas();


	me.init = function(){
		//input listeners
		me.canvas.addEventListener('mouseup', me.mouseup,   false);
		me.canvas.addEventListener('mousedown', me.mousedown, false);
		me.canvas.addEventListener('mousemove', me.mousemove, false);
		window.addEventListener("wheel", me.onscroll);
		me.canvas.addEventListener('touchstart', me.touchstart, false);
		me.canvas.addEventListener('touchend', me.touchend, false);
		me.canvas.addEventListener('touchmove', me.touchmove, false);
	};



	me.up = function(event){
		//console.log("event up");
		if(!me.isDown) return; //don't double call
		me.isDown = false;
		me.leftDown = false;
		me.rightDown = false;
		me.saveState(event);
		
		//gameObjects.mouseUp();
		input.add(localPlayer.index, MOUSE_UP, me.x, me.y, me.rawX, me.rawY, me.leftDown, me.rightDown, keyboard.isDown(CHAR_TO_KEYCODE["Ctrl"]), keyboard.isDown(CHAR_TO_KEYCODE["Shift"]));
	};
	
	me.down = function(event){
		//console.log("event down");
		if(me.isDown) return; //don't double call
		me.isDown = true;
		if(event.button === 0) me.leftDown = true;
		if(event.button === 2) me.rightDown = true;
		//console.log("event button["+event.button+"]");
		//console.log("rightdown["+me.rightDown+"]");
		me.saveState(event);

		me.xDown = me.x;
		me.yDown = me.y;

		//gameObjects.mouseDown();
		input.add(localPlayer.index, MOUSE_DOWN, me.x, me.y, me.rawX, me.rawY, me.leftDown, me.rightDown, keyboard.isDown(CHAR_TO_KEYCODE["Ctrl"]), keyboard.isDown(CHAR_TO_KEYCODE["Shift"]));
	};

	me.move = function(event){
		//console.log("event move");
		me.saveState(event);

		if(me.isDown && keyboard.isDown(CHAR_TO_KEYCODE["Shift"])){
			var dx = -1*(me.lastRawX - me.rawX);
			var dy = -1*(me.lastRawY - me.rawY);
			graphics.pan(dx, dy);

			//graphics.xOffset = me.x - me.xDown;
			//graphics.yOffset = me.y - me.yDown;
		}

		//gameObjects.mouseMove();
		input.add(localPlayer.index, MOUSE_MOVE, me.x, me.y, me.rawX, me.rawY, me.leftDown, me.rightDown, keyboard.isDown(CHAR_TO_KEYCODE["Ctrl"]), keyboard.isDown(CHAR_TO_KEYCODE["Shift"]));
	};

	me.onscroll = function(event){
		if(keyboard.isDown(CHAR_TO_KEYCODE["Shift"])){
			if(event.deltaY > 0){
				graphics.zoomAt(-1, me.x, me.y);
			}else{
				graphics.zoomAt(1, me.x, me.y);
			}
		}
	};

	me.saveState = function(e){
		var r = me.canvas.getBoundingClientRect();
		//me.x = (e.pageX - r.left)/graphics.scale;
		//me.y = (e.pageY - r.top)/graphics.scale;

		//graphics offset
		//me.x -= graphics.xOffset;
		//me.y -= graphics.yOffset;

		me.lastRawX = me.rawX;
		me.lastRawY = me.rawY;
		me.rawX = (e.pageX - r.left)/graphics.scale;
		me.rawY = (e.pageY - r.top)/graphics.scale;
		me.x = (me.rawX - graphics.xOffset)/graphics.getCurrentScale();
		me.y = (me.rawY - graphics.yOffset)/graphics.getCurrentScale();
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