var waitX = 0;
var waitY = 0;

function initState(){
  ctx.fillStyle = "rgb(150,180,250)";
  ctx.fillRect(0, 0, width, height);

   // Define the text and position
   var text = "Click!";
   var x = width / 2;
   var y = height / 2;

   waitX+= 10;
   if(waitX > width/2){
     waitX = -width/2;
   }


    // Draw the text on the canvas
    ctx.font = "Bold 60px Fixedsys";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x+waitX, y+waitY);

    if(mouseState[2][1]){
      waitY += 50;
      if(waitY > height/2){
        waitY = -height/2;
      }
    }

    if (mouseState[0][1] && (allDataIsLoaded || checkImages())) {
       loadSprites();
       state = menuState;
       setupMenuState();
   }

}
