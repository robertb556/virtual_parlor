'use strict';


console.log("init Trucker.");



//##############################################
//-----------------IMAGES-----------------------
//##############################################
//set asset directory
assetDirectory = "modules/Trucker/img/";
CONTEXT_MENU_SCALE = 1;
DETAILS_WIDTH = 150;

loadImageFile("board", "board.png");
loadImageFile("hex", "hex.png");
loadImageFile("hextop", "hextop.png");
loadImageFile("station", "station.png");
loadImageFile("truck", "truck.png");
loadImageFile("truckt1", "truckt1.png");
loadImageFile("truckt2", "truckt2.png");
loadImageFile("truckt3", "truckt3.png");
loadImageFile("truckt4", "truckt4.png");
loadImageFile("coin", "coin.png");
loadImageFile("cube", "cube.png");
loadImageFile("cubetop", "cubetop.png");
loadImageFile("cubemask", "cubemask.png");
loadImageFile("firstplayer", "firstplayer.png");
loadImageFile("convoy", "convoy.png");



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
	for(var i=1; i<COLORS.length; i++) addImage("truck1"+i, colorizeImage(IMG["truck"], IMG["truckt1"], COLORS[i], 1));
	for(var i=1; i<COLORS.length; i++) addImage("truck2"+i, colorizeImage(IMG["truck"], IMG["truckt2"], COLORS[i], 1));
	for(var i=1; i<COLORS.length; i++) addImage("truck3"+i, colorizeImage(IMG["truck"], IMG["truckt3"], COLORS[i], 1));
	for(var i=1; i<COLORS.length; i++) addImage("truck4"+i, colorizeImage(IMG["truck"], IMG["truckt4"], COLORS[i], 1));
	for(var i=1; i<COLORS.length; i++) addImage("station"+i, colorizeImage(IMG["hex"], IMG["station"], COLORS[i], 1));
}




//##############################################
//-----------------OBJECTS----------------------
//##############################################
function loadGameElements(){

	//LAYOUT
	var p1 = {x:-100, y:550};
	var p2 = {x:700, y:-100};
	var p3 = {x:1450, y:550};
	var p4 = {x:700, y:1225};
	var c1 = {x:-50, y:-50};
	

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
	
	//primary cubes deck
	var cubeQty = 16; //qty of each color
	var deck = gameObjects.createObject(['deck', c1.x, c1.y, null, [], "cube0", true, []]);
	for(var c=1; c<=5; c++){
		for(var i=1; i<=cubeQty; i++) deck.addCard(gameObjects.createObject(['card', 0,0, null, [], ACTIVE_PLAYER, "cube"+c, "cube0", "cubemask", true]));
	}
	deck.shuffle();

	//secondary cubes deck
	var cubeQty = 4; //qty of each color
	var deck2 = gameObjects.createObject(['deck', c1.x-150, c1.y, null, [], "cube0", true, []]);
	for(var c=1; c<=5; c++){
		for(var i=1; i<=cubeQty; i++) deck2.addCard(gameObjects.createObject(['card', 0,0, null, [], ACTIVE_PLAYER, "cube"+c, "cube0", "cubemask", true]));
	}
	deck2.shuffle();
	
	//west cities
	for(var i=1; i<=5; i++) gameObjects.createObject(['lockedTile', c1.x-150, c1.y-140, null, ['grid1'], "city"+i]);
	
	//east cities
	for(var i=0; i<9; i++) gameObjects.createObject(['lockedTile', c1.x-30, c1.y-140, null, ['grid1'], "city0"]);
	
	//coins
	for(var i=0; i<12; i++) gameObjects.createObject(['tile', c1.x-75, c1.y, null, [], "coin"]);

	//player coins
	gameObjects.createObject(['tile', p1.x-100, p1.y+100, null, [], "coin"]);
	gameObjects.createObject(['tile', p2.x+100, p2.y-100, null, [], "coin"]);
	gameObjects.createObject(['tile', p3.x+100, p3.y+100, null, [], "coin"]);
	gameObjects.createObject(['tile', p4.x+100, p4.y+100, null, [], "coin"]);

	//trucks
	gameObjects.createObject(['multiTile', p1.x-100, p1.y, null, ['grid1'], 1, ["truck11","truck21","truck31","truck41"]]);
	gameObjects.createObject(['multiTile', p2.x, p2.y-100, null, ['grid1'], 1, ["truck12","truck22","truck32","truck42"]]);
	gameObjects.createObject(['multiTile', p3.x+100, p3.y, null, ['grid1'], 1, ["truck13","truck23","truck33","truck43"]]);
	gameObjects.createObject(['multiTile', p4.x, p4.y+100, null, ['grid1'], 1, ["truck14","truck24","truck34","truck44"]]);

	//stations
	var stationQty = 12;
	for(var i=0; i<stationQty; i++) gameObjects.createObject(['tile', p1.x,				p1.y-300+50*i,	null, ['grid1'], "station1"]);
	for(var i=0; i<stationQty; i++) gameObjects.createObject(['tile', p2.x-300+50*i,	p2.y,			null, ['grid1'], "station2"]);
	for(var i=0; i<stationQty; i++) gameObjects.createObject(['tile', p3.x,				p3.y-300+50*i,	null, ['grid1'], "station3"]);
	for(var i=0; i<stationQty; i++) gameObjects.createObject(['tile', p4.x-300+50*i,	p4.y,			null, ['grid1'], "station4"]);

	//bonus turn redemption slips
	gameObjects.createObject(['tile', p1.x-200, p1.y-150, null, [], "convoy"]);
	gameObjects.createObject(['tile', p2.x-300, p2.y-100, null, [], "convoy"]);
	gameObjects.createObject(['tile', p3.x+100, p3.y-150, null, [], "convoy"]);
	gameObjects.createObject(['tile', p4.x-300, p4.y+100, null, [], "convoy"]);

	//first player marker
	gameObjects.createObject(['tile', p1.x-200, p1.y-220, null, [], "firstplayer"]);
}


