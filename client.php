
<html>
<head>
<link rel="shortcut icon" href="#" />
<script type="text/javascript" src="js/Game.js"></script>
<script type="text/javascript" src="js/Graphics.js"></script>
<script type="text/javascript" src="js/Input.js"></script>
<script type="text/javascript" src="js/Mouse.js"></script>
<script type="text/javascript" src="js/Keyboard.js"></script>
<script type="text/javascript" src="js/Network.js"></script>
<script type="text/javascript" src="js/RoomManager.js"></script>
<script type="text/javascript" src="js/GameObject.js"></script>
<script type="text/javascript" src="js/imagelist.js"></script>
<script type="text/javascript" src="js/gameobjects.js"></script>
<script type="text/javascript" src="js/peerjs/peer.js"></script>
<?php
if(isset($_POST['gameType'])) echo '<script type="text/javascript" src="modules/'.$_POST['gameType'].'/init.js"></script>';
?>

</head>

<body style="margin:0px; background-color:white;">
<div id="windowSize" style="position:absolute; top:0; bottom:0; width:100%; height:100%;"></div>
<div id="main" style="position:relative;"></div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</body>
</html>	
	