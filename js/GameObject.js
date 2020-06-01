'use strict';


//##############################################
//-----------------GAME OBJECTS-----------------
//##############################################
var OBJ_CUBE = 0;
var OBJ_D6 = 1;
var OBJ_CARD = 2;
var OBJ_MOUSE = 3;
var OBJ_BOARD = 4;
var OBJ_DECK = 5;
var OBJ_PASS = 6;
var OBJ_SYNC = 7;
var OBJ_SYNC_CONTEXT = 8;
var OBJ_DECK_CONTEXT = 9;
var OBJ_DIE_CONTEXT = 10;

var GameObjects = function(){
	var me = {};

	me.objects = [];

	me.tick = function(){
		me.removeDead();
		me.moveToTop();
	};

	me.setWorldState = function(state){
		var temp = [];

		for(var i=0; i<state.length; i++){
			var a = state[i];
			if(a.type === OBJ_CUBE){
				temp.push(Cube(a.x, a.y, a.color));
			}
			else if(a.type === OBJ_D6){
				temp.push(D6(a.x, a.y, a.value));
			}
			else if(a.type === OBJ_CARD){
				temp.push(Card(a.ownerIndex, a.x, a.y, a.imgTop, a.imgBot, a.imgMask, a.isFaceUp));
			}
			else if(a.type === OBJ_MOUSE){
				temp.push(PlayerMouse(players[a.playerIndex]));
			}
			else if(a.type === OBJ_BOARD){
				temp.push(Board(a.x, a.y, a.img));
			}
			else if(a.type === OBJ_DECK){
				var deck = Deck(a.x, a.y, a.img, a.drawFaceUp);
				for(var j=0; j<a.cards.length; j++){
					var c = a.cards[j];
					deck.cards.push(Card(c.ownerIndex, c.x, c.y, c.imgTop, c.imgBot, c.imgMask, c.isFaceUp));
				}
				temp.push(deck);
			}
			else if(a.type === OBJ_PASS){
				temp.push(PassButton(a.x, a.y, players[a.playerIndex]));
			}
			else if(a.type === OBJ_SYNC){
				temp.push(SyncButton(a.x, a.y));
			}
			else if(a.type === OBJ_SYNC_CONTEXT){
				temp.push(SyncContextMenu(a.x, a.y, a.isConfirm));
			}
			else if(a.type === OBJ_DECK_CONTEXT){
				temp.push(DeckContextMenu(a.x, a.y, temp[a.deckIndex]));
			}
			else if(a.type === OBJ_DIE_CONTEXT){
				temp.push(DieContextMenu(a.x, a.y, temp[a.dieIndex]));
			}
		}
		me.objects = temp;
	};

	me.getWorldState = function(){
		var world = [];

		for(var i=0; i<me.objects.length; i++){
			var a = me.objects[i];

			if(a.type === OBJ_CUBE){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				o.color = a.color;
				world.push(o);
			}
			else if(a.type === OBJ_D6){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				o.value = a.value;
				world.push(o);
			}
			else if(a.type === OBJ_CARD){
				var o = {};
				o.type = a.type;
				o.ownerIndex = a.ownerIndex;
				o.x = a.x;
				o.y = a.y;
				o.imgTop = a.imgTop;
				o.imgBot = a.imgBot;
				o.imgMask = a.imgMask;
				o.isFaceUp = a.isFaceUp;
				world.push(o);
			}
			else if(a.type === OBJ_MOUSE){
				var o = {};
				o.type = a.type;
				o.playerIndex = a.player.index;
				world.push(o);
			}
			else if(a.type === OBJ_BOARD){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				o.img = a.img;
				world.push(o);
			}
			else if(a.type === OBJ_DECK){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				o.img = a.img;
				o.drawFaceUp = a.drawFaceUp;
				o.cards = [];
				for(var j=0; j<a.cards.length; j++){
					var card = a.cards[j];
					var c = {};
					c.ownerIndex = card.ownerIndex;
					c.x = card.x;
					c.y = card.y;
					c.imgTop = card.imgTop;
					c.imgBot = card.imgBot;
					c.imgMask = card.imgMask;
					c.isFaceUp = card.isFaceUp;
					o.cards.push(c);
				}
				world.push(o);
			}
			else if(a.type === OBJ_PASS){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				o.playerIndex = a.player.index;
				world.push(o);
			}
			else if(a.type === OBJ_SYNC){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				world.push(o);
			}
			else if(a.type === OBJ_SYNC_CONTEXT){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				o.isConfirm = a.isConfirm;
				world.push(o);
			}
			else if(a.type === OBJ_DECK_CONTEXT){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				o.deckIndex = me.getIndex(a.deck);
				world.push(o);
			}
			else if(a.type === OBJ_DIE_CONTEXT){
				var o = {};
				o.type = a.type;
				o.x = a.x;
				o.y = a.y;
				o.dieIndex = me.getIndex(a.die);
				world.push(o);
			}
		}

		return world;
	};

	me.add = function(obj){
		me.objects.push(obj);
		me.sortObjects();
	};

	me.getIndex = function(object){
		for(var i=0; i<me.objects.length; i++){
			if(me.objects[i] === object) return i;
		}
		return -1;
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
			if(obj.type === OBJ_DECK && (obj.contains(topLeft[0], topLeft[1]) || obj.contains(bottomRight[0], bottomRight[1]) || obj.contains(topLeft[0], bottomRight[1]) || obj.contains(bottomRight[0], topLeft[1]))){
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
			if(!obj.isUi) obj.draw(ctx);
		}
	};

	me.drawUi = function(ctx){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			if(obj.isUi) obj.draw(ctx);
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
	me.isUi = false;  //draw without pan & zoom, eg. for UI stuff.

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
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			e.player.grab(me);
			success = true;
		}

		if(success || me.onMouseDown(e)) return true;
		else return false;
	};

	me.mouseMove = function(e){
		if(e.leftDown && e.player === me.getOwner() && me.contains(e.x, e.y)){
			e.player.grab(me);
		}

		if(e.player.isHolding(me)){
			me.x = Math.floor(e.player.getHeldX(me) - (me.w/2));
			me.y = Math.floor(e.player.getHeldY(me) - (me.h/2));
		}

		me.onMouseMove(e);
	};

	me.mouseUp = function(e){
		if(e.player === me.getOwner()) e.player.drop(me);

		me.onMouseUp(e);
	};

	return me;
};
