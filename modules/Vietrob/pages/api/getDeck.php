<?php
require "initDb.php";




$sql = "SELECT dc.qty as qty, c.id as id, c.name as name, c.power as power, c.cost as cost, c.type as type, c.text1 as text1, c.text2 as text2, c.text3 as text3 FROM deck_cards as dc LEFT JOIN cards as c ON dc.card_id = c.id where deck_id = ?";
$vars = [$_REQUEST["deck_id"]];
$statement = $pdo->prepare($sql);
$statement->execute($vars);
$view = $statement->fetchAll();

$list = array();
foreach($view as $row){
    $card = array();
    $card["qty"] = $row["qty"];
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