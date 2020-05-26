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
var gameObjects;
var activeElement;
//var main;


window.onload = function(){
	//INIT
	graphics = Graphics();
	mouse = Mouse();
	keyboard = Keyboard();
	gameObjects = GameObjects();
	graphics.start();

	//launch
	launch();
};

function launch(){
	//main = MainElement();
	//setActiveElement(main);
	Token(10,20, "yellow");
	Token(11,25, "green");
	Token(10,20, "yellow");
	Token(11,25, "green");
	Token(10,20, "yellow");
	Token(11,25, "green");
	Token(10,20, "yellow");
	Token(10,20, "yellow");
	Token(11,25, "green");

	tickStep();
}

function tickStep(){

	setTimeout(tickStep, 15);
}

function setActiveElement(element){
	activeElement = element;
	element.focus();
}



function lerp(start, end, percent){
	return start + percent * (end - start);
}

