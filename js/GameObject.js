'use strict';


//##############################################
//-----------------GAME OBJECTS-----------------
//##############################################
var OBJ_CUBE = 0;
var OBJ_TILE = 1;
var OBJ_TILE3 = 2;
var OBJ_D6 = 3;
var OBJ_CARD = 4;
var OBJ_BOARD = 6;
var OBJ_DECK = 7;
var OBJ_PASS = 8;
var OBJ_SYNC = 9;
var OBJ_SYNC_CONTEXT = 10;
var OBJ_DECK_CONTEXT = 11;
var OBJ_DIE_CONTEXT = 12;

var GameObjects = function(){
	var me = {};

	me.objects = [];
	me.constructors = {};
	me.uidCount = 0;

	me.getUID = function(){
		return me.uidCount++;
	};

	me.addConstructor = function(type, constructor){
		me.constructors[type] = constructor;
	};

	me.createObject = function(args){
		var obj = me.constructors[args[0]](args);
		return me.addObject(obj);
	};

	me.addObject = function(obj){
		me.objects.push(obj);
		me.sortObjects();
		graphics.repaint();
		return obj;
	};

	me.tick = function(){
		me.removeDead();
		me.moveToTop();
	};

	me.setWorldState = function(state){
		me.objects.length = 0;

		for(var i=0; i<state.length; i++){
			var args = state[i];
			me.createObject(args);
		}
	};

	me.getWorldState = function(){
		var world = [];

		for(var i=0; i<me.objects.length; i++){
			world.push(me.objects[i].export());
		}

		return world;
	};

	me.getIndex = function(object){
		for(var i=0; i<me.objects.length; i++){
			if(me.objects[i] === object) return i;
		}
		return -1;
	};

	me.getById = function(id){
		for(var i=0; i<me.objects.length; i++){
			if(me.objects[i].id === id) return me.objects[i];
		}
		return null;
	};

	me.getAt = function(x,y){
		for(var i=me.objects.length-1; i>=0; i--){
			var obj = me.objects[i];
			if(obj.contains(x,y)) return obj;
		}
		return null;
	};

	me.getGridAt = function(x, y, gridList){
		for(var i=me.objects.length-1; i>=0; i--){ //start at highest and work down
			var obj = me.objects[i];
			if(obj.isGrid){

				//if any of the grids we are looking for contain it
				for(var j=0; j<gridList.length; j++) if(obj.gridName === gridList[j] && obj.contains(x, y)) return obj;
			}
		}
		return null;
	};

	me.getDeckIntersectsAt = function(topLeft, bottomRight){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			if(obj.type === 'deck' && (obj.contains(topLeft[0], topLeft[1]) || obj.contains(bottomRight[0], bottomRight[1]) || obj.contains(topLeft[0], bottomRight[1]) || obj.contains(bottomRight[0], topLeft[1]))){
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
				me.addObject(obj);
				obj.moveToTop = false;
			}
		}
	};

	me.removeDead = function(){
		var index = 0;
		while(index < me.objects.length){
			var obj = me.objects[index];
			if(obj.deleteMe){
				console.log("deleting");
				obj.deleteMe = false;
				me.objects.splice(index, 1);
				graphics.repaint();
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

	me.checkIfDynamic = function(){
		for(var i=0; i<me.objects.length; i++){
			me.objects[i].checkIfDynamic();
		}
	};

	me.draw = function(ctx){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			if(!obj.isUi && !obj.isDynamic) obj.draw(ctx);
		}
	};

	me.drawUi = function(ctx){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			if(obj.isUi) obj.draw(ctx);
		}
	};

	me.drawDynamic = function(ctx){
		for(var i=0; i<me.objects.length; i++){
			var obj = me.objects[i];
			if(!obj.isUi && obj.isDynamic) obj.draw(ctx);
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
var GameObject = function(args){
	var me = {};

	//args
	me.type = args.shift();
	me.x = args.shift();
	me.y = args.shift();
	me.id = args.shift();
	if(me.id === null) me.id = gameObjects.getUID();
	me.gridList = args.shift();


	me.w = 0;
	me.h = 0;
	me.sortLayer = 4;
	me.ownerIndex = ACTIVE_PLAYER;
	me.animation = 0;
	me.deleteMe = false;
	me.moveToTop = false;
	me.isUi = false;  //draw without pan & zoom, eg. for UI stuff.
	me.isDynamic = true;

	me.isMultiPickup = false;
	me.isLockedPickup = false;

	me.viewX = 0;
	me.viewY = 0;

	me.spacingWidth = 200;
	me.spacingHeight = 200;
	me.spacingRowLength = 5;


	me.export = function(){
		var args = [];
		args.push(me.type);
		args.push(me.x);
		args.push(me.y);
		args.push(me.id);
		args.push(me.gridList);
		return me.onExport(args);
	};

	me.autoSetSpacing = function(){
		var sw = me.w;
		if(me.w > 4096) sw += 400;
		else if(me.w > 2048) sw += 200;
		else if(me.w > 1024) sw += 100;
		else if(me.w > 512) sw += 50;
		else if(me.w > 256) sw += 25;
		else if(me.w > 128) sw += 13;
		else if(me.w > 64) sw += 6;
		else if(me.w > 32) sw += 3;
		else if(me.w > 16) sw += 1;

		var sh = me.h;
		if(me.w > 4096) sh += 400;
		else if(me.w > 2048) sh += 200;
		else if(me.w > 1024) sh += 100;
		else if(me.w > 512) sh += 50;
		else if(me.w > 256) sh += 25;
		else if(me.w > 128) sh += 13;
		else if(me.w > 64) sh += 6;
		else if(me.w > 32) sh += 3;
		else if(me.w > 16) sh += 1;
		
		me.spacingWidth = sw;
		me.spacingHeight = sh;
	};

	me.getOwner = function(){
		return players[me.ownerIndex];
	};

	me.contains = function(x,y){
		if(x>me.x && x<me.x+me.w && y>me.y && y<me.y+me.h) return true;
		else return false;
	};

	me.checkIfDynamic = function(){
		var dynamic = false;

		if(Math.abs(me.x-me.viewX)+Math.abs(me.y-me.viewY) > 1) dynamic = true;

		if(me.animation > 0) dynamic = true;

		if(me.isDynamic !== dynamic){
			me.isDynamic = dynamic;
			graphics.repaint();
		}
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
		var scale = 1/IMAGE_SCALE;
		if(DETAILS_WIDTH < me.w) scale = DETAILS_WIDTH / me.w;
		var w = me.w * scale;
		var h = me.h * scale;

		me.onDrawDetails(ctx, w, h);
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
	me.onExport = function(args){};
	me.onDraw = function(ctx){};
	me.onDrawDetails = function(ctx){};
	me.onMouseDown = function(e){};
	me.onMouseUp = function(e){};
	me.onMouseMove = function(e){};
	me.onDrop = function(){};

	return me;
};


//##############################################
//-----------------MOVABLE OBJECT---------------
//##############################################
var MovableObject = function(args){
	var me = GameObject(args);

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


//##############################################
//-----------------TILE OBJECT------------------
//##############################################
var TileObject = function(args){
	var me = MovableObject(args);
	
	me.img = args.shift();

	me.w = IMG[me.img].width;
	me.h = IMG[me.img].height;
	me.autoSetSpacing();

	me.onExport = function(args){
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

	me.onDrop = function(){
		var x = me.x+Math.floor(me.w/2);
		var y = me.y+Math.floor(me.h/2);
		var grid = gameObjects.getGridAt(x, y, me.gridList);
		console.log("grid["+grid+"]");
		if(grid){
			me.x = grid.snapX(x, y);
			me.y = grid.snapY(x, y);
		}
	};

	return me;
};