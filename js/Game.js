'use strict';


//##############################################
//-----------------CONSTANTS--------------------
//##############################################
//SETTINGS
var SHOW_TUTORIAL = true;


//UI
var SCREEN_WIDTH = 378; //960;
var SCREEN_HEIGHT = 612;


//##############################################
//-----------------VARS-------------------------
//##############################################
var graphics;
var mouse;
var keyboard;
var activeElement;



window.onload = function(){
	//INIT
	graphics = Graphics();
	mouse = Mouse();
	keyboard = Keyboard();
	graphics.start();

	//launch
	launch();
};

function launch(){
	setActiveElement(MainElement());

	tickStep();
}

function tickStep(){

	setTimeout(tickStep, 15);
}

function setActiveElement(element){
	activeElement = element;
	element.focus();
}





