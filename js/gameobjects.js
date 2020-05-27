'use strict';


//##############################################
//-----------------MOVABLE OBJECTS--------------
//##############################################
var Cube = function(x, y, color){
	var me = MovableObject();

	me.color = color;
	me.x = x;
	me.y = y;
	me.w = 16;
	me.h = 16;

	me.onDraw = function(ctx){
		ctx.fillStyle = me.color;
		ctx.fillRect(me.viewX, me.viewY, me.w, me.h);
	};

	me.onDrawDetails = function(ctx){
		ctx.fillStyle = me.color;
		ctx.fillRect(0, 0, me.w*IMAGE_SCALE, me.h*IMAGE_SCALE);
		
	};

	return me;
};


var D6 = function(x, y){
	var me = MovableObject();

	me.x = x;
	me.y = y;
	me.w = SIMG["d6_1"].width;
	me.h = SIMG["d6_1"].height;
	me.value = 5;
	me.animation = 0;

	me.onDraw = function(ctx){
		if(me.animation > 0){
			var rval = (me.animation%6)+1;
			ctx.drawImage(SIMG["d6_"+rval], me.viewX, me.viewY);
			me.animation--;
		}
		else{
			ctx.drawImage(SIMG["d6_"+me.value], me.viewX, me.viewY);
		}
		
	};

	me.onDrop = function(){
		me.value = (random.next1000() % 6) + 1;
		me.animation = 30;
	};

	return me;
};


var Card = function(x, y, imgTop, imgBot, imgMask){
	var me = MovableObject();

	me.x = x;
	me.y = y;
	me.w = SIMG[imgTop].width;
	me.h = SIMG[imgTop].height;
	me.imgTop = imgTop;
	me.imgBot = imgBot;
	me.imgMask = imgMask;
	me.isFaceUp = false;

	me.onDraw = function(ctx){
		//FACE UP
		if(me.isFaceUp){
			ctx.drawImage(SIMG[me.imgTop], me.viewX, me.viewY);
		}

		//FACE DOWN
		else{
			if(localPlayer === me.getOwner()){
				ctx.drawImage(SIMG[me.imgTop], me.viewX, me.viewY);
				ctx.drawImage(SIMG[me.imgMask], me.viewX, me.viewY);
			}
			else{
				ctx.drawImage(SIMG[me.imgBot], me.viewX, me.viewY);
			}
		}
	};

	me.onDrawDetails = function(ctx){
		var scale = 1;
		var iw = IMG[me.imgTop].width;
		var ih = IMG[me.imgTop].height;
		if(DETAILS_WIDTH < iw) scale = DETAILS_WIDTH / iw;
		var w = iw * scale;
		var h = ih * scale;


		//FACE UP
		if(me.isFaceUp){
			ctx.drawImage(IMG[me.imgTop], 0, 0, w, h);
		}

		//FACE DOWN
		else{
			if(localPlayer === me.getOwner()){
				ctx.drawImage(IMG[me.imgTop], 0, 0, w, h);
			}
			else{
				ctx.drawImage(IMG[me.imgBot], 0, 0, w, h);
			}
		}
	};

	me.onMouseUp = function(e){
		if(localPlayer === me.getOwner() && keyboard.isDown(CHAR_TO_KEYCODE["Ctrl"]) && me.contains(e.x, e.y)){
			me.isFaceUp = !me.isFaceUp;
		}
	};

	me.onDrop = function(){
		var topLeft = [me.x, me.y];
		var bottomRight = [me.x+me.w, me.y+me.h];
		var deck = gameObjects.getDeckIntersectsAt(topLeft, bottomRight);
		if(deck !== null){
			deck.addCard(me);
		}
	};


	return me;
};



//##############################################
//-----------------STATIC OBJECTS---------------
//##############################################
var Board = function(x, y, img){
	var me = GameObject();
	me.sortLayer = 2;

	me.x = x;
	me.y = y;
	me.img = img;

	me.onDraw = function(ctx){
		ctx.drawImage(IMG[me.img], me.viewX, me.viewY);
	};

	return me;
};


var Deck = function(x, y, img, drawFaceUp){
	var me = GameObject();
	me.isDeck = true;

	me.img = img;
	me.x = x;
	me.y = y;
	me.w = SIMG[img].width;
	me.h = SIMG[img].height;

	me.drawFaceUp = drawFaceUp;
	me.cards = [];

	me.onDraw = function(ctx){
		if(me.cards.length > 0){
			var max = clamp(me.cards.length, 1, 10);
			for(var i=0; i<max; i++) ctx.drawImage(SIMG[me.img], me.viewX+i*1, me.viewY+i*1);
		}
		else{
			ctx.fillStyle = "red";
			ctx.fillRect(me.viewX, me.viewY, me.w, me.h);
		}
	};

	me.onMouseDown = function(e){
		if(me.cards.length > 0 && localPlayer === me.getOwner() && me.contains(e.x, e.y)){
			var card = me.drawCard();

			//face up?
			if(me.drawFaceUp) card.isFaceUp = true;
			else card.isFaceUp = false;

			//location
			card.x = me.x;
			card.y = me.y;
			card.viewX = card.x;
			card.viewY = card.y;

			//finish
			gameObjects.add(card);
		}
	};

	me.addCard = function(card){
		gameObjects.remove(card);
		me.cards.push(card);
	};

	me.drawCard = function(){
		var card = null;
		if(me.cards.length > 0){
			card = me.cards.pop();
		}
		return card;
	};

	me.shuffle = function(){

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




