<?php
require "initDb.php";

if(isset($_REQUEST["cardId"]) && strlen($_REQUEST["cardId"]) > 0){
    $sql = "UPDATE cards SET name=?, power=?, cost=?, type=?, text1=?, text2=?, text3=?, image='' WHERE id=?";
    $data = [$_REQUEST["name"], $_REQUEST["power"], $_REQUEST["cost"], $_REQUEST["type"], $_REQUEST["text1"], $_REQUEST["text2"], $_REQUEST["text3"], $_REQUEST["cardId"]];
}
else{
    $sql = "INSERT INTO cards (name, power, cost, type, text1, text2, text3, image) VALUES (?, ?, ?, ?, ?, ?, ?, '')";
    $data = [$_REQUEST["name"], $_REQUEST["power"], $_REQUEST["cost"], $_REQUEST["type"], $_REQUEST["text1"], $_REQUEST["text2"], $_REQUEST["text3"]];
}
$statement = $pdo->prepare($sql);
$statement->execute($data);


