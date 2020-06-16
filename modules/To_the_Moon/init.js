'use strict';


console.log("init To the Moon.");

//##############################################
//-----------------IMAGES-----------------------
//##############################################
//set asset directory
assetDirectory = "modules/to_the_moon/img/";

//load images
for(var i=1; i<=18; i++) loadImageFile("building"+i, "building"+i+".png");		//building cards
for(var i=1; i<=23; i++) loadImageFile("part"+i, "part"+i+".png");				//part cards
for(var i=1; i<=16; i++) loadImageFile("resource"+i, "resource"+i+".png");		//resource cards
for(var i=1; i<=4; i++) loadImageFile("cube"+i, "cube"+i+".png");				//resource tokens

loadImageFile("resourceback",		"resourceback.png");
loadImageFile("buildingback",		"buildingback.png");
loadImageFile("partback",			"partback.png");
loadImageFile("worker",				"worker.png");
loadImageFile("workerTop",			"workerTop.png");
loadImageFile("pilot",				"pilot.png");
loadImageFile("ace",				"ace.png");
loadImageFile("board",				"board.png");



//##############################################
//-----------------COMPOSIT IMAGES--------------
//##############################################
function createCompositeGameImages(){
	//workers
	for(var i=1; i<=4; i++){
		addImage("worker"+i, colorizeImage(IMG["worker"], IMG["workerTop"], COLORS[i], 1));
		addImage("pilot"+i, colorizeImage(IMG["worker"], IMG["pilot"], COLORS[i], 1));
		addImage("ace"+i, colorizeImage(IMG["worker"], IMG["ace"], COLORS[i], 1));
	}
}




//##############################################
//-----------------OBJECTS----------------------
//##############################################
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

	
	for(var i=0; i<20; i++) gameObjects.createObject(['tile3', 1180+xoff, 6800+yoff, null, [], 1, "worker1", "pilot1", "ace1"]);
	for(var i=0; i<startingWorkers; i++) gameObjects.createObject(['tile3', 2250+xoff+278*i, 6795+yoff, null, [], 1, "worker1", "pilot1", "ace1"]);

	for(var i=0; i<20; i++) gameObjects.createObject(['tile3', 8200+xoff, 6226+yoff, null, [], 1, "worker2", "pilot2", "ace2"]);
	for(var i=0; i<startingWorkers; i++) gameObjects.createObject(['tile3', 8200+xoff, 6226+yoff-400-295*i, null, [], 1, "worker2", "pilot2", "ace2"]);

	for(var i=0; i<20; i++) gameObjects.createObject(['tile3', 150+xoff, 6226+yoff, null, [], 1, "worker3", "pilot3", "ace3"]);
	for(var i=0; i<startingWorkers; i++) gameObjects.createObject(['tile3', 150+xoff, 6226+yoff-400-295*i, null, [], 1, "worker3", "pilot3", "ace3"]);

	for(var i=0; i<20; i++) gameObjects.createObject(['tile3', 1250+xoff, 170+yoff, null, [], 1, "worker4", "pilot4", "ace4"]);
	for(var i=0; i<startingWorkers; i++) gameObjects.createObject(['tile3', 2300+xoff+278*i, 170+yoff, null, [], 1, "worker4", "pilot4", "ace4"]);

	//cubes
	for(var i=0; i<20; i++) gameObjects.createObject(['tile', x1, y2, null, [], "cube1"]);
	for(var i=0; i<20; i++) gameObjects.createObject(['tile', x1+s1, y2, null, [], "cube2"]);
	for(var i=0; i<20; i++) gameObjects.createObject(['tile', x1+s1*2, y2, null, [], "cube3"]);
	for(var i=0; i<20; i++) gameObjects.createObject(['tile', x1+s1*3, y2, null, [], "cube4"]);

	//dice
	for(var i=0; i<20; i++) gameObjects.createObject(['d6', 915, 950, null, [], 5, "white"]);
	for(var i=0; i<20; i++) gameObjects.createObject(['d6', 1280, 950, null, [], 5, "black"]);

	
	//boards
	gameObjects.createObject(['board', 0, 0, null, [], "board"]);

	//resource deck
	var deck = gameObjects.createObject(['deck', 1680, 5480, null, [], "resourceback", true, []]);
	for(var i=1; i<=16; i++) deck.addCard(gameObjects.createObject(['card', 0,0, null, [], ACTIVE_PLAYER, "resource"+i, "resourceback", "resourceback", true]));

	//buildings deck
	var deck = gameObjects.createObject(['deck', 4320, 2350, null, [], "buildingback", true, []]);
	for(var i=1; i<=18; i++) deck.addCard(gameObjects.createObject(['card', 0, 0, null, [], ACTIVE_PLAYER, "building"+i, "buildingback", "buildingback", true]));

	//parts deck
	var deck = gameObjects.createObject(['deck', 2216, 2350, null, [], "partback", true, []]);
	for(var i=1; i<=23; i++) deck.addCard(gameObjects.createObject(['card', 0, 0, null, [], ACTIVE_PLAYER, "part"+i, "partback", "partback", true]));
}


