'use strict';


//##############################################
//-----------------IMAGES-----------------------
//##############################################
var IMG = {};
var SIMG = {}; //small versions

addImageFile("board",		"board2.jpg");

addImageFile("d6_1",		"d6_1.png");
addImageFile("d6_2",		"d6_2.png");
addImageFile("d6_3",		"d6_3.png");
addImageFile("d6_4",		"d6_4.png");
addImageFile("d6_5",		"d6_5.png");
addImageFile("d6_6",		"d6_6.png");

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

addImageFile("back",		"back.png");
addImageFile("mask",		"mask.png");

addImageFile("c1",		"c1.png");
addImageFile("c2",		"c2.png");
addImageFile("c3",		"c3.png");
addImageFile("c4",		"c4.png");
addImageFile("c5",		"c5.png");
addImageFile("c6",		"c6.png");
addImageFile("c7",		"c7.png");
addImageFile("c8",		"c8.png");
addImageFile("c9",		"c9.png");
addImageFile("c10",		"c10.png");
addImageFile("c11",		"c11.png");
addImageFile("c12",		"c12.png");
addImageFile("c13",		"c13.png");
addImageFile("c14",		"c14.png");

addImageFile("button",		"button.png");


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