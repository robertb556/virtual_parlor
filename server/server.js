

//-----VARIABLES-----
var WebSocketServer	= require('ws').Server;
var wss				= new WebSocketServer({port: 9191});
var rooms = {};




//-----PROGRAM-----
console.log('Starting server.');

wss.on('connection', function(ws){
	ws.on('message', function(message) {
		console.log('got message['+message+']');
		var data = JSON.parse(message);

		//GET ROOMS
		if(data.GET_ROOMS){
			var d = {};
			d.ROOMS = true;
			d.roomList = [];
			for(var roomId in rooms){
				if(rooms.hasOwnProperty(roomId)){
					var r = {};
					r.roomId = roomId;
					r.gameType = rooms[roomId].gameType;
					r.roomName = rooms[roomId].roomName;
					r.hostId = rooms[roomId].hostId;
					d.roomList.push(r);
				}
			}
			var m = JSON.stringify(d);
			send(ws, m);
			console.log('Sending rooms list.');
		}

		//JOIN ROOM
		else if(data.CREATE_ROOM){
			var roomId = data.roomId;
			var gameType = data.gameType;
			var roomName = data.roomName;
			var hostId = data.hostId;

			//sanitize data
			if(roomId.match(/^[0-9a-z]+$/i) && roomId.length > 2 && gameType.match(/^[0-9a-z]+$/i) && gameType.length > 2 && roomName.match(/^[0-9a-z]+$/i) && roomName.length > 2 && hostId.match(/^[0-9a-z]+$/i) && hostId.length > 2){
				var room = {};
				room.roomId = roomId;
				room.gameType = gameType;
				room.roomName = roomName;
				room.hostId = hostId;
				rooms[roomId] = room;
				console.log('New room created.');
			}
			else{
				console.log('Failed to create room, bad data.');
			}
		}
	});
});





//-----FUNCTIONS-----
function send(ws, message){
	if(ws){
		ws.send(message, function(error){
			if(error != null) console.log("error sending message["+message+"]");
		});
	}
}


