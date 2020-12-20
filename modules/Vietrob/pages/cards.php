<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

    <title>Cards</title>
  </head>

<body>
<div class="container">
<div class="row">
<div class="col-12">
<h2>Cards</h2>    
<table id="cardTable" class="table">
    <thead>
    <th>Select</th>
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
    <a href="editCard.php" class="btn btn-secondary">Create Card</a>
    <button id="addToDeck1" type="button" class="btn btn-primary deckAdderBtn" disabled>Add to Blue Deck</button>
    <button id="addToDeck2" type="button" class="btn btn-danger deckAdderBtn" disabled>Add to Red Deck</button>
</div>
</div>
</div>
    
<script>
window.onload = function(){
    
    
    
    $.post("api/getCards.php", {}).done(function(data){
        var list = JSON.parse(data);
        
        for(var i=0; i<list.length; i++){
            $("#cardTable").children('tbody').append("<tr><td><input class='addDeckCheck' type='checkbox' id='check"+list[i].id+"' name='check"+list[i].id+"' value='"+list[i].id+"'></td><td class='clickableCell' style='cursor: pointer;' data-href='editCard.php?cardId="+list[i].id+"'>"+list[i].name+"</td><td>"+list[i].type+"</td><td>"+list[i].cost+"</td><td>"+list[i].power+"</td><td>"+list[i].text1+"</td><td>"+list[i].text2+"</td><td>"+list[i].text3+"</td></tr>");
        }
        
        $(".clickableCell").click(function() {
            window.location = $(this).data("href");
        }).hover(function(){
            $(this).css("background-color", "#dddddd");
        }, function(){
            $(this).css("background-color", "transparent");
        });
        
        $('#cardTable').DataTable();
        //paging: false
        
        //
        $(".addDeckCheck:checkbox").change(function(){
            var count = $(".addDeckCheck:checkbox:checked").length;
            if(count <= 0) $(".deckAdderBtn").prop("disabled", true);
            else $(".deckAdderBtn").prop("disabled", false);
        });
    });
    
    $("#addToDeck1").click(function() {
        addToDeck(1);
    });
    
    $("#addToDeck2").click(function() {
        addToDeck(2);
    });
    
}

function addToDeck(deck_id){
    var cards = [];
    $(".addDeckCheck:checkbox:checked").each(function(index){
        console.log("check["+$(this).val()+"]");
        var card = {};
        card.card_id = $(this).val();
        card.qty = 1;
        cards.push(card);
    });
    var data = {};
    data.deck_id = deck_id;
    data.cards = cards;
    console.log("cards local["+data.cards+"]");
    $.post("api/buildupDeck.php", {"data":JSON.stringify(data)}).done(function(result){
        console.log("result["+result+"]");
        window.location = "editDeck.php?deck_id="+deck_id;
    });
}
</script>
    
    

<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha384-ZvpUoO/+PpLXR1lu4jmpXWu80pZlYUAfxl5NsBMWOEPSjUn/6Z/hRTt8+pR6L4N2" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/dt-1.10.23/datatables.min.css"/>
<script type="text/javascript" src="https://cdn.datatables.net/v/bs4/dt-1.10.23/datatables.min.js"></script>
</body>
</html>