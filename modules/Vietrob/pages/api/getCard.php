<?php
require "initDb.php";

$sql = "SELECT * FROM cards where id = ?";
$data = [$_REQUEST["card_id"]];
$statement = $pdo->prepare($sql);
$statement->execute($data);
$view = $statement->fetchAll();
foreach($view as $row){
    $card = array();
    $card["id"] = $row["id"];
    $card["name"] = $row["name"];
    $card["power"] = $row["power"];
    $card["cost"] = $row["cost"];
    $card["type"] = $row["type"];
    $card["text1"] = $row["text1"];
    $card["text2"] = $row["text2"];
    $card["text3"] = $row["text3"];
    
    echo json_encode($card);
}