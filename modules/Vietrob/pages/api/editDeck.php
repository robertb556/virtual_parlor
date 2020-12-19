<?php
require "initDb.php";


$data = json_decode($_REQUEST["data"], true);
$cards = $data["cards"];
$deck_id = $data["deck_id"];

$sql = "INSERT INTO deck_cards (deck_card_id, deck_id, card_id, qty) VALUES ";
$vars = array();
for($i=0; $i<count($cards); $i++){
    $sql .= "(?,?,?,?),";
    $vars[] = $deck_id."-".$cards[$i]["card_id"];
    $vars[] = $deck_id;
    $vars[] = $cards[$i]["card_id"];
    $vars[] = $cards[$i]["qty"];
}
$sql = substr($sql, 0, strlen($sql)-1);  //trim trailing comma
$sql .= "ON DUPLICATE KEY UPDATE deck_id=VALUES(deck_id), card_id=VALUES(card_id), qty=VALUES(qty)";

$statement = $pdo->prepare($sql);
$statement->execute($vars);


//delete where qty is zero
$sql = "DELETE FROM deck_cards WHERE qty = 0";
$pdo->query($sql);
