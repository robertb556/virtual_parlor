'use strict';


//##############################################
//-----------------CONSTANTS--------------------
//##############################################
//SETTINGS
var SHOW_TUTORIAL = true;


//UI
//var ZOOM_LEVELS = [0.05,0.06,0.07,0.08,0.09,0.10,0.11,0.12,0.13,0.15,0.16,0.18,0.19,0.21,0.24,0.26,0.29,0.31,0.35,0.38,0.42,0.46,0.51,0.56,0.61,0.67,0.74,0.81,0.90,0.98,1.08,1.19,1.31,1.44,1.59,1.74,1.92,2.11,2.32,2.55,2.81,3.09,3.40,3.74,4.11,4.53,4.98,5.48,6.02,6.63,7.29,8.02,8.82,9.70,10.67,11.74,12.91,14.20,15.62];
var ZOOM_LEVELS = [0.0118,0.0124,0.013,0.0136,0.0143,0.015,0.0158,0.0166,0.0174,0.0183,0.0192,0.0202,0.0212,0.0223,0.0234,0.0246,0.0258,0.0271,0.0285,0.0299,0.0314,0.033,0.0346,0.0363,0.0381,0.04,0.042,0.0441,0.0463,0.0486,0.051,0.0535,0.0562,0.059,0.0619,0.065,0.0682,0.0716,0.0752,0.079,0.083,0.0872,0.0916,0.0962,0.101,0.106,0.1113,0.1169,0.1227,0.1288,0.1352,0.142,0.1491,0.1566,0.1644,0.1726,0.1812,0.1903,0.1998,0.2098,0.2203,0.2313,0.2429,0.255,0.2678,0.2812,0.2953,0.3101,0.3256,0.3419,0.359,0.377,0.3958,0.4156,0.4364,0.4582,0.4811,0.5052,0.5305,0.557,0.5848,0.614,0.6447,0.6769,0.7107,0.7462,0.7835,0.8227,0.8638,0.907,0.9524,1,1.05,1.103,1.158,1.216,1.277,1.341,1.408,1.478,1.552,1.63,1.712,1.798,1.888,1.982,2.081,2.185,2.294,2.409,2.529,2.655,2.788,2.927,3.073,3.227,3.388,3.557,3.735,3.922,4.118,4.324,4.54,4.767,5.005,5.255,5.518,5.794,6.084,6.388,6.707,7.042,7.394,7.764,8.152,8.56,8.988,9.437,9.909,10.404,10.924,11.47,12.044,12.646,13.278,13.942,14.639,15.371];
var SCREEN_WIDTH = 1920; //960;
var SCREEN_HEIGHT = 1080;
var DETAILS_WIDTH = 300;
var IMAGE_SCALE = 3;
var ACTIVE_PLAYER = 0;
var COLORS = ["white", "#a92a2a", "#2e4ab0", "#268d26", "#b85e0f"];


//##############################################
//-----------------VARS-------------------------
//##############################################
var graphics;
var mouse;
var keyboard;
var input;
var gameObjects;
var activeElement;
var players = [];
var localPlayer = null;
var isHost = false;
var random;
var tickCount = 0;



window.onload = function(){


	//INIT
	input = Input();
	graphics = Graphics();
	loadImages();
	random = Random();
	mouse = Mouse();
	keyboard = Keyboard();
	gameObjects = GameObjects();
	graphics.start();

	//launch
	launch();
};

function launch(){
	//sync
	SyncButton(75, 450);

	//layout
	var s1 = 200;
	var s2 = 300;
	var x1 = 200;
	var y1 = 400;
	var y2 = y1+200;
	var y3 = y2+200;
	var y4 = y3+400;

	//workers
	for(var i=0; i<20; i++) Tile3(x1, y1, 1, "worker1", "pilot", "ace");
	for(var i=0; i<20; i++) Tile3(x1+s1, y1, 1, "worker2", "pilot", "ace");
	for(var i=0; i<20; i++) Tile3(x1+s1*2, y1, 1, "worker3", "pilot", "ace");
	for(var i=0; i<20; i++) Tile3(x1+s1*3, y1, 1, "worker4", "pilot", "ace");

	//cubes
	for(var i=0; i<20; i++) Tile(x1, y2, "cube1");
	for(var i=0; i<20; i++) Tile(x1+s1, y2, "cube2");
	for(var i=0; i<20; i++) Tile(x1+s1*2, y2, "cube3");
	for(var i=0; i<20; i++) Tile(x1+s1*3, y2, "cube4");

	//dice
	for(var i=0; i<20; i++) D6(x1, y3, 5, "white");
	for(var i=0; i<20; i++) D6(x1+s2, y3, 5, "black");

	
	//boards
	Board(1500, 1500, "turn_order");

	//resource deck
	var deck = Deck(200, y4, "resourceback", true);
	for(var i=1; i<=16; i++) deck.addCard(Card(ACTIVE_PLAYER, 0,0, "resource"+i, "resourceback", "resourceback", true));

	//buildings deck
	var deck = Deck(1000, y4, "buildingback", true);
	for(var i=1; i<=18; i++) deck.addCard(Card(ACTIVE_PLAYER, 0,0, "building"+i, "buildingback", "buildingback", true));

	//parts deck
	var deck = Deck(2000, y4, "partback", true);
	for(var i=1; i<=23; i++) deck.addCard(Card(ACTIVE_PLAYER, 0,0, "part"+i, "partback", "partback", true));

	


	tickStep();
}

function tickStep(){
	tickCount++;

	if(localPlayer !== null){
		input.tick();
		gameObjects.tick();
		if(tickCount % 50 === 0) input.sendBuffer();
	}
	
	setTimeout(tickStep, 15);
}

function setActiveElement(element){
	activeElement = element;
	element.focus();
}


var Player = function(index, name){
	var me = {};

	me.index = index;
	me.color = COLORS[index];
	me.name = name;
	PassButton(75, 100*me.index-50, me);
	me.bufferPlayTime = Date.now();


	me.buffer = LinkedList();

	me.x = 0;
	me.y = 0;
	me.ctrlDown = false;
	me.shiftDown = false;
	me.viewX = 0;
	me.viewY = 0;
	me.mouseImg = colorizeImage(IMG["mouse"], IMG["mouseTop"], me.color, 1);

	me.heldObjects = [];
	

	me.drawMouse = function(ctx){
		//don't draw the local player mouse
		if(me === localPlayer) return;

		//calculate
		me.viewX = lerp(me.viewX, me.x, 0.2);
		me.viewY = lerp(me.viewY, me.y, 0.2);
		if(Math.abs(me.viewX-me.x) < 0.1) me.viewX = me.x;
		if(Math.abs(me.viewY-me.y) < 0.1) me.viewY = me.y;

		//draw
		ctx.drawImage(me.mouseImg, me.viewX, me.viewY);
		//ctx.fillStyle = me.color;
		//ctx.beginPath();
		//var r = 10 / ZOOM_LEVELS[graphics.zoom];
		//ctx.arc(me.viewX, me.viewY, r, 0, 2 * Math.PI);
		//ctx.fill();
	};

	me.mouseMove = function(e){
		me.x = e.x;
		me.y = e.y;
	};


	
	
	
	//holding methods
	me.grab = function(object){
		if(!me.isHolding(object) && (me.heldObjects.length === 0 || (me.ctrlDown && object.type === me.heldObjects[0].type))){
			me.heldObjects.push(object);
			object.moveToTop = true;
			graphics.repaint();
		}
	};

	me.drop = function(object){
		var index = me.holdIndex(object);
		if(index >= 0){
			me.heldObjects.splice(index, 1);
			object.drop();
		}
	};

	me.isHolding = function(object){
		if(me.holdIndex(object) >= 0) return true;
		else return false;
	};

	me.holdIndex = function(object){
		for(var i=0; i<me.heldObjects.length; i++){
			if(me.heldObjects[i] === object) return i;
		}

		return -1;
	};

	me.getHeldX = function(object){
		var index = me.holdIndex(object);
		if(index >= 0){
			var gx = index % object.spacingRowLength;
			return me.x + gx*object.spacingWidth;
		}
		else return null;
	};
	me.getHeldY = function(object){
		var index = me.holdIndex(object);
		if(index >= 0){
			var gy = integerDivision(index, object.spacingRowLength);
			return me.y + gy*object.spacingHeight;
		}
		else return null;
	};

	return me;
};


//##############################################
//-----------------UTILITIES--------------------
//##############################################
// get query arguments
var $_GET = {},
    args = location.search.substr(1).split(/&/);
for(var i=0; i<args.length; ++i) {
    var tmp = args[i].split(/=/);
    if (tmp[0] != ""){
        $_GET[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
    }
}

function clamp(value, min, max){
	if(value < min) value = min;
	if(value > max) value = max;
	return value;
}

function lerp(start, end, percent){
	return start + percent * (end - start);
}

function integerDivision(a,b){
	var count = 0;
	while(a >= b){
		a -= b;
		count++;
	}
	return count;
}


//##############################################
//-----------------RANDOM-----------------------
//random values can stay in sync across multiple clients, for multiplayer.
//Author: Robert Byers
//##############################################
var Random = function(){
	var me = {};

	me.current = 0;
	me.set = [179,793,218,31,23,456,311,490,613,433,973,520,571,551,358,535,867,833,662,431,596,202,474,458,522,165,664,988,160,226,89,483,620,849,261,554,353,938,476,832,544,642,191,688,824,253,416,604,319,386,247,139,220,826,395,724,895,123,971,465,413,945,818,803,830,964,411,733,745,172,290,128,789,855,570,944,390,316,28,384,717,325,132,109,891,170,64,320,954,205,950,38,430,71,166,277,471,59,713,35,873,20,690,559,580,947,835,685,454,25,157,653,588,418,589,40,92,786,187,427,178,703,336,934,775,95,161,638,542,974,887,462,994,54,432,241,732,385,301,45,548,852,645,675,137,369,204,423,665,997,482,87,545,198,553,440,712,763,321,530,252,942,99,748,879,405,538,910,292,240,174,674,379,82,258,281,896,984,693,518,697,550,569,858,658,619,326,136,564,839,112,420,8,455,242,609,593,761,4,278,478,122,72,102,467,357,698,799,298,362,981,823,225,632,532,272,268,875,90,856,79,622,526,922,44,328,495,939,680,291,150,776,582,363,890,621,546,410,739,183,239,515,834,340,307,373,774,756,598,236,506,195,152,611,949,880,453,637,297,394,407,788,396,214,347,234,599,280,43,333,800,640,841,497,752,878,118,207,669,983,969,254,81,323,436,308,929,533,726,341,303,60,574,935,371,360,715,153,618,711,881,445,899,646,302,561,134,967,581,249,567,966,83,813,52,65,246,918,155,773,528,197,342,784,627,67,936,417,267,176,705,628,999,982,507,349,295,916,897,737,107,412,217,700,914,332,193,269,26,555,88,317,49,211,537,847,91,30,901,509,909,503,74,424,167,283,679,540,859,757,601,182,368,797,908,345,402,767,884,892,145,725,354,747,256,374,704,243,119,330,843,306,913,141,169,719,84,557,977,953,923,469,676,699,792,199,312,470,898,387,69,765,750,422,811,568,720,437,577,189,106,933,421,790,608,722,753,477,941,822,435,12,113,911,403,597,159,714,972,863,388,659,114,70,7,17,286,746,457,231,893,229,998,493,968,694,124,264,116,549,16,605,634,376,845,527,444,976,864,356,958,920,655,639,313,133,869,146,479,117,866,296,986,721,673,192,96,876,484,212,743,275,848,798,882,749,741,667,626,585,815,222,692,517,450,409,56,158,51,727,657,647,706,556,654,232,631,475,534,821,989,151,961,594,149,838,310,817,931,203,227,959,21,100,575,770,223,121,11,245,322,682,842,164,447,441,906,904,276,932,668,573,287,728,740,552,791,62,760,780,529,115,34,943,230,98,802,331,677,915,782,186,271,75,127,523,691,487,257,591,781,104,854,361,224,94,185,787,738,874,541,616,635,917,758,135,346,524,329,656,85,282,868,190,338,820,55,560,244,723,324,606,221,785,927,807,600,736,473,587,812,900,68,508,709,995,586,372,504,57,766,274,201,406,853,213,238,623,289,755,816,108,46,975,144,370,514,334,446,284,263,940,865,809,194,97,41,952,175,771,196,47,825,602,576,250,63,492,889,42,513,672,442,131,990,393,806,318,300,391,359,173,378,686,461,270,729,888,398,836,499,397,572,216,783,562,105,142,399,814,429,985,525,375,337,120,259,154,903,404,32,367,61,39,955,735,759,262,163,168,603,80,53,466,536,846,315,355,649,143,660,615,248,15,426,237,2,464,383,335,731,539,769,344,861,19,77,804,401,486,130,993,5,930,279,37,978,636,885,14,452,491,140,219,366,181,592,617,579,641,171,543,425,850,463,742,489,200,919,76,58,937,762,777,651,448,419,111,928,235,511,377,871,970,801,228,1,837,126,382,468,177,991,744,902,926,614,583,987,209,648,339,501,488,27,304,428,578,460,521,563,438,496,519,754,494,500,684,273,772,365,516,590,314,472,36,630,877,260,624,795,979,584,408,343,963,558,3,607,148,86,288,857,718,924,265,643,18,661,206,215,156,101,794,894,480,828,708,921,681,883,595,957,827,644,687,779,996,481,389,960,251,180,912,829,10,629,565,348,808,689,210,125,50,414,29,810,9,103,650,566,905,451,633,701,208,510,327,48,434,351,502,702,956,73,671,443,768,459,147,33,652,948,962,381,547,796,498,751,380,670,485,844,415,805,449,309,531,683,778,663,831,22,764,512,965,266,188,710,730,840,392,951,870,285,110,184,138,293,992,66,129,93,162,707,24,78,907,610,851,233,364,13,886,505,352,612,946,819,696,625,294,716,6,860,695,925,305,980,862,255,350,439,400,872,678,299,666,734];
	
	me.next1000 = function(){
		var value = me.set[me.current];
		me.current++;
		if(me.current >= me.set.length) me.current = 0;
		
		//console.log("random next["+value+"]");
		
		return value;
	};

	me.setSeed = function(seed){
		me.current = seed % (me.set.length-1);
	};
	
	me.getSeed = function(){
		return me.current;
	};

	return me;
};