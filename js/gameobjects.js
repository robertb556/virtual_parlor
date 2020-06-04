'use strict';


//##############################################
//-----------------MOVABLE OBJECTS--------------
//##############################################
var Cube = function(x, y, color){
	var me = MovableObject();
	me.type = OBJ_CUBE;

	me.color = color;
	me.x = x;
	me.y = y;
	me.w = 48;
	me.h = 48;

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

var Tile = function(x, y, img){
	var me = MovableObject();
	me.type = OBJ_TILE;

	me.img = img;
	me.x = x;
	me.y = y;
	me.w = SIMG[me.img].width;
	me.h = SIMG[me.img].height;

	me.onDraw = function(ctx){
		ctx.drawImage(SIMG[me.img], me.viewX, me.viewY);
	};

	me.onDrawDetails = function(ctx){
		var scale = 1;
		var iw = IMG[me.img].width;
		var ih = IMG[me.img].height;
		if(DETAILS_WIDTH < iw) scale = DETAILS_WIDTH / iw;
		var w = iw * scale;
		var h = ih * scale;

		ctx.drawImage(IMG[me.img], 0, 0, w, h);
	};

	return me;
};


var Tile3 = function(x, y, value, img1, img2, img3){
	var me = MovableObject();
	me.type = OBJ_TILE3;

	me.value = value;
	me.img = [];
	me.img[1] = img1;
	me.img[2] = img2;
	me.img[3] = img3;
	me.x = x;
	me.y = y;
	me.w = SIMG[me.img[me.value]].width;
	me.h = SIMG[me.img[me.value]].height;

	me.onDraw = function(ctx){
		ctx.drawImage(SIMG[me.img[1]], me.viewX, me.viewY);
		if(me.value === 2) ctx.drawImage(SIMG[me.img[2]], me.viewX, me.viewY);
		if(me.value === 3) ctx.drawImage(SIMG[me.img[3]], me.viewX, me.viewY);
	};

	me.onDrawDetails = function(ctx){
		var scale = 1;
		var iw = IMG[me.img[me.value]].width;
		var ih = IMG[me.img[me.value]].height;
		if(DETAILS_WIDTH < iw) scale = DETAILS_WIDTH / iw;
		var w = iw * scale;
		var h = ih * scale;

		ctx.drawImage(SIMG[me.img[1]], 0, 0, w, h);
		if(me.value === 2) ctx.drawImage(SIMG[me.img[2]], 0, 0, w, h);
		if(me.value === 3) ctx.drawImage(SIMG[me.img[3]], 0, 0, w, h);
	};

	me.setValue = function(value){
		me.value = value;
	};

	me.onMouseDown = function(e){
		var result = false;

		if(e.rightDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;
			for(var i=1; i<=3; i++){
				(function(val){
					gameObjects.add(DieContextMenu(e.x, e.y+260*i, me, val));
				})(i);
				
			}
		}
		
		return result;
	};

	return me;
};


var D6 = function(x, y, value, color){
	var me = MovableObject();
	me.type = OBJ_D6;

	me.x = x;
	me.y = y;
	me.color = color;
	me.imgPrefix = "d6_";
	if(me.color === "black") me.imgPrefix = "kd6_";
	if(me.color === "blue") me.imgPrefix = "bd6_";
	if(me.color === "red") me.imgPrefix = "rd6_";
	me.w = SIMG[me.imgPrefix+"1"].width;
	me.h = SIMG[me.imgPrefix+"1"].height;
	me.value = value;
	me.animation = 0;

	me.spacingWidth = 300;
	me.spacingHeight = 300;

	me.onDraw = function(ctx){
		if(me.animation > 0){
			var rval = (me.animation%6)+1;
			ctx.drawImage(SIMG[me.imgPrefix+rval], me.viewX, me.viewY);
			me.animation--;
		}
		else{
			ctx.drawImage(SIMG[me.imgPrefix+me.value], me.viewX, me.viewY);
		}
		
	};

	me.onDrawDetails = function(ctx){
		if(me.animation > 0){
			var rval = (me.animation%6)+1;
			ctx.drawImage(IMG[me.imgPrefix+rval], 0, 0);
		}
		else{
			ctx.drawImage(IMG[me.imgPrefix+me.value], 0, 0);
		}
	};

	me.onDrop = function(){
		me.value = (random.next1000() % 6) + 1;
		me.animation = 30;
	};

	me.setValue = function(value){
		me.value = value;
	};

	me.onMouseDown = function(e){
		var result = false;

		if(e.rightDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;
			for(var i=1; i<=6; i++){
				(function(val){
					gameObjects.add(DieContextMenu(e.x, e.y+260*(i-1), me, val));
				})(i);
				
			}
		}
		
		return result;
	};

	return me;
};


var Card = function(ownerIndex, x, y, imgTop, imgBot, imgMask, faceUp){
	var me = MovableObject();
	me.type = OBJ_CARD;

	me.ownerIndex = ownerIndex;
	me.x = x;
	me.y = y;
	me.w = SIMG[imgTop].width;
	me.h = SIMG[imgTop].height;
	me.imgTop = imgTop;
	me.imgBot = imgBot;
	me.imgMask = imgMask;
	me.isFaceUp = faceUp;

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

	me.onMouseDown = function(e){
		var result = false;

		if(e.rightDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;
			me.isFaceUp = !me.isFaceUp;
		}

		return result;
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




//Cannot interact with, just showing where other players mice are
var PlayerMouse = function(player){
	var me = GameObject();
	me.type = OBJ_MOUSE;

	me.sortLayer = 9;
	me.ownerIndex = player.index;
	me.color = player.color;

	me.onDraw = function(ctx){
		console.log("mousedraw["+me.ownerIndex+"]");
		ctx.fillStyle = me.color;
		ctx.beginPath();
		ctx.arc(me.viewX, me.viewY, 20, 0, 2 * Math.PI);
		ctx.fill();
	};

	me.onMouseMove = function(e){
		if(e.player === me.getOwner()){
			me.x = e.x;
			me.y = e.y;
		}
	};

	return me;
};



//##############################################
//-----------------STATIC OBJECTS---------------
//##############################################
var Board = function(x, y, img){
	var me = GameObject();
	me.type = OBJ_BOARD;
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
	me.type = OBJ_DECK;

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
		var result = false;

		if(e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;

			if(e.leftDown){
				if(me.cards.length > 0){
					var card = me.drawCard();

					//owner
					card.ownerIndex = e.player.index;

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
			}

			else if(e.rightDown){
				gameObjects.add(DeckContextMenu(e.x, e.y, me));
			}

		}

		return result;
	};

	me.addCard = function(card){
		card.deleteMe = true;
		card.ownerIndex = ACTIVE_PLAYER;
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
		var temp = [];

		while(me.cards.length > 0){
			var i = random.next1000()%me.cards.length;
			temp.push(me.cards[i]);
			me.cards.splice(i, 1);
		}
		me.cards = temp;
	};

	return me;
};


var PassButton = function(x, y, player){
	var me = GameObject();
	me.type = OBJ_PASS;

	me.sortLayer = 8;
	me.img = IMG["button"];
	me.player = player;
	me.x = x;
	me.y = y;
	me.w = me.img.width;
	me.h = me.img.height;
	me.isUi = true;

	me.onDraw = function(ctx){
		ctx.fillStyle = me.player.color;
		var b = 2;
		if(me.player === players[ACTIVE_PLAYER]) b = 6;
		ctx.fillRect(me.x-b, me.y-b, me.w+2*b, me.h+2*b);
		ctx.drawImage(me.img, me.x, me.y);

		ctx.font = "36px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		ctx.fillText(me.player.name, me.x+Math.floor(me.w/2), me.y+10+Math.floor(me.h/2));
	};

	me.onMouseDown = function(e){
		var result = false;
		if(localPlayer === players[ACTIVE_PLAYER] && e.player === localPlayer && e.leftDown && me.contains(e.rawX, e.rawY)){
			result = true;

			input.add(me.player.index, PASS_CONTROL, 0, 0, 0, 0, false, false, false, false);
		}

		return result;
	};

	return me;
};


var SyncButton = function(x, y){
	var me = GameObject();
	me.type = OBJ_SYNC;

	me.sortLayer = 6;
	me.img = IMG["sync"];
	me.x = x;
	me.y = y;
	me.w = me.img.width;
	me.h = me.img.height;
	me.isUi = true;

	me.onDraw = function(ctx){
		ctx.drawImage(me.img, me.x, me.y);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.rawX, e.rawY)){
			result = true;

			gameObjects.add(SyncContextMenu(e.rawX, e.rawY, true));
			gameObjects.add(SyncContextMenu(e.rawX, e.rawY+65, false));
		}

		return result;
	};

	return me;
};


var SyncContextMenu = function(x, y, isConfirm){
	var me = GameObject();
	me.type = OBJ_SYNC_CONTEXT;

	me.sortLayer = 7;
	me.isConfirm = isConfirm;
	me.x = x;
	me.y = y;
	me.w = 150;
	me.h = 60;
	me.isUi = true;

	me.onDraw = function(ctx){
		if(me.isConfirm) ctx.drawImage(IMG["confirm"], me.x, me.y);
		else ctx.drawImage(IMG["cancel"], me.x, me.y);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.rawX, e.rawY)){
			result = true;
			
			if(me.isConfirm) input.sendWorldState();
		}

		return result;
	};

	me.onMouseUp = function(e){
		me.deleteMe = true;
	};

	return me;
};


var DeckContextMenu = function(x, y, deck){
	var me = GameObject();
	me.type = OBJ_DECK_CONTEXT;

	me.sortLayer = 7;
	me.x = x;
	me.y = y;
	me.deck = deck;
	me.w = 150*4;
	me.h = 60*4;

	me.onDraw = function(ctx){
		ctx.drawImage(IMG["shuffle"], me.x, me.y, me.w, me.h);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;
			me.deck.shuffle();
		}

		return result;
	};

	me.onMouseUp = function(e){
		me.deleteMe = true;
	};

	return me;
};


var DieContextMenu = function(x, y, die, value){
	var me = GameObject();
	me.type = OBJ_DIE_CONTEXT;

	me.sortLayer = 7;
	me.x = x;
	me.y = y;
	me.die = die;
	me.value = value;
	me.w = 150*4;
	me.h = 60*4;

	me.onDraw = function(ctx){
		ctx.drawImage(IMG["set"+me.value], me.x, me.y, me.w, me.h);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;
			me.die.setValue(me.value);
		}

		return result;
	};

	me.onMouseUp = function(e){
		me.deleteMe = true;
	};

	return me;
};



