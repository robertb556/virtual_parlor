'use strict';


//##############################################
//-----------------ui elements------------------
//##############################################
var MainElement = function(){
	var me = UiObject();

	me.w = SCREEN_WIDTH;
	me.h = SCREEN_HEIGHT;

	me.addChild(Button(100, 100, IMG["button"]), IMG["buttonDown"]);

	me.onDraw = function(ctx){
		ctx.fillStyle = "#300";
		ctx.fillRect(me.x, me.y, me.w, me.h);
	};

	return me;
};

var Button = function(x, y, img, imgDown){
	var me = UiObject();

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




