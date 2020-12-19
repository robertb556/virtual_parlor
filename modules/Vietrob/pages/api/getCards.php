<?php
require "initDb.php";




$sql = "SELECT * FROM cards";
$view = $pdo->query($sql)->fetchAll();

$list = array();
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
    $list[] = $card;
}
echo json_encode($list);