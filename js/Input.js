'use strict';


//##############################################
//-----------------INPUT------------------------
//##############################################
var MOUSE_MOVE = 0;
var MOUSE_DOWN = 1;
var MOUSE_UP = 2;
var PASS_CONTROL = 3;

var Input = function(){
	var me = {};

	me.outboundBuffer = [];
	me.inboundLocked = false;
	me.outboundLocked = false;

	me.DELAY = 50;
	me.startTime = Date.now();

	me.server;
	me.connected = false;

	//web server methods
	me.init = function(){

		//HOST GAME
		if(sessionStorage.getItem("isHost")){
			console.log("im host!");

			//listen for new players
			network.addConnectionListener(me.onNewPlayer);

			//game already started (reload)
			if(sessionStorage.getItem("WORLD_STATE")){
				var message = sessionStorage.getItem("WORLD_STATE");
				var data = JSON.parse(message);
				me.loadWorldState(data);
			}

			//create new game
			else{
				//game components
				initComponents();

				//players
				players = [];
				players[1] = Player(1, sessionStorage.getItem("playerId"));
				localPlayer = players[1];

				//set active player
				players[0] = players[1];


				//reserve room
				me.roomManager = RoomManager($_GET['roomId'], sessionStorage.getItem('roomName'), localPlayer.name);
			}

			//schedual backups
			me.backupWorld();
		}

		//JOIN GAME
		else{
			console.log("im a client.");
			network.addConnection(PEER_PREFIX+sessionStorage.getItem("hostId"));
			network.addMessageListener(me.onPeerMessage);
		}
	};

	me.onNewPlayer = function(id){
		var name = id.split(PEER_PREFIX)[1];
		players.push(Player(players.length, name));
		me.syncWorlds();
	};

	me.onPeerMessage = function(message){
		var data = JSON.parse(message);
		console.log("peer message["+message+"]");

		//WORLD STATE
		if(data.WORLD_STATE){
			me.loadWorldState(data);
		}
			
		//UPDATE
		else if(data.UPDATE){
			if(!me.inboundLocked){
				var player = players[data.playerIndex];
				//add to buffer
				for(var i=0; i<data.buffer.length; i++) player.buffer.push(data.buffer[i]);
			}
		}
		/*
		//PLAYER LIST
		else if(data.PLAYER_LIST){
			//delete old players
			players = [];

			//delete old pass buttons
			for(var i=0; i<gameObjects.objects.length; i++){
				var obj = gameObjects.objects[i];
				if(obj.type === OBJ_PASS) obj.deleteMe = true;
			}

			//new player list
			for(var i=1; i<data.playerNames.length; i++){
				var name = data.playerNames[i];
				var player = Player(i, name);
				players[i] = player;

				//local player
				if(name === sessionStorage.getItem("playerId")){
					localPlayer = players[i];

					//If host, see if a state exists and load it.
					if(localPlayer.index === 1 && sessionStorage.getItem("WORLD_STATE")){
						var m = sessionStorage.getItem("WORLD_STATE");
						var d = JSON.parse(m);
						me.loadWorldState(d);
					}
				}
			}
			
			//active player
			players[0] = players[1];
		}
		*/
	};

	me.getWorldState = function(){
		//prepare packet
		var data = {};
		data.WORLD_STATE = true;
		data.name = sessionStorage.getItem("playerId");

		//game objects
		data.state = gameObjects.getWorldState();

		//random seed
		data.seed = random.getSeed();

		//players
		data.playerIds = [];
		for(var i=1; i<players.length; i++) data.playerIds[i] = players[i].name;
		data.activePlayerIndex = players[0].index;

		//return
		return data;
	};

	me.loadWorldState = function(data){
		console.log("loading world state");

		//lock buffers for a time
		me.inboundLocked = true;
		me.outboundLocked = true;
		setTimeout(me.unlockInbound, 2000);
		setTimeout(me.unlockOutbound, 3000);

		//players
		players = [];
		for(var i=1; i<data.playerIds.length; i++){
			players[i] = Player(i, data.playerIds[i]);
			if(players[i].name === sessionStorage.getItem("playerId")) localPlayer = players[i];
		}

		//active player
		players[0] = players[data.activePlayerIndex];

		//load state
		gameObjects.setWorldState(data.state);

		//random seed
		random.setSeed(data.seed);

		//clear buffers
		//me.outboundBuffer.length = 0;
		//for(var i=1; i<players.length; i++) players[i].buffer.removeAll();
	};

	me.sendUpdate = function(){
		//prepare packet
		var data = {};
		data.UPDATE = true;
		data.name = sessionStorage.getItem("playerId");
		data.playerIndex = localPlayer.index;
		data.buffer = me.outboundBuffer;
		var message = JSON.stringify(data);

		//send it
		network.broadcast(message);

		//clear outbound
		me.outboundBuffer.length = 0;
		me.startTime = Date.now();
	};

	me.syncWorlds = function(){
		var data = me.getWorldState();
		var message = JSON.stringify(data);
		network.broadcast(message);
		me.loadWorldState(data);
	};


	me.backupWorld = function(){
		if(localPlayer){
			var data = me.getWorldState();
			var message = JSON.stringify(data);
			sessionStorage.setItem("WORLD_STATE", message);
			console.log("backed up world");
		}
		
		//schedual
		setTimeout(me.backupWorld, 10000);
	};

	me.unlockInbound = function(){
		me.inboundLocked = false;
	};

	me.unlockOutbound = function(){
		me.outboundLocked = false;
	};







	//general methods
	me.play = function(player){
		var buffer = player.buffer;
		if(buffer.length === 0) return;

		var delay;
		if(player === localPlayer) delay = Math.floor(1 / buffer.length); //for localPlayer
		else delay = Math.floor(300 / buffer.length); //for remote players
		var now = Date.now();
		var dt = now - player.bufferPlayTime;

		if(dt > delay){
			player.bufferPlayTime = now;
			//release event
			var f = buffer.shift();
			if(f !== null){
				var e = {};
				e.player = players[f[0]];
				e.type = f[1];
				e.x = f[2];
				e.y = f[3];
				e.rawX = f[4];
				e.rawY = f[5];
				e.leftDown = !!f[6];
				e.rightDown = !!f[7];
				e.ctrlDown = !!f[8];
				e.shiftDown = !!f[9];

				player.x = e.x;
				player.y = e.y;
				player.ctrlDown = e.ctrlDown;
				player.shiftDown = e.shiftDown;

				if(!e.shiftDown){
					if(e.type === MOUSE_DOWN){
						//console.log("play down");
						if(e.player === players[ACTIVE_PLAYER]) gameObjects.mouseDown(e);
					}
					else if(e.type === MOUSE_UP){
						//console.log("play up");
						if(e.player === players[ACTIVE_PLAYER]) gameObjects.mouseUp(e);
					}
					else if(e.type === MOUSE_MOVE){
						//console.log("play move");
						if(e.player === players[ACTIVE_PLAYER]) gameObjects.mouseMove(e);

						//syncing mice for visual communication
						e.player.mouseMove(e);
					}
					else if(e.type === PASS_CONTROL){
						players[ACTIVE_PLAYER] = e.player;
						graphics.repaint();
					}
				}
			}
		}
	};

	me.tick = function(){
		while(me.outboundBuffer.length < me.getCurrentEventIndex()){
			localPlayer.buffer.push(null);
			me.outboundBuffer.push(null);
		}
	};

	me.add = function(playerIndex, type, x, y, rawX, rawY, leftDown, rightDown, ctrlDown, shiftDown){
		if(me.outboundLocked) return;

		var player = players[playerIndex];

		//keep buffer full up to date
		me.tick();

		//add
		if(me.outboundBuffer.length < me.getCurrentEventIndex()+2 || type !== MOUSE_MOVE){
			var e = [];
			e[0] = playerIndex;
			e[1] = type;
			e[2] = Math.round(x);
			e[3] = Math.round(y);
			e[4] = Math.round(rawX);
			e[5] = Math.round(rawY);
			e[6] = leftDown + 0;
			e[7] = rightDown + 0;
			e[8] = ctrlDown + 0;
			e[9] = shiftDown + 0;
			player.buffer.push(e);
			me.outboundBuffer.push(e);
		}
		
	};

	me.getCurrentEventIndex = function(){
		var dt = Date.now() - me.startTime;
		return Math.floor(dt / me.DELAY);
	};

	me.init();
	return me;
};



var LinkedList = function(){
	var me = {};

	me.head = null;
	me.tail = null;
	me.length = 0;
	me.addCount = 0;

	me.removeAll = function(){
		me.head = null;
		me.tail = null;
		me.length = 0;
	};

	me.at = function(index){
		var val = null;
		if(index < me.length){
			var n = me.head;
			for(var i=0; i<index; i++) n = n.next;
			val = n.value;
		}
		return val;
	};

	me.push = function(value){
		var n = LinkedListNode(value);

		if(me.length === 0){
			me.head = n;
			me.tail = n;
		}
		else{
			me.tail.next = n;
			n.prev = me.tail;
			me.tail = n;
		}

		me.length++;
		me.addCount++;
	};

	me.shift = function(){
		var val = null;

		if(me.head !== null){
			val = me.head.value;
			me.head = me.head.next;
			me.length--;

			if(me.length === 0){
				me.head = null;
				me.tail = null;
			}
			else{
				me.head.prev = null;
			}
		}

		return val;
	};

	return me;
};


var LinkedListNode = function(value){
	var me = {};

	me.value = value;
	me.next = null;
	me.prev = null;

	return me;
};