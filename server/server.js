

//-----VARIABLES-----
var WebSocketServer	= require('ws').Server;
var wss				= new WebSocketServer({port: 9191});
var rooms = {};




//-----PROGRAM-----
console.log('Starting server.');

wss.on('connection', function(ws){
	ws.on('message', function(message) {
		var data = JSON.parse(message);

		//GET ROOMS
		if(data.GET_ROOMS){
			var d = {};
			d.ROOMS = true;
			d.roomList = rooms;
			for(var id in rooms){
				if(rooms.hasOwnProperty(id)){
					var r = {};
					r.id = id;
					r.name = rooms[id].name;
					r.hostId = rooms[id].hostId;
					d.roomList.push(r);
				}
			}
			var m = JSON.stringify(d);
			send(ws, m);
			console.log('Sending rooms list.');
		}

		//JOIN ROOM
		else if(data.CREATE_ROOM){
			var id = data.id;
			var name = data.name;
			var hostId = data.hostId;

			//sanitize data
			if(id.match(/^[0-9a-z]+$/i) && id.length > 2 && name.match(/^[0-9a-z]+$/i) && name.length > 2 && hostId.match(/^[0-9a-z]+$/i) && hostId.length > 2){
				var room = {};
				room.id = id;
				room.name = name;
				room.hostId = hostId;
				rooms[id] = room;
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


