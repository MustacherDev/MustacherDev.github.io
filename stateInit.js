
class InitScreen{
  constructor(){
    this.waitX = 0;
    this.waitY = 0;
    this.text = "Click!";

    this.transitioning = false;
    this.finished = false;

    this.x = roomWidth/2;
    this.y = roomHeight/2;

    this.endAlarm = new Alarm(0, 100);
  }

  update(dt){

   

    if(this.transitioning){
      this.endAlarm.update(dt);
      if(this.endAlarm.finished){
        this.finished = true;
      }
    } else {
      this.waitX+= 10*dt;
      if(this.waitX > roomWidth/2){
        this.waitX = -roomWidth/2;
      }
    }

    if(input.mouseState[2][1]){
      this.waitY += 50;
      if(this.waitY > roomHeight/2){
        this.waitY = -roomHeight/2;
      }
    }
  }

  draw(ctx){
    ctx.fillStyle = "rgb(150,180,250)";
    ctx.fillRect(0, 0, roomWidth, roomHeight);
    // Draw the text on the canvas
    ctx.font = "Bold 60px Fixedsys";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x+this.waitX, this.y+this.waitY);
  }

  drawFade(ctx){
    ctx.fillStyle = "rgb(150,180,250," + this.endAlarm.percentage() + ")";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

var initScreen = new InitScreen();

function initState(dt){

  ctx.save();
  ctx.translate(canvasOffsetX, canvasOffsetY);
  ctx.scale(canvasSclX, canvasSclY);
  mainCam.applyTransform(ctx);

  initScreen.update(dt);
  initScreen.draw(ctx);

  ctx.restore();
  initScreen.drawFade(ctx);


  if(!initScreen.transitioning){
    if (input.mouseState[0][1] && (allDataIsLoaded || checkImages())) {
      loadSprites();
      initScreen.transitioning = true;
    }
  }

  if(initScreen.finished){
    executingState = menuState;
    setupMenuState();
  }

  

}


