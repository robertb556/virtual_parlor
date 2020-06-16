'use strict';


console.log("init Trucker.");

//##############################################
//-----------------IMAGES-----------------------
//##############################################
//set asset directory
assetDirectory = "modules/trucker/img/";

loadImageFile("board", "board.png");
loadImageFile("hex", "hex.png");
loadImageFile("hextop", "hextop.png");
loadImageFile("station", "station.png");
loadImageFile("truck", "truck.png");
loadImageFile("trucktop", "trucktop.png");
loadImageFile("coin", "coin.png");



//##############################################
//-----------------COMPOSIT IMAGES--------------
//##############################################
function createCompositeGameImages(){
	var cityColors = ["white", "olive", "mediumtorquoise", "lightsalmon", "mediumpurple", "black"];
	var playerColors = ["red", "blue", "yellow", "green"];

	for(var i=0; i<cityColors.length; i++) addImage("city"+i, colorizeImage(IMG["hex"], IMG["hextop"], cityColors[i], 1));
	for(var i=0; i<playerColors.length; i++) addImage("truck"+i, colorizeImage(IMG["truck"], IMG["trucktop"], playerColors[i], 1));
	for(var i=0; i<playerColors.length; i++) addImage("station"+i, colorizeImage(IMG["hex"], IMG["station"], playerColors[i], 1));

}




//##############################################
//-----------------OBJECTS----------------------
//##############################################
function loadGameElements(){
	//LAYOUT
	var x1 = 100;
	var y1 = -100;
	var y2 = -200;
	var s = 100;


	//OBJECTS

	//boards
	gameObjects.createObject(['board', null, 0, 0, "board"]);

	//west cities
	for(var i=1; i<=5; i++) gameObjects.createObject(['tile', null, x1, y1, "city"+i]);

	//east cities
	for(var i=0; i<7; i++) gameObjects.createObject(['tile', null, x1+s, y1, "city0"]);

	//coins
	for(var i=0; i<50; i++) gameObjects.createObject(['tile', null, x1+s*2, y1, "coin"]);

	//trucks
	for(var i=0; i<4; i++){
		for(var j=0; j<2; j++) gameObjects.createObject(['tile', null, x1+s*(3+i), y1, "truck"+i]);
	}

	//stations
	for(var i=0; i<4; i++){
		for(var j=0; j<2; j++) gameObjects.createObject(['tile', null, x1+s*(3+i), y2, "station"+i]);
	}
}
/*
function loadGameElements(){
	//layout
	var s1 = 200;
	var s2 = 300;
	var x1 = 2250;
	var y1 = 930;
	var y2 = y1+100;

	var startingWorkers = 12;

	var xoff = -40;
	var yoff = -85;

	
	for(var i=0; i<20; i++) gameObjects.createObject(['tile3', null, 1180+xoff, 6800+yoff, 1, "worker1", "pilot1", "ace1"]);
	for(var i=0; i<startingWorkers; i++) gameObjects.createObject(['tile3', null, 2250+xoff+278*i, 6795+yoff, 1, "worker1", "pilot1", "ace1"]);

	for(var i=0; i<20; i++) gameObjects.createObject(['tile3', null, 8200+xoff, 6226+yoff, 1, "worker2", "pilot2", "ace2"]);
	for(var i=0; i<startingWorkers; i++) gameObjects.createObject(['tile3', null, 8200+xoff, 6226+yoff-400-295*i, 1, "worker2", "pilot2", "ace2"]);

	for(var i=0; i<20; i++) gameObjects.createObject(['tile3', null, 150+xoff, 6226+yoff, 1, "worker3", "pilot3", "ace3"]);
	for(var i=0; i<startingWorkers; i++) gameObjects.createObject(['tile3', null, 150+xoff, 6226+yoff-400-295*i, 1, "worker3", "pilot3", "ace3"]);

	for(var i=0; i<20; i++) gameObjects.createObject(['tile3', null, 1250+xoff, 170+yoff, 1, "worker4", "pilot4", "ace4"]);
	for(var i=0; i<startingWorkers; i++) gameObjects.createObject(['tile3', null, 2300+xoff+278*i, 170+yoff, 1, "worker4", "pilot4", "ace4"]);

	//cubes
	for(var i=0; i<20; i++) gameObjects.createObject(['tile', null, x1, y2, "cube1"]);
	for(var i=0; i<20; i++) gameObjects.createObject(['tile', null, x1+s1, y2, "cube2"]);
	for(var i=0; i<20; i++) gameObjects.createObject(['tile', null, x1+s1*2, y2, "cube3"]);
	for(var i=0; i<20; i++) gameObjects.createObject(['tile', null, x1+s1*3, y2, "cube4"]);

	//dice
	for(var i=0; i<20; i++) gameObjects.createObject(['d6', null, 915, 950, 5, "white"]);
	for(var i=0; i<20; i++) gameObjects.createObject(['d6', null, 1280, 950, 5, "black"]);

	
	//boards
	gameObjects.createObject(['board', null, 0, 0, "board"]);

	//resource deck
	var deck = gameObjects.createObject(['deck', null, 1680, 5480, "resourceback", true, []]);
	for(var i=1; i<=16; i++) deck.addCard(gameObjects.createObject(['card', null, 0,0, ACTIVE_PLAYER, "resource"+i, "resourceback", "resourceback", true]));

	//buildings deck
	var deck = gameObjects.createObject(['deck', null, 4320, 2350, "buildingback", true, []]);
	for(var i=1; i<=18; i++) deck.addCard(gameObjects.createObject(['card', null, 0,0, ACTIVE_PLAYER, "building"+i, "buildingback", "buildingback", true]));

	//parts deck
	var deck = gameObjects.createObject(['deck', null, 2216, 2350, "partback", true, []]);
	for(var i=1; i<=23; i++) deck.addCard(gameObjects.createObject(['card', null, 0,0, ACTIVE_PLAYER, "part"+i, "partback", "partback", true]));
}
*/

