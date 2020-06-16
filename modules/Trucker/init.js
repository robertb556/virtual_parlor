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
loadImageFile("cube", "cube.png");
loadImageFile("cubetop", "cubetop.png");



//##############################################
//-----------------COMPOSIT IMAGES--------------
//##############################################
function createCompositeGameImages(){
	//zoom & pan
	graphics.zoom = 76
	graphics.yOffset += 140;

	//images
	var cityColors = ["white", "Gold", "SpringGreen", "DeepSkyBlue", "Tomato", "DarkOrchid"];
	var playerColors = ["Brown", "DodgerBlue", "yellow", "green"];

	for(var i=0; i<cityColors.length; i++) addImage("city"+i, colorizeImage(IMG["hex"], IMG["hextop"], cityColors[i], 1));
	for(var i=0; i<cityColors.length; i++) addImage("cube"+i, colorizeImage(IMG["cube"], IMG["cubetop"], cityColors[i], 1));
	for(var i=0; i<COLORS.length-1; i++) addImage("truck"+i, colorizeImage(IMG["truck"], IMG["trucktop"], COLORS[i+1], 1));
	for(var i=0; i<COLORS.length-1; i++) addImage("station"+i, colorizeImage(IMG["hex"], IMG["station"], COLORS[i+1], 1));
}




//##############################################
//-----------------OBJECTS----------------------
//##############################################
function loadGameElements(){

	//LAYOUT
	var x1 = 0;
	var x2 = 600;
	var y1 = -100;
	var y2 = -200;
	var s = 100;


	//OBJECTS

	//boards
	gameObjects.createObject(['board', 0, 0, null, [], "board"]);

	//grid
	gameObjects.createObject(['hexGrid', -2, -1017, null, [], false, 32, 40, 43.25, 57.75, "grid1"]);
	
	//cubes
	var cubeQty = 16;
	var deck = gameObjects.createObject(['deck', x1+10, y1+40, null, [], "cube0", true, []]);
	for(var i=1; i<=cubeQty; i++) deck.addCard(gameObjects.createObject(['card', 0,0, null, [], ACTIVE_PLAYER, "cube1", "cube0", "cube0", true]));
	for(var i=1; i<=cubeQty; i++) deck.addCard(gameObjects.createObject(['card', 0,0, null, [], ACTIVE_PLAYER, "cube2", "cube0", "cube0", true]));
	for(var i=1; i<=cubeQty; i++) deck.addCard(gameObjects.createObject(['card', 0,0, null, [], ACTIVE_PLAYER, "cube3", "cube0", "cube0", true]));
	for(var i=1; i<=cubeQty; i++) deck.addCard(gameObjects.createObject(['card', 0,0, null, [], ACTIVE_PLAYER, "cube4", "cube0", "cube0", true]));
	for(var i=1; i<=cubeQty; i++) deck.addCard(gameObjects.createObject(['card', 0,0, null, [], ACTIVE_PLAYER, "cube5", "cube0", "cube0", true]));

	//west cities
	for(var i=1; i<=5; i++) gameObjects.createObject(['tile', x1+s*i, y2+20, null, ['grid1'], "city"+i]);

	//east cities
	for(var i=0; i<7; i++) gameObjects.createObject(['tile', x2+s, y1, null, ['grid1'], "city0"]);

	//coins
	for(var i=0; i<50; i++) gameObjects.createObject(['tile', x2+s*2, y1, null, [], "coin"]);

	//trucks
	for(var i=0; i<4; i++){
		for(var j=0; j<1; j++) gameObjects.createObject(['tile', x2+s*(3+i), y2, null, ['grid1'], "truck"+i]);
	}

	//stations
	for(var i=0; i<4; i++){
		for(var j=0; j<14; j++) gameObjects.createObject(['tile', x2+s*(3+i), y1, null, ['grid1'], "station"+i]);
	}
}


