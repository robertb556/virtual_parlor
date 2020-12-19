'use strict';


console.log("init Vietrob.");

//##############################################
//-----------------IMAGES-----------------------
//##############################################
//set asset directory
assetDirectory = "modules/Vietrob/img/";

//load images
for(var i=1; i<=2; i++) loadImageFile("card4"+i, "p4"+i+".png");		//cards
loadImageFile("bluebase", "bluebase.png");
loadImageFile("blueback", "blueback.png");
loadImageFile("bluemask", "bluemask.png");
loadImageFile("INF", "INF.png");
loadImageFile("ARM", "ARM.png");
loadImageFile("REC", "REC.png");
loadImageFile("SUP", "SUP.png");
loadImageFile("CAS", "CAS.png");
loadImageFile("BLD", "BLD.png");
loadImageFile("TAC", "TAC.png");
loadImageFile("map", "map.png");
var cardCount = 0;



//##############################################
//-----------------COMPOSIT IMAGES--------------
//##############################################
function createCompositeGameImages() {
    //placeholders
    for (var i = 0; i < 200; i++) IMG["card"+i] = IMG["bluebase"];

    //get the actual image data started loading from database
    $.post("modules/Vietrob/pages/api/getCards.php", {}).done(function (data) {
        var cardList = JSON.parse(data);
        for (var i = 0; i < cardList.length; i++) {
            var c = cardList[i];
            var cardImg = createCardImg(IMG["bluebase"], c.name, c.cost, c.power, IMG[c.type], c.text1, c.text2, c.text3);
            IMG["card"+i] = cardImg;
            cardCount++;
        }
    });
}
function createCardImg(baseImg, title, cost, power, typeImg, text1, text2, text3) {
    //prepare canvas
    var canvas = document.createElement("canvas");
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    var ctx = canvas.getContext('2d');
    ctx.font = "bold 128px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    //draw
    ctx.drawImage(baseImg, 0, 0);
    ctx.fillText(title, 512, 535);
    ctx.fillText(cost+"T", 330, 900);
    ctx.fillText(power+"", 710, 900);
   if(typeof typeImg !== 'undefined') ctx.drawImage(typeImg, 0, 0);

    ctx.font = "72px Arial";
    ctx.fillText(text1, 512, 635);
    ctx.fillText(text2, 512, 705);
    ctx.fillText(text3, 512, 775);

    //return
    return canvas;
}




//##############################################
//-----------------OBJECTS----------------------
//##############################################
function loadGameElements() {
    //boards
    gameObjects.createObject(['board', 0, 0, null, [], "map"]);

    //cards
    for (var i = 0; i < cardCount; i++) {
        gameObjects.createObject(['card', 200, 200, null, [], 1, "card" + i, "blueback", "bluemask", true, false, false]);
    }
    //gameObjects.createObject(['card', 200, 200, null, [], 1, "dcard", "blueback", "bluemask", true, false, false]);
    //gameObjects.createObject(['card', 200, 200, null, [], 1, "card41", "blueback", "bluemask", true, false, false]);
}


