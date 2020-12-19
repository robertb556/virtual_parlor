<?php
require "api/initDb.php";

$sql = "SELECT * FROM cards where id = ?";
$data = [$_REQUEST["cardId"]];
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

    <title>Edit Card</title>
  </head>







<body>
<div class="container">
<div class="row">
<div class="col-12">
<form id="mainForm" class="form-horizontal" enctype="application/x-www-form-urlencoded" method="post">
<fieldset>

<!-- Form Name -->
<h2>Edit Card</h2>  

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="name">Name</label>  
  <div class="col-md-4">
  <input id="name" name="name" type="text" placeholder="" class="form-control input-md" <?php echo isset($card) ? "value='".$card["name"]."'" : "" ?>>
    
  </div>
</div>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="type">Type</label>  
  <div class="col-md-4">
  <input id="type" name="type" type="text" placeholder="eg. INF, ARM, SUP, CAS, REC, BLD, TAC" class="form-control input-md" <?php echo isset($card) ? "value='".$card["type"]."'" : "" ?>>
    
  </div>
</div>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="cost">Cost</label>  
  <div class="col-md-4">
  <input id="cost" name="cost" type="text" placeholder="" class="form-control input-md" <?php echo isset($card) ? "value='".$card["cost"]."'" : "" ?>>
    
  </div>
</div>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="power">Power</label>  
  <div class="col-md-4">
  <input id="power" name="power" type="text" placeholder="" class="form-control input-md" <?php echo isset($card) ? "value='".$card["power"]."'" : "" ?>>
    
  </div>
</div>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="text1">Text Line 1</label>  
  <div class="col-md-4">
  <input id="text1" name="text1" type="text" placeholder="" class="form-control input-md" <?php echo isset($card) ? "value='".$card["text1"]."'" : "" ?>>
    
  </div>
</div>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="text2">Text Line 2</label>  
  <div class="col-md-4">
  <input id="text2" name="text2" type="text" placeholder="" class="form-control input-md" <?php echo isset($card) ? "value='".$card["text2"]."'" : "" ?>>
    
  </div>
</div>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="text3">Text Line 3</label>  
  <div class="col-md-4">
  <input id="text3" name="text3" type="text" placeholder="" class="form-control input-md" <?php echo isset($card) ? "value='".$card["text3"]."'" : "" ?>>
    
  </div>
</div>

<!-- Button -->
<div class="form-group">
  <label class="col-md-4 control-label" for="submit">Save</label>
  <div class="col-md-4">
    <button id="submit" name="submit" class="btn btn-primary">Save</button>
  </div>
</div>


<input type="hidden" id="cardId" name="cardId" <?php echo isset($card) ? "value='".$card["id"]."'" : "" ?>>

</fieldset>
</form>


</div>
</div>
</div>




<script>
window.onload = function(){
    $("#mainForm").submit(function(){
        var card = {};
        //card.id = $("cardId").val();
        card.name = $("name").val();
        card.type = $("type").val();
        card.cost = $("cost").val();
        card.power = $("power").val();
        card.text1 = $("text1").val();
        card.text2 = $("text2").val();
        card.text3 = $("text3").val();
        console.log("pre["+card+"]");

        $.post("api/editCard.php", $( "#mainForm" ).serialize()).done(function(data){
            console.log("result["+data+"]");
        });
        
        //location.reload();
        window.location = "cards.php";
        //$("#mainForm").find("input[type=text], textarea").val("");
        
        return false;
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