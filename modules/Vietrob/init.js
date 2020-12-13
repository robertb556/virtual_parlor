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
loadImageFile("inf", "inf.png");
loadImageFile("map", "map.png");




//##############################################
//-----------------COMPOSIT IMAGES--------------
//##############################################
function createCompositeGameImages(){
    addImage("dcard", createCard(IMG["bluebase"], "Ol Liberty Boys", 2, 2, IMG["inf"], "Entrench 3.", "asdf", "asdf"));
}
function createCard(baseImg, title, cost, power, typeImg, text1, text2, text3) {
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
    ctx.drawImage(typeImg, 0, 0);

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
    gameObjects.createObject(['card', 200, 200, null, [], 1, "dcard", "blueback", "bluemask", true, false, false]);
    gameObjects.createObject(['card', 200, 200, null, [], 1, "card41", "blueback", "bluemask", true, false, false]);

}


