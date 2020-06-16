'use strict';





function colorizeImage(base, top, color, opacity){
	var canvas = document.createElement("canvas");
	canvas.width = base.width;
	canvas.height = base.height;
	var ctx = canvas.getContext('2d');
	
	
	ctx.drawImage(base, 0, 0);
	
	ctx.globalCompositeOperation = "source-atop";
	//ctx.globalAlpha = 1;
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, base.width, base.height);
	
	ctx.globalCompositeOperation = "source-over";
	//ctx.globalAlpha = 1;
	if(top) ctx.drawImage(top, 0, 0);
	
	
	//opacity
	var canvas2 = document.createElement("canvas");
	canvas2.width = base.width;
	canvas2.height = base.height;
	var ctx2 = canvas2.getContext('2d');
	
	ctx2.globalAlpha = opacity;
	ctx2.drawImage(canvas, 0, 0);
	ctx2.globalAlpha = 1;
	
	return canvas2;
}



//##############################################
//-----------------IMAGES-----------------------
//##############################################
var IMG = {};

//set asset directory
assetDirectory = "img/";

//load images
for(var i=1; i<=6; i++) loadImageFile("d6_"+i, "d6_"+i+".png");			//white dice
for(var i=1; i<=6; i++) loadImageFile("db6_"+i, "bd6_"+i+".png");		//blue dice
for(var i=1; i<=6; i++) loadImageFile("kd6_"+i, "kd6_"+i+".png");		//black dice
for(var i=1; i<=6; i++) loadImageFile("rd6_"+i, "rd6_"+i+".png");		//red dice

loadImageFile("mouse",		"mouse.png");
loadImageFile("mouseTop",	"mouseTop.png");
loadImageFile("btop",		"btop.png");
loadImageFile("bbot",		"bbot.png");
loadImageFile("button",		"button.png");
loadImageFile("sync",		"sync.png");
loadImageFile("cancel",		"cancel.png");
loadImageFile("confirm",	"confirm.png");
loadImageFile("shuffle",	"shuffle.png");
loadImageFile("set1",		"set1.png");
loadImageFile("set2",		"set2.png");
loadImageFile("set3",		"set3.png");
loadImageFile("set4",		"set4.png");
loadImageFile("set5",		"set5.png");
loadImageFile("set6",		"set6.png");




function loadImageFile(name, fileName){
	IMG[name] = new Image();
	IMG[name].src = assetDirectory+fileName;
}

function addImage(name, img){
	IMG[name] = img;
}


function getSmallImg(img, scale){
	var canvas = document.createElement("canvas");
	canvas.width = Math.floor(img.width/scale);
	canvas.height = Math.floor(img.height/scale);
	var ctx = canvas.getContext('2d');
	
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
	return canvas;
}