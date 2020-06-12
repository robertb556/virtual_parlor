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

	me.scale = 1;
	me.windowSizer; 
	me.xOffset = DETAILS_WIDTH;
	me.yOffset = 0;
	me.zoom = 45;
	
	//Contexts
	me.staticCtx;
	me.activeCtx;
	
	me.frameCount = 0;
	me.doRepaint = true;

	
	me.initialize = function(){
		me.windowSizer 	= document.getElementById("windowSize");
		
		//Set up Contexts
		me.staticCtx				= me.newCanvas(1, null,  "#333").getContext("2d");
		me.activeCtx				= me.newCanvas(2, null,  null).getContext("2d");

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
		me.rescale(); //second call fixes chrome stupid scroll bars
		console.log("screen["+SCREEN_WIDTH+"]["+SCREEN_HEIGHT+"]");
		me.frame();
	};

	me.repaint = function(){
		me.doRepaint = true;
	};
	
	me.frame = function(){
		requestAnimationFrame(me.frame);
		me.frameCount++;

		if(localPlayer === null) return;


		//pull from input buffer
		for(var i=1; i<players.length; i++) input.play(players[i]);

		//dynamic objects
		gameObjects.checkIfDynamic();

		//draw
		if(me.doRepaint) me.paint();
		else me.draw();
	};



	//regular frame, only draw active stuff
	me.draw = function(){
		var ctx = me.activeCtx;

		//clear context
		me.clearContext(ctx);

		//pan & zoom
		ctx.save();
		ctx.translate(me.xOffset, me.yOffset);
		ctx.scale(ZOOM_LEVELS[me.zoom], ZOOM_LEVELS[me.zoom]);

		//held objects
		gameObjects.drawDynamic(ctx);

		//player mice
		for(var i=1; i<players.length; i++) players[i].drawMouse(ctx);

		//restore
		ctx.restore();

		//details view
		var obj = gameObjects.getAt(localPlayer.x, localPlayer.y);
		if(obj !== null) obj.drawDetails(ctx);

		//message
		if(input.inboundLocked || input.outboundLocked){
			ctx.font = "72px Arial";
			ctx.textAlign = "center";
			var x = Math.floor(SCREEN_WIDTH/2);
			var y = Math.floor(SCREEN_HEIGHT/2);
			ctx.fillStyle = "black";
			ctx.fillText("Please wait...", x+2, y+2);
			ctx.fillStyle = "red";
			ctx.fillText("Please wait...", x, y);
		}


		//DEBUG
		//mouse coordinates
		if(SHOW_MOUSE_COORDINATES){
			ctx.font = "18px Arial";
			ctx.textAlign = "left";
			ctx.fillStyle = "black";
			ctx.fillText(""+Math.floor(mouse.x)+", "+Math.floor(mouse.y)+" ", 21, 31);
			ctx.fillStyle = "white";
			ctx.fillText(""+Math.floor(mouse.x)+", "+Math.floor(mouse.y)+" ", 20, 30);
		}

		//current buffer's sizes
		//ctx.font = "18px Arial";
		//ctx.fillStyle = "white";
		//ctx.textAlign = "left";
		//for(var i=1; i<players.length; i++) ctx.fillText("player "+i+": "+players[i].buffer.length+" ", 600, i*50);
	};

	//redraw everything, much more expensive, only when necessary
	me.paint = function(){
		me.doRepaint = false;
		var ctx = me.staticCtx;

		//clear context
		me.clearContext(ctx);

		//details area
		//ctx.fillStyle = "#333";
		//ctx.fillRect(0,0,DETAILS_WIDTH, SCREEN_HEIGHT);

		//pan & zoom
		ctx.save();
		ctx.translate(me.xOffset, me.yOffset);
		ctx.scale(ZOOM_LEVELS[me.zoom], ZOOM_LEVELS[me.zoom]);

		//draw objects
		gameObjects.draw(ctx);

		//restore
		ctx.restore();

		//ui
		gameObjects.drawUi(ctx);

		//active player border
		if(localPlayer === players[ACTIVE_PLAYER]){
			var w = 5;
			ctx.lineWidth = w*2;
			ctx.strokeStyle = "gold";
			ctx.strokeRect(0+w, 0+w, SCREEN_WIDTH-2*w, SCREEN_HEIGHT-2*w);
		}


		//call draw
		me.draw();
	};


	me.clearContext = function(ctx){
		ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	};

	me.rescale = function(){
		//get window width & height
		var w = me.windowSizer.offsetWidth;
		var h = me.windowSizer.offsetHeight;

		
		//rescale
		for(var i=0; i<me.canvases.length; i++){
			var c = me.canvases[i];
			
			SCREEN_WIDTH = Math.floor(w/me.scale);
			SCREEN_HEIGHT = Math.floor(h/me.scale);

			c.width = SCREEN_WIDTH;
			c.height = SCREEN_HEIGHT;
			
			c.style.width = Math.floor(SCREEN_WIDTH * me.scale);
			c.style.height = Math.floor(SCREEN_HEIGHT * me.scale);
			
		}

	};

	/*
	//screen fill style
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
	*/

	me.pan = function(xoff, yoff){
		me.xOffset += xoff/me.scale;
		me.yOffset += yoff/me.scale;
		me.repaint();
	};

	me.zoomAt = function(zdelta, x, y){
		if(me.zoom+zdelta >= 0 && me.zoom+zdelta < ZOOM_LEVELS.length){
			me.xOffset += x * (ZOOM_LEVELS[me.zoom] - ZOOM_LEVELS[me.zoom+zdelta]);
			me.yOffset += y * (ZOOM_LEVELS[me.zoom] - ZOOM_LEVELS[me.zoom+zdelta]);
			
			me.zoom += zdelta;
		}
		me.repaint();
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