

//-----VARIABLES-----
var WebSocketServer	= require('ws').Server;
var wss				= new WebSocketServer({port: 9191});
var clients			= [];  //CLIENTS AND THEIR DATA
var worldSnapshot	= null;





//-----PROGRAM-----
console.log('Starting server.');

wss.on('connection', function(ws){
	ws.on('message', function(message) {
		var data = JSON.parse(message);

		if(data.JOIN) addClient(ws, data);
		else if(data.UPDATE) broadcast(message, getClient(data.name));
		else if(data.WORLD_STATE){
			worldSnapshot = message;  //save world state
			broadcast(message, null); //relay to all clients
		}
		else if(data.WORLD_BACKUP){
			data.WORLD_STATE = true;
			worldSnapshot = JSON.stringify(data);
			console.log("saving world state");
		}
	});
});

keepAlive();







//-----FUNCTIONS-----
function addClient(ws, data){
	var client = getClient(data.name);

	//REJOIN
	if(client){
		console.log('client '+data.name+' rejoined.');
		client.ws = ws;
	}

	//NEW CLIENT
	else{
		console.log('new client: '+data.name);

		//MAKE NEW OBJECT TO HOLD EVERYTHING PERTAINING TO THIS CLIENT
		client = {};

		//CLIENT SPECIFIC DATA
		client.ws = ws;
		client.name = data.name;

		//ADD CLIENT TO CLIENT LIST
		clients.push(client);

		
	}
	//tell all clients
	var d = {};
	d.PLAYER_LIST = true;
	d.playerNames = [];
	d.playerNames.push(0); //leave blank for active player
	for(var i=0; i<clients.length; i++) d.playerNames.push(clients[i].name);
	var m = JSON.stringify(d);
	broadcast(m, null);

	//give world if it exists
	if(worldSnapshot){
		console.log("forwarding world state");
		send(client, worldSnapshot);
	}
}

function getClient(name){
	for(var i=0; i<clients.length; i++) if(clients[i].name === name) return clients[i];
	return null;
}

function keepAlive(){
	var data = {};
	data.KEEP_ALIVE = true;
	var message = JSON.stringify(data);
	broadcast(message, null);
	setTimeout(keepAlive, 100);
}

function broadcast(message, excludedClient){
	for(var i=0; i<clients.length; i++){
		var client = clients[i];
		if(client !== excludedClient){
			send(client, message);
		}
	}
}

function send(client, message){
	if(client.ws){
		client.ws.send(message, function(error){
			if(error != null) closeClient(client);
		});
	}
}


function closeClient(client){
	console.log('client disconnected.');
	client.ws = null;
    //clients.splice(clients.indexOf(client),1);
}

/*
function initClient(ws){
	console.log('new client.');
	//MAKE NEW OBJECT TO HOLD EVERYTHING PERTAINING TO THIS CLIENT
	var client = {};
	
	//CLIENT SPECIFIC DATA
	client.ws		= ws;
	client.name		= "none";
	
	//ADD CLIENT TO CLIENT LIST
	clients.push(client);

	//CLIENT FUNCTIONS
	client.ws.on('message', function(message) {
		//console.log('relaying message['+message+']');

		var data = JSON.parse(message);
		
		if(data.JOIN){
			client.name = data.name;

			

			//tell all clients
			for(var i=0; i<clients.length; i++){
				var c = clients[i];
				var d = {};
				d.PLAYER_LIST = true;
				d.players = [];
				d.players.push(0); //leave blank for active player
				for(var j=0; j<clients.length; j++) d.players.push(clients[j].name);
				d.localPlayerIndex = i+1;
				var m = JSON.stringify(d);
				send(c, m);
			}

			//give world if it exists
			if(worldSnapshot){
				console.log("forwarding world state");
				send(client, worldSnapshot);
			}
		}

		else if(data.UPDATE){
			//relay to other clients
			broadcast(message, client);
		}

		else if(data.WORLD_STATE){
			worldSnapshot = message;

			//relay to all clients
			broadcast(message, null);
		}

		else if(data.WORLD_BACKUP){
			data.WORLD_STATE = true;
			worldSnapshot = JSON.stringify(data);
			console.log("saving world state");
		}

	});
}
*/

