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
	me.xOffset = 0;
	me.yOffset = 0;
	
	//Contexts
	me.mainCtx;
	
	me.frameCount = 0;

	
	me.initialize = function(){
		me.windowSizer 	= document.getElementById("windowSize");
		
		//Set up Contexts
		//me.blackBackgroundCtx	= me.newCanvas(1, null,  "black").getContext("2d");
		me.mainCtx				= me.newCanvas(2, null,  "black").getContext("2d");

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
		
		//prepare
		me.prepareFrame();

		//select context
		var ctx = me.mainCtx;

		//main draw
		if(activeElement) activeElement.draw(ctx);

		//finish
		me.finishFrame();
	};

	me.prepareFrame = function(){
		for(var i=0; i<me.contexts.length; i++){
			var ctx = me.contexts[i];
			
			//clear
			me.clearContext(ctx);

			//center all content on screen (use hoizontal offset)
			ctx.save();
			ctx.translate(me.xOffset, me.yOffset);
		}
	};

	me.finishFrame = function(){
		for(var i=0; i<me.contexts.length; i++){
			var ctx = me.contexts[i];

			//restore
			ctx.restore();
		}
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

	me.getTopCanvas = function(){
		return me.topCanvas;
	};
	
	me.initialize();
	return me;
};