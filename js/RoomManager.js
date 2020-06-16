'use strict';

var RoomManager = function(roomId, roomName, playerId, gameType){
	var me = {};

	me.roomId = roomId;
	me.roomName = roomName;
	me.playerId = playerId;
	me.gameType = gameType;
	me.server = new WebSocket('ws://18.224.202.15:9191');
	console.log("trying to connnect");

	me.server.onopen = function(){
		me.connected = true;
		console.log("connected");
			
		var data = {};
		data.CREATE_ROOM = true;
		data.roomId = me.roomId;
		data.roomName = me.roomName;
		data.hostId = me.playerId;
		data.gameType = me.gameType;
		var message = JSON.stringify(data);
		me.server.send(message);
	};

	me.server.onerror = function(error){
		alert('WebSocket Error ' + error); console.log(error);
	};
	/*
	me.server.onmessage	= function(e){
		//console.log("got message["+e.data+"]");
		var data = JSON.parse(e.data);

			
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
			
		//keep alive
		else if(data.KEEP_ALIVE){
			//do nothing
		}
	};
	*/
};