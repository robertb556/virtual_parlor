'use strict';

var PEER_PREFIX = "vparlor_";
var ENQUEUE = 0;
var PENDING = 1;
var OPEN = 2;

var Network = function(myId){
	var me = {};
	console.log("my playerId["+myId+"]");
	me.live = false;
	//me.peer = new Peer(PEER_PREFIX+myId);
	me.peer = new Peer(PEER_PREFIX+myId, {
		host:'18.224.202.15',
		port:'9000',
		path:'/virtualparlor'
	});
	me.connections = {};
	me.connectionListeners = [];
	me.messageListeners = [];


	me.addConnectionListener = function(callback){
		me.connectionListeners.push(callback);
	};

	me.addMessageListener = function(callback){
		me.messageListeners.push(callback);
	};
	

	me.addConnection = function(id){
		//queue it up
		if(!me.connections[id]){
			console.log("network connection queued ["+id+"]");
			me.connections[id] = {};
			me.connections[id].status = ENQUEUE;
		}

		//if its not already loaded, load it
		if(me.live && me.connections[id].status === ENQUEUE){
			console.log("network connection pending ["+id+"]");
			var conn = me.peer.connect(id);
			me.connections[id].status = PENDING;
			me.connections[id].conn = conn;

			conn.on('open', function(){
				console.log("network connection open ["+id+"]");
				me.connections[id].status = OPEN;

				//listeners
				for(var i=0; i<me.connectionListeners.length; i++) me.connectionListeners[i](id);

				//inital handshake
				conn.send("");
			});

			conn.on('error', function(err){
				console.log("conn error["+err+"]");
				if(delete me.connections[conn.peer]) delete me.connections[conn.peer];
			});
		}
	};

	me.broadcast = function(message){
		for(var key in me.connections){
			if(me.connections.hasOwnProperty(key)){
				if(me.connections[key].status === OPEN){
					me.connections[key].conn.send(message);
				}
			}
		}
	};



	//CLIENT
	me.peer.on('open', function(id){
		console.log('My client ID is: ' + id);
		me.live = true;
		for(var key in me.connections){
			if(me.connections.hasOwnProperty(key)){
				if(me.connections[key].status === ENQUEUE) me.addConnection(key);
			}
		}
	});

	me.peer.on('error', function(error){
		console.log('peer error: ' + error.type);
		me.live = false;
	});

	me.peer.on('connection', function(conn){
		var id = conn.peer;

		//new connection
		if(!me.connections[id]) me.addConnection(id);
		
		//errors
		conn.on('error', function(error){
			console.log("DataConnection error["+error.type+"]");
			if(delete me.connections[conn.peer]) delete me.connections[conn.peer];
		});

		//close
		conn.on('close', function(){
			console.log("connection on close.");
			if(delete me.connections[conn.peer]) delete me.connections[conn.peer];
		});

		//recieve message
		conn.on('data', function(message){
			if(message.length > 0){
				for(var i=0; i<me.messageListeners.length; i++) me.messageListeners[i](message);
			}
		});
	});

	return me;
};




/*
function tryCreateClient(){
	serverUnreachable = false;
	tryingToConnect = true;
	connectionBroken = false;
	var desiredId = CLIENT_ID_PREFIX+clientIndex;
	
	//console.log("trying to create client["+desiredId+"]");
	
	client = new Peer(desiredId);
	client.on('open', function(id){
		console.log('My client ID is: ' + id);
		if(clientIndex % 2 === 1){
			localPlayer = players[0];
			tryConnect(clientIndex-1);
		}else{
			localPlayer = players[1];
		}
	});

	client.on('error', function(error){
		console.log('peer error: ' + error.type);
		client = null;
		if(error.type !== "unavailable-id") serverUnreachable = true;
		clientIndex++;
		tryCreateClient();
	});

	client.on('connection', function(conn){
		
		conn.on('error', function(error){
			console.log("DataConnection error["+error.type+"]");
		});

		conn.on('close', function(){
			connectionBroken = true;
			console.log("connection on close.");
		});

		conn.on('data', function(data){
			//console.log("recieved a mess["+data+"].");
			if(sConn === null){
				connectionIsReady = true;
				tryConnect(data);
			}
			else{
				//initial syncing of server & client
				if(data[0] === 0){
					random.setSeed(data[1]);
					SEED_PASSPHRASE = data[1];
					tryingToConnect = false;
					setTimeout(confirmConnection, 3000);
					console.log("got seed["+data[1]+"]");
					startDraft();
				}

				//Validate that they sent the secret seed passphrase
				else{
					if(data[0] === SEED_PASSPHRASE){

						if(data[1] === -3){
							console.log("got confirmation["+data[0]+"]");
							tryingToConnect = false;
						}

						//regular end of turn update
						else if(data[1] === 1){
							var action = actions[data[2]];
							var targetGroup = map.cells;
							if(data[3]) targetGroup = units.units;
							var target = targetGroup[data[4]];
							//console.log("action["+data[2]+"]["+data[3]+"]["+data[4]+"]");
							action.cast(target);
						}
				
						//draft pick
						else if(data[1] === 2){
							var unit = draft.units[data[2]];
							draft.pick(unit);
						}
				
						//deploy unit
						else if(data[1] === 3){
							deployment.savedDeploys.push(data[2]);
							//console.log("got deploy["+data[2]+"]");
						}
					}
					else{
						console.log("passphrase missmatch, got ["+data[0]+"], but expecting ["+SEED_PASSPHRASE+"]");
						connectionBroken = true;
					}
				}
			}
		});
	});
}

function tryConnect(destinationIndex){
	if(client !== null){
		var destId = CLIENT_ID_PREFIX+destinationIndex;
		
		//console.log("trying to connect to["+destId+"]");
		
		sConn = client.connect(destId);
		sConn.on('open', function(){
			if(!connectionIsReady) sConn.send(clientIndex); //inital handshake
			connectionIsReady = true;
			
			//random seed
			if(localPlayer === players[0]){
				var seed = Math.floor(Math.random()*10000);
				var state = [];
				state.push(0);
				state.push(seed);
				SEED_PASSPHRASE = seed;
				sConn.send(state);
				console.log("sent seed["+seed+"]");
				random.setSeed(seed);
				startDraft();
			}

		});
		sConn.on('error', function(err){
			//console.log("error["+err+"]");
			sConn = null;
			if(destinationIndex > 10){ //just quit if takes too many trys
				console.log("giving up trying to connect.");
			}
			else{
				tryConnect(destinationIndex+1);
			}
		});
	}
}
*/