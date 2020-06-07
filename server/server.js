

//-----VARIABLES-----
var WebSocketServer	= require('ws').Server;
var wss				= new WebSocketServer({port: 9191});
var clients			= [];  //CLIENTS AND THEIR DATA
var worldSnapshot	= null;

console.log('Starting server.');

//-----PROGRAM-----
wss.on('connection', function(ws){ initClient(ws); } );
init();
keepAlive();


//-----FUNCTIONS-----
function init(){

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
	client.ws.send(message, function(error){
		if(error != null) closeClient(client);
	});
}


function closeClient(client){
	console.log('client disconnected.');
    clients.splice(clients.indexOf(client),1);
}


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

			//give world if it exists
			if(worldSnapshot){
				send(client, worldSnapshot);
				console.log("forwarding world state");
			}

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
			worldSnapshot = message;
		}

		else if(data.REQUESTING_WORLD){
			if(worldSnapshot !== null){
				send(client, worldSnapshot);
			}
		}

	});
}


