<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

    <title>Rooms</title>
  </head>











<body>
  
<div id="username-page" class="container-fluid">
	<div class="row mt-5">
        <div class="col-md-4"></div>
		<div class="col-md-4">
            <div class="card">
                <div class="card-body">
			        <form role="form" action="" onsubmit="return setUsername()">
                        <div class="form-group">
                            <label>username</label>
                            <input type="text" class="form-control" id="username">
                        </div>
                        <input class="btn btn-primary btn-block" type="submit" value="connect" />
			        </form>
                </div>
            </div>
		</div>
        <div class="col-md-4"></div>
	</div>
</div>


<div id="room-page" class="container-fluid">
	<div class="row mt-5">
        <div class="col-md-4"></div>
		<div class="col-md-4">
            <div class="card">
                <div class="card-body">
			        <form id="createRoomForm" role="form" action="" onsubmit="return createRoom()" method="post">
                        <div class="form-group">
					        <label>room name</label>
					        <input type="text" class="form-control" id="roomname" />
				        </div>
                        <div class="form-group">
					        <label>select game</label>
					        <select class="form-control" id="game_types" name="game_types">
                          <?php
                          $modulesDir = __DIR__.DIRECTORY_SEPARATOR."modules";
                          echo "modulesDir[".$modulesDir."]";
                          $modules = scandir($modulesDir);
                          //echo "<p>mods[".implode(",", $modules)."]</p>";

                          foreach($modules as $mod){
                            if($mod !== "." && $mod !== ".."){
                              $t = str_replace("_", " ", $mod);
                              echo "<option value='".$mod."'>".$t."</option>";
                            }
                          }
                          ?>
                  </select>
				        </div>
                        <input class="btn btn-primary btn-block" type="submit" value="create" />
			        </form>
                </div>
            </div>
		</div>
        <div class="col-md-4"></div>
	</div>
    <p></p>

	<div class="row mt-3">
        <div class="col-md-4"></div>
		<div class="col-md-4">
            <div class="card">
                <div class="card-body">
			        <form id="joinRoomForm" role="form" action="" onsubmit="return joinRoom()" method="post">
                        <div class="form-group">
                            <label>select room</label>
				            <select class="form-control" id="rooms" name="rooms"></select>
                        </div>
                        <input class="btn btn-primary btn-block" type="submit" value="join" />
			        </form>
                </div>
            </div>
		</div>
        <div class="col-md-4"></div>
	</div>
</div>







<script>
var roomIds = [];
var hostIds = [];
var gameTypes = [];

window.onload = function(){

    if(sessionStorage.getItem("playerId")){
        $('#username-page').hide();
        $('#room-page').show();
        console.log("show room");
    }
    else{
        $('#username-page').show();
        $('#room-page').hide();
        console.log("show username");
    }



    //get rooms from server
    //connect to server
	var server = new WebSocket('ws://18.224.202.15:9191');
	console.log("trying to connnect");
	server.onopen = function(){
		console.log("connected");
			
		var data = {};
		data.GET_ROOMS = true;
		var message = JSON.stringify(data);
		server.send(message);
	};

	server.onerror = function(error){
		alert('WebSocket Error ' + error); console.log(error);
	};

	server.onmessage	= function(e){
		var data = JSON.parse(e.data);
		if(data.ROOMS){
            var rooms = data.roomList;
			for(var i=0; i<rooms.length; i++){
                $('#rooms').append("<option value='"+i+"'>"+rooms[i].roomName+"</option>");
                roomIds[i] = rooms[i].roomId;
                hostIds[i] = rooms[i].hostId;
                gameTypes[i] = rooms[i].gameType;
                console.log("i["+i+"] gameType["+gameTypes[i]+"]");
            }
		}
	};
};


function setUsername(){
    var username = $("#username").val();
    if(username.match(/^[0-9a-z]+$/i) && username.length > 2){
        //store username
		sessionStorage.setItem("playerId", username);

        //show rooms
        //$('#username-page').hide();
        //$('#room-page').show();
        return true;
    }
    else{
        return false;
    }
}



function createRoom(){
    var roomName = $("#roomname").val();
    var playerId = sessionStorage.getItem("playerId");

    if(roomName.match(/^[0-9a-z]+$/i) && roomName.length > 2 && playerId.match(/^[0-9a-z]+$/i) && playerId.length > 2){
        //variables
        var roomId = createId();
        var gameType = $('#game_types').children("option:selected").val();

        //roomData
        var roomData = {};
        if(sessionStorage.getItem(roomId)) roomData = JSON.parse(sessionStorage.getItem(roomId));

        //populate roomData
        roomData.roomName = roomName;
        roomData.isHost = true;
        roomData.gameType = gameType;
        delete roomData.hostId;

        //save roomData
        sessionStorage.setItem(roomId, JSON.stringify(roomData));

        //add hidden gameType to form
        $('<input>', { type:'hidden', id:'gameType', name:'gameType', value:gameType }).appendTo('form');

        //set form action
        $('#createRoomForm').attr('action', 'client.php?roomId='+roomId);

        //success
        return true;
    }
    else{
        return false;
    }
}

function joinRoom(){
    //variables
    var index = $("#rooms").children("option:selected").val();
    var roomId = roomIds[index];
    var gameType = gameTypes[index];

    //roomData
    var roomData = {};
    if(sessionStorage.getItem(roomId)) roomData = JSON.parse(sessionStorage.getItem(roomId));

    //populate roomData
    if(!roomData.isHost) roomData.hostId = hostIds[index];
    roomData.gameType = gameType;

    //save roomData
    sessionStorage.setItem(roomId, JSON.stringify(roomData));

    //add hidden gameType to form
    $('<input>', { type:'hidden', id:'gameType', name:'gameType', value:gameType }).appendTo('form');

    //set form action
    $('#joinRoomForm').attr('action', 'client.php?roomId='+roomId);
    
    //success
    return true;
}

function createId(){
    return 'cxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

</script>

















<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
</body>
</html>