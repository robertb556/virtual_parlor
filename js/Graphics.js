'use strict';


//##############################################
//-----------------GRAPHICS---------------------
//##############################################
var Graphics = function(){
	var me = Object.create(null);
	
	//Canvas's
	me.canvases = [];
	me.contexts = [];
	me.topCanvas;

	me.scale = 2;
	me.windowSizer; 
	me.xOffset = DETAILS_WIDTH;
	me.yOffset = 0;
	me.zoom = 20;
	
	//Contexts
	me.mainCtx;
	me.detailsCtx;
	
	me.frameCount = 0;

	
	me.initialize = function(){
		me.windowSizer 	= document.getElementById("windowSize");
		
		//Set up Contexts
		me.mainCtx				= me.newCanvas(1, null,  "#222").getContext("2d");
		me.detailsCtx			= me.newCanvas(2, null,  null).getContext("2d");

		//Prevent default right click menu so we can use right clicks for input
		document.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);
	};
	
	me.newCanvas = function(zIndex, opacity, color){
		var canvas					= document.createElement("canvas");
		canvas.width				= SCREEN_WIDTH;
		canvas.height				= SCREEN_HEIGHT;
		canvas.style.border			= '0px solid black';
		canvas.style.padding		= "0px 0px 0px 0px";
		canvas.style.margin			= "0px 0px 0px 0px";
		canvas.style.position		= 'absolute';
		canvas.style.top			= '0px';
		canvas.style.left			= '0px';
		canvas.style.zIndex			= zIndex;
		if(color !== null)		canvas.style.backgroundColor = color;
		if(opacity !== null)	canvas.style.opacity = opacity;
		document.getElementById("main").appendChild(canvas);
		
		if(me.topCanvas === undefined || zIndex > me.topCanvas.style.zIndex) me.topCanvas = canvas;

		var ctx = canvas.getContext("2d");
		ctx.save(); //initially save context cause we're going to restore it next. (probably not nessisary, but just in case).

		me.canvases.push(canvas);
		me.contexts.push(ctx);
		return canvas;
	};

	
	//DRAW METHODS
	me.start = function(){
		me.rescale();
		me.frame();
	};
	
	me.frame = function(){
		requestAnimationFrame(me.frame);
		me.frameCount++;

		//pull from input buffer
		for(var i=1; i<players.length; i++) input.play(players[i]);

		//clear contexts
		me.clearContext(me.mainCtx);
		me.clearContext(me.detailsCtx);

		//save
		me.mainCtx.save();
			
		//pan
		me.mainCtx.translate(me.xOffset, me.yOffset);

		//zoom
		me.mainCtx.scale(ZOOM_LEVELS[me.zoom], ZOOM_LEVELS[me.zoom]);

		//draw objects
		gameObjects.draw(me.mainCtx);

		//draw player mice on top
		for(var i=1; i<players.length; i++) players[i].drawMouse(me.mainCtx);

		//restore
		me.mainCtx.restore();

		//draw details
		var obj = gameObjects.getAt(localPlayer.x, localPlayer.y);
		if(obj !== null) obj.drawDetails(me.mainCtx);


		//ui
		gameObjects.drawUi(me.mainCtx);

		//active player border
		if(localPlayer === players[ACTIVE_PLAYER]){
			var w = 5;
			me.mainCtx.lineWidth = w*2;
			me.mainCtx.strokeStyle = "gold";
			me.mainCtx.strokeRect(0+w, 0+w, SCREEN_WIDTH-2*w, SCREEN_HEIGHT-2*w);
		}


		



		/*
		//temp
		ctx.font = "36px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "left";
		var text = "buffer[";
		for(var i=0; i<input.buffer.length; i++){
			var n = input.buffer.at(i);
			if(n !== null) text += ","+n.type;
			else text += ",x";
		}
		text += "]";
		//ctx.fillText(""+input.buffer.length, 200, 200);
		ctx.fillText(input.buffer.length+" "+text, 200, 200);
		*/

	};

	me.clearContext = function(ctx){
		ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	};

	me.rescale = function(){
		//get window width & height
		var w = me.windowSizer.offsetWidth;
		var h = me.windowSizer.offsetHeight;

		//determine limiting axis (width or height)
		var wratio = w / SCREEN_WIDTH;
		var hratio = h / SCREEN_HEIGHT;
		
		if(hratio < wratio) me.scale = hratio;
		else me.scale = wratio;
		
		//rescale
		for(var i=0; i<me.canvases.length; i++){
			var c = me.canvases[i];
			
			if(hratio < wratio){
				SCREEN_WIDTH = Math.floor(w/me.scale);
				c.width = SCREEN_WIDTH;
			}else{
				SCREEN_HEIGHT = Math.floor(h/me.scale);
				c.height = SCREEN_HEIGHT;
			}
			
			
			c.style.width = Math.floor(SCREEN_WIDTH * me.scale);
			c.style.height = Math.floor(SCREEN_HEIGHT * me.scale);
			
		}

	};

	me.pan = function(xoff, yoff){
		me.xOffset += xoff/me.scale;
		me.yOffset += yoff/me.scale;
	};

	me.zoomAt = function(zdelta, x, y){
		if(me.zoom+zdelta >= 0 && me.zoom+zdelta < ZOOM_LEVELS.length){
			me.xOffset += x * (ZOOM_LEVELS[me.zoom] - ZOOM_LEVELS[me.zoom+zdelta]);
			me.yOffset += y * (ZOOM_LEVELS[me.zoom] - ZOOM_LEVELS[me.zoom+zdelta]);
			
			me.zoom += zdelta;
		}
	};

	me.getCurrentScale = function(){
		return ZOOM_LEVELS[me.zoom];
	};

	me.getTopCanvas = function(){
		return me.topCanvas;
	};
	
	me.initialize();
	return me;
};