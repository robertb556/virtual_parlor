<?php

$dbhost = "localhost";
$dbuser = "vietrob_user";
$dbpass = "8hq0v8YKWrhjUDbW";
$db = "vietrob";
$table = "cards";
$pdo = new PDO("mysql:host=$dbhost;dbname=$db", $dbuser, $dbpass);
$pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

