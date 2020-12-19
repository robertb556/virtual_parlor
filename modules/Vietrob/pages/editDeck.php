<?php
require "api/initDb.php";

$sql = "SELECT * FROM decks where id = ?";
$data = [$_REQUEST["deck_id"]];
$statement = $pdo->prepare($sql);
$statement->execute($data);
$view = $statement->fetchAll();
foreach($view as $row){
    $deck = array();
    $deck["id"] = $row["id"];
    $deck["name"] = $row["name"];
    $deck["creator"] = $row["creator"];
}
//echo json_encode($statement->errorInfo());
?>

<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

    <title>Edit Deck</title>
  </head>

<body>
<div class="container">
<div class="row">
<div class="col-12">
<h2>Edit Deck: <?php echo $deck["name"]; ?></h2>    
<table id="cardTable" class="table">
    <thead>
    <th>Qty</th>
    <th>Name</th>
    <th>Type</th>
    <th>Cost</th>
    <th>Power</th>
    <th>Text1</th>
    <th>Text2</th>
    <th>Text3</th>
    </thead>
    <tbody></tbody>
</table>
</div>
</div>

<div class="row">
<div class="col-12">
    <button id="updateQtys" type="button" class="btn btn-primary">Update Qtys</button>
</div>
</div>
</div>
    
<script>
window.onload = function(){
    var url = new URL(window.location.href);
    var deck_id = url.searchParams.get("deck_id");
    $.post("api/getDeck.php", {"deck_id":deck_id}).done(function(data){
        var list = JSON.parse(data);
        
        for(var i=0; i<list.length; i++){
            $("#cardTable").children('tbody').append("<tr><td><input class='cardQtyText' type='text' id='card_id"+list[i].id+"' name='card_id"+list[i].id+"' maxLength='1' size='1' value='"+list[i].qty+"'></td><td>"+list[i].name+"</td><td>"+list[i].type+"</td><td>"+list[i].cost+"</td><td>"+list[i].power+"</td><td>"+list[i].text1+"</td><td>"+list[i].text2+"</td><td>"+list[i].text3+"</td></tr>");
        }
    });
    
    $("#updateQtys").click(function() {
        var cards = [];
        $(".cardQtyText").each(function(index){
            console.log("check["+$(this).val()+"]");
            var card = {};
            card.card_id = $(this).attr("id").substring(7);
            card.qty = $(this).val();
            cards.push(card);
        });
        var data = {};
        data.deck_id = deck_id;
        data.cards = cards;
        console.log("cards local["+JSON.stringify(data)+"]");
        $.post("api/editDeck.php", {"data":JSON.stringify(data)}).done(function(result){
            console.log("result["+result+"]");
            //window.location = "editDeck.php";
            location.reload();
        });
    });
    
}
</script>
    
    

<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha384-ZvpUoO/+PpLXR1lu4jmpXWu80pZlYUAfxl5NsBMWOEPSjUn/6Z/hRTt8+pR6L4N2" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
</body>
</html>