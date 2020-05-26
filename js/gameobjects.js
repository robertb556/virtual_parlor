'use strict';


//##############################################
//-----------------GAME OBJECTS-----------------
//##############################################
var Token = function(x, y, color){
	var me = GameObject();

	me.color = color;

	me.x = x;
	me.y = y;
	me.w = 16;
	me.h = 16;

	me.viewX = 0;
	me.viewY = 0;
	me.selected = false;

	me.onDraw = function(ctx){
		//calculate
		me.viewX = lerp(me.viewX, me.x, 0.1);
		me.viewY = lerp(me.viewY, me.y, 0.1);

		//draw
		ctx.fillStyle = me.color;
		ctx.fillRect(me.viewX, me.viewY, me.w, me.h);
	};

	me.onMouseDown = function(){
		if(me.contains(mouse.x, mouse.y)){
			mouse.grab(me);
		}
	};

	me.onMouseMove = function(){
		if(mouse.isDown && me.contains(mouse.x, mouse.y)){
			mouse.grab(me);
		}

		if(mouse.isHolding(me)){
			me.x = Math.floor(mouse.getHeldX(me) - (me.w/2));
			me.y = Math.floor(mouse.getHeldY(me) - (me.h/2));
		}
	};

	me.onMouseUp = function(){
		mouse.drop(me);
	};

	return me;
};

var Button = function(x, y, img, imgDown){
	var me = GameObject();

	me.img = img;
	me.imgDown = imgDown;
	me.x = x;
	me.y = y;
	me.w = img.width;
	me.h = img.height;

	me.onDraw = function(ctx){
		ctx.drawImage(me.img, me.x, me.y);
	};

	me.onMouseUp = function(){
		
	};

	return me;
};




