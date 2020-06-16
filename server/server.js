

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
			if(validate(roomId, 3) && validate(gameType, 3) && validate(roomName, 3) && validate(hostId, 3)){
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
function validate(text, minLength){
	if(text.length < minLength) return false;
	if(!(text.match(/^[0-9a-z_]+$/i))) return false;
	return true;
}

function send(ws, message){
	if(ws){
		ws.send(message, function(error){
			if(error != null) console.log("error sending message["+message+"]");
		});
	}
}


