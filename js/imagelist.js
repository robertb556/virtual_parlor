'use strict';


//##############################################
//-----------------IMAGES-----------------------
//##############################################
var IMG = {};
var SIMG = {}; //small versions



for(var i=1; i<=6; i++) addImageFile("d6_"+i, "d6_"+i+".png");		//white dice
for(var i=1; i<=6; i++) addImageFile("db6_"+i, "bd6_"+i+".png");	//blue dice
for(var i=1; i<=6; i++) addImageFile("k6_"+i, "k6_"+i+".png");		//black dice
for(var i=1; i<=6; i++) addImageFile("r6_"+i, "r6_"+i+".png");		//red dice

for(var i=1; i<=18; i++) addImageFile("building"+i, "building"+i+".png");		//building cards
for(var i=1; i<=23; i++) addImageFile("part"+i, "part"+i+".png");				//part cards
for(var i=1; i<=16; i++) addImageFile("resource"+i, "resource"+i+".png");		//resource cards
for(var i=1; i<=18; i++) addImageFile("building"+i, "building"+i+".png");		//building cards
for(var i=1; i<=4; i++) addImageFile("worker"+i, "worker"+i+".png");			//worker tokens
for(var i=1; i<=4; i++) addImageFile("cube"+i, "cube"+i+".png");				//resource tokens

addImageFile("resourceback",		"resourceback.png");
addImageFile("buildingback",		"buildingback.png");
addImageFile("partback",			"partback.png");

addImageFile("pilot",		"pilot.png");
addImageFile("ace",			"ace.png");

addImageFile("turn_order",	"turn_order.png");


addImageFile("button",		"button.png");
addImageFile("sync",		"sync.png");
addImageFile("cancel",		"cancel.png");
addImageFile("confirm",		"confirm.png");
addImageFile("shuffle",		"shuffle.png");
addImageFile("set1",		"set1.png");
addImageFile("set2",		"set2.png");
addImageFile("set3",		"set3.png");
addImageFile("set4",		"set4.png");
addImageFile("set5",		"set5.png");
addImageFile("set6",		"set6.png");




function addImageFile(name, fileName){
	IMG[name] = new Image();
	IMG[name].src = "img/"+fileName;
}


function loadImages(){
	for(var name in IMG){
		if(IMG.hasOwnProperty(name)){
			SIMG[name] = getSmallImg(IMG[name], IMAGE_SCALE);
		}
	}
}


function getSmallImg(img, scale){
	var canvas = document.createElement("canvas");
	canvas.width = Math.floor(img.width/scale);
	canvas.height = Math.floor(img.height/scale);
	var ctx = canvas.getContext('2d');
	
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
	return canvas;
}