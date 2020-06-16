'use strict';


gameObjects = GameObjects();

//##############################################
//-----------------MOVABLE OBJECTS--------------
//##############################################
gameObjects.addConstructor('cube', function(args){
	var me = MovableObject(args);

	me.x = args[2];
	me.y = args[3];
	me.color = args[4];
	me.w = 48;
	me.h = 48;

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.color);
		return args;
	};

	me.onDraw = function(ctx){
		ctx.fillStyle = me.color;
		ctx.fillRect(me.viewX, me.viewY, me.w, me.h);
	};

	me.onDrawDetails = function(ctx, w, h){
		ctx.fillStyle = me.color;
		ctx.fillRect(0, 0, w, h);
		
	};

	return me;
});


gameObjects.addConstructor('tile', function(args){
	var me = MovableObject(args);
	
	me.x = args[2];
	me.y = args[3];
	me.img = args[4];
	me.w = IMG[me.img].width;
	me.h = IMG[me.img].height;

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.img);
		return args;
	};

	me.onDraw = function(ctx){
		ctx.drawImage(IMG[me.img], me.viewX, me.viewY);
	};

	me.onDrawDetails = function(ctx, w, h){
		var dx = 20;
		var dy = 20;

		ctx.fillStyle = "white";
		ctx.fillRect(dx-10, dy-10, w+20, h+20);

		ctx.drawImage(IMG[me.img], dx, dy, w, h);
	};

	return me;
});


gameObjects.addConstructor('tile3', function(args){
	var me = MovableObject(args);

	me.x = args[2];
	me.y = args[3];
	me.value = args[4];
	me.img = [];
	me.img[1] = args[5];
	me.img[2] = args[6];
	me.img[3] = args[7];
	
	me.w = IMG[me.img[1]].width;
	me.h = IMG[me.img[1]].height;


	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.value);
		args.push(me.img[1]);
		args.push(me.img[2]);
		args.push(me.img[3]);
		return args;
	};

	me.onDraw = function(ctx){
		ctx.drawImage(IMG[me.img[me.value]], me.viewX, me.viewY);
	};

	me.onDrawDetails = function(ctx, w, h){
		var dx = 20;
		var dy = 20;

		ctx.fillStyle = "white";
		ctx.fillRect(dx-10, dy-10, w+20, h+20);

		ctx.drawImage(IMG[me.img[me.value]], dx, dy, w, h);
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
					gameObjects.createObject(['dieContextMenu', null, e.x, e.y+260*i, me.id, val]);
				})(i);
				
			}
		}
		
		return result;
	};

	return me;
});


gameObjects.addConstructor('d6', function(args){
	var me = MovableObject(args);

	me.x = args[2];
	me.y = args[3];
	me.value = args[4];
	me.color = args[5];

	me.imgPrefix = "d6_";
	if(me.color === "black") me.imgPrefix = "kd6_";
	if(me.color === "blue") me.imgPrefix = "bd6_";
	if(me.color === "red") me.imgPrefix = "rd6_";
	me.w = IMG[me.imgPrefix+"1"].width;
	me.h = IMG[me.imgPrefix+"1"].height;

	me.spacingWidth = 300;
	me.spacingHeight = 300;

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.value);
		args.push(me.color);
		return args;
	};

	me.onDraw = function(ctx){
		if(me.animation > 0){
			var rval = (me.animation%6)+1;
			ctx.drawImage(IMG[me.imgPrefix+rval], me.viewX, me.viewY);
			me.animation--;
		}
		else{
			ctx.drawImage(IMG[me.imgPrefix+me.value], me.viewX, me.viewY);
		}
		
	};

	me.onDrawDetails = function(ctx, w, h){
		var dx = 20;
		var dy = 20;
		var dw = w/2;
		var dh = h/2;

		ctx.fillStyle = "white";
		ctx.fillRect(dx-10, dy-10, dw+20, dh+20);

		if(me.animation > 0){
			var rval = (me.animation%6)+1;
			ctx.drawImage(IMG[me.imgPrefix+rval], dx, dy, dw, dh);
		}
		else{
			ctx.drawImage(IMG[me.imgPrefix+me.value], dx, dy, dw, dh);
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
					gameObjects.createObject(['dieContextMenu', null, e.x, e.y+260*(i-1), me.id, val]);
				})(i);
				
			}
		}
		
		return result;
	};

	return me;
});


gameObjects.addConstructor('card', function(args){
	var me = MovableObject(args);

	
	me.x = args[2];
	me.y = args[3];
	me.ownerIndex = args[4];
	me.imgTop = args[5];
	me.imgBot = args[6];
	me.imgMask = args[7];
	me.isFaceUp = args[8];

	me.w = IMG[me.imgTop].width;
	me.h = IMG[me.imgTop].height;

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.ownerIndex);
		args.push(me.imgTop);
		args.push(me.imgBot);
		args.push(me.imgMask);
		args.push(me.isFaceUp);
		return args;
	};

	me.onDraw = function(ctx){
		//FACE UP
		if(me.isFaceUp){
			ctx.drawImage(IMG[me.imgTop], me.viewX, me.viewY);
		}

		//FACE DOWN
		else{
			if(localPlayer === me.getOwner()){
				ctx.drawImage(IMG[me.imgTop], me.viewX, me.viewY);
				ctx.drawImage(IMG[me.imgMask], me.viewX, me.viewY);
			}
			else{
				ctx.drawImage(IMG[me.imgBot], me.viewX, me.viewY);
			}
		}
	};

	me.onDrawDetails = function(ctx, w, h){
		var dx = 20;
		var dy = 20;

		ctx.fillStyle = "white";
		ctx.fillRect(dx-10, dy-10, w+20, h+20);

		//FACE UP
		if(me.isFaceUp){
			ctx.drawImage(IMG[me.imgTop], dx, dy, w, h);
		}

		//FACE DOWN
		else{
			if(localPlayer === me.getOwner()){
				ctx.drawImage(IMG[me.imgTop], dx, dy, w, h);
			}
			else{
				ctx.drawImage(IMG[me.imgBot], dx, dy, w, h);
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
});





//##############################################
//-----------------STATIC OBJECTS---------------
//##############################################
gameObjects.addConstructor('board', function(args){
	var me = GameObject(args);

	me.sortLayer = 2;

	me.x = args[2];
	me.y = args[3];
	me.img = args[4];

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.img);
		return args;
	};

	me.onDraw = function(ctx){
		ctx.drawImage(IMG[me.img], me.viewX, me.viewY);
	};

	return me;
});


gameObjects.addConstructor('deck', function(args){
	var me = GameObject(args);

	me.x = args[2];
	me.y = args[3];
	me.img = args[4];
	me.drawFaceUp = args[5];
	me.cardTemplates = args[6];
	
	me.w = IMG[me.img].width;
	me.h = IMG[me.img].height;
	me.cards = [];

	me.init = function(){
		for(var i=0; i<me.cardTemplates.length; i++){
			me.addCard(gameObjects.createObject(me.cardTemplates[i]));
		}
	};

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.img);
		args.push(me.drawFaceUp);

		var cards = [];
		for(var i=0; i<me.cards.length; i++){
			var card = me.cards[i];
			cards.push(card.export());
		}
		args.push(cards);

		return args;
	};

	me.onDraw = function(ctx){
		if(me.cards.length > 0){
			var max = clamp(me.cards.length, 1, 10);
			for(var i=0; i<max; i++) ctx.drawImage(IMG[me.img], me.viewX+i*1, me.viewY+i*1);
		}
		else{
			ctx.fillStyle = "red";
			ctx.fillRect(me.viewX, me.viewY, me.w, me.h);
		}

		//show number of cards remaining
		ctx.font = "150px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		ctx.fillText(""+me.cards.length, me.x+Math.floor(me.w/2), me.y+7+Math.floor(me.h/2));
	};

	me.onMouseDown = function(e){
		var result = false;

		if(e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;

			if(e.leftDown){
				if(me.cards.length > 0){
					var card = me.cards.pop();

					//face up?
					if(me.drawFaceUp){
						card.isFaceUp = true;
						card.ownerIndex = ACTIVE_PLAYER;
					}
					else{
						card.isFaceUp = false;
						card.ownerIndex = e.player.index;
					}

					//location
					card.x = me.x;
					card.y = me.y;
					card.viewX = card.x;
					card.viewY = card.y;
					card.deleteMe = false;

					//finish
					gameObjects.addObject(card);
				}
			}

			else if(e.rightDown){
				gameObjects.createObject(['deckContextMenu', null, e.x, e.y, me.id]);
			}

		}

		return result;
	};

	me.addCard = function(card){
		card.deleteMe = true;
		card.ownerIndex = ACTIVE_PLAYER;
		me.cards.push(card);
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

	me.init();
	return me;
});


gameObjects.addConstructor('passButton', function(args){
	var me = GameObject(args);
	
	me.x = args[2];
	me.y = args[3];
	me.playerIndex = args[4];

	me.sortLayer = 8;
	me.img = IMG["btop"];
	me.w = me.img.width;
	me.h = me.img.height;
	me.isUi = true;
	me.img2 = null;


	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.playerIndex);
		return args;
	};

	me.onDraw = function(ctx){
		var player = players[me.playerIndex];
		if(me.img2 === null) me.img2 = colorizeImage(IMG["btop"], null, player.color, 1);

		var dy = 5;
		if(player === players[ACTIVE_PLAYER]){
			dy = 0;
		}

		ctx.drawImage(me.img2, me.x, me.y);
		ctx.drawImage(me.img2, me.x, me.y-dy);
		if(dy > 0) ctx.drawImage(IMG["bbot"], me.x, me.y);
		ctx.font = "16px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		ctx.fillText(player.name, me.x+Math.floor(me.w/2), me.y+7+Math.floor(me.h/2)-dy);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(localPlayer === players[ACTIVE_PLAYER] && e.player === localPlayer && e.leftDown && me.contains(e.rawX, e.rawY)){
			result = true;

			input.add(me.playerIndex, PASS_CONTROL, 0, 0, 0, 0, false, false, false, false);
		}

		return result;
	};

	return me;
});


gameObjects.addConstructor('syncButton', function(args){
	var me = GameObject(args);

	me.x = args[2];
	me.y = args[3];

	me.sortLayer = 6;
	me.img = IMG["sync"];
	me.w = me.img.width;
	me.h = me.img.height;
	me.isUi = true;

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		return args;
	};

	me.onDraw = function(ctx){
		ctx.drawImage(me.img, me.x, me.y);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.rawX, e.rawY)){
			result = true;

			gameObjects.createObject(['syncContextMenu', null, e.rawX, e.rawY, true]);
			gameObjects.createObject(['syncContextMenu', null, e.rawX, e.rawY+65, false]);
		}

		return result;
	};

	return me;
});


gameObjects.addConstructor('syncContextMenu', function(args){
	var me = GameObject(args);
	
	me.x = args[2];
	me.y = args[3];
	me.isConfirm = args[4];

	me.sortLayer = 7;
	me.w = 150;
	me.h = 60;
	me.isUi = true;


	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.isConfirm);
		return args;
	};

	me.onDraw = function(ctx){
		if(me.isConfirm) ctx.drawImage(IMG["confirm"], me.x, me.y);
		else ctx.drawImage(IMG["cancel"], me.x, me.y);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.rawX, e.rawY)){
			result = true;
			
			if(me.isConfirm) input.syncWorlds();
		}

		return result;
	};

	me.onMouseUp = function(e){
		me.deleteMe = true;
	};

	return me;
});


gameObjects.addConstructor('deckContextMenu', function(args){
	var me = GameObject(args);
	
	me.x = args[2];
	me.y = args[3];
	me.deckId = args[4];

	me.sortLayer = 7;
	me.w = 150*4;
	me.h = 60*4;

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.deckId);
		return args;
	};

	me.onDraw = function(ctx){
		ctx.drawImage(IMG["shuffle"], me.x, me.y, me.w, me.h);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;
			gameObjects.getById(me.deckId).shuffle();
		}

		return result;
	};

	me.onMouseUp = function(e){
		me.deleteMe = true;
	};

	return me;
});


gameObjects.addConstructor('dieContextMenu', function(args){
	var me = GameObject(args);

	me.x = args[2];
	me.y = args[3];
	me.dieId = args[4];
	me.value = args[5];

	me.sortLayer = 7;
	me.w = 150*4;
	me.h = 60*4;

	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.id);
		args.push(me.x);
		args.push(me.y);
		args.push(me.dieId);
		args.push(me.value);
		return args;
	};

	me.onDraw = function(ctx){
		ctx.drawImage(IMG["set"+me.value], me.x, me.y, me.w, me.h);
	};

	me.onMouseDown = function(e){
		var result = false;
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			result = true;
			gameObjects.getById(me.dieId).setValue(me.value);
		}

		return result;
	};

	me.onMouseUp = function(e){
		me.deleteMe = true;
	};

	return me;
});



