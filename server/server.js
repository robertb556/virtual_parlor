

//-----VARIABLES-----
var WebSocketServer	= require('ws').Server;
var wss				= new WebSocketServer({port: 9191});
var clients			= new Array();  //CLIENTS AND THEIR DATA


console.log('Starting server.');

//-----PROGRAM-----
wss.on('connection', function(ws){ initClient(ws); } );
init();



//-----FUNCTIONS-----
function init(){

}


function broadcast(message, excludedClient){
	for(var i=0; i<clients.length; i++){
		var client = clients[i];
		if(client !== excludedClient){
			client.ws.send(message, function(error){
				if(error != null) closeClient(client);
			});
		}
	}
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
	
	//CLIENT FUNCTIONS
	client.ws.on('message', function(message) {
		console.log('relaying message["+message+"]');
		//parse
		//var data = JSON.parse(message);

		//relay to other clients
		broadcast(message, client);
	});
	

	
	//ADD CLIENT TO CLIENT LIST
	clients.push(client);
}


