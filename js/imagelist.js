'use strict';


//##############################################
//-----------------IMAGES-----------------------
//##############################################
var IMG = {};

addImageFile("button",		"button.png");
addImageFile("buttonDown",		"buttonDown.png");

function addImageFile(name, fileName){
	IMG[name] = new Image();
	IMG[name].src = "img/"+fileName;
}





