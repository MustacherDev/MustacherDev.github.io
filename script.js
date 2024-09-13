



var executingState = initState;

var siteUrl = ["https://mustacherdev.github.io/Planterator-2000/", "https://mustacherdev.github.io/JavascriptGame/", "https://mustacherdev.github.io/123Cut-Client/", "https://mustacherdev.github.io/"];


class SiteTarget extends Box{
  constructor(x, y, site){
    super(x, y, 120, 120, sprites[SPR.SITEICONS]);
    this.site = site;

    this.type = OBJECT.SITETARGET;

    this.floatPhase = 0 + this.site*Math.PI/2.5;
    this.floatY = 0;
    this.floatX = 0;

    this.xScl = this.width/this.sprite.width;
    this.yScl = this.height/this.sprite.height;

    this.extraScl = 1;

    this.poofingState = 0;
    

    this.boundingBox = new BoundingBox(this.x, this.y, this.width/2, this.height/2);
    this.boundingBox.setOffsetRelative(0.5, 0.5);
  }

  poof(){
    if(manager.poofed) return;

    manager.poofed = true;
    this.poofingState = 1;

    snd_Hit.play();

    for (var j = 0; j < 12; j++) {
      manager.addParticle(particleDust(this.x + this.floatX + randRange(-16, 16), this.y + this.floatY + randRange(-16, 16)));
    }

    
  }

  update(dt){
    this.floatPhase += 0.025*dt;
    this.floatY = Math.sin(this.floatPhase)*50;
    this.floatX = Math.cos(this.floatPhase*0.3)*300;

    this.boundingBox.x = this.x + this.floatX;
    this.boundingBox.y = this.y + this.floatY;


    if(this.poofingState == 1){
      this.extraScl += 0.04;
      if(this.extraScl >= 1.5){
        this.poofingState = 2;
      }
    } else  if(this.poofingState == 2){
      this.extraScl -= 0.02;
      if(this.extraScl <= 1){
        this.extraScl = 1;
        this.poofingState = 3;
      }
    } else if(this.poofingState == 3){
      window.location.href = siteUrl[this.site];
      this.poofingState = 0;
    }

    if(this.boundingBox.contains(input.mouseX, input.mouseY)){
      if(input.mouseState[0][1]){
        this.poof();
      }
    }


    if(this.boundingBox.intersects(boat.boundingBox)){
      boat.active = false;
      this.poof();
    }
    
  }

  draw(ctx){
    sprites[SPR.SITEICONS].drawExtRelative(this.x+this.floatX, this.y+this.floatY, this.site, this.xScl*this.extraScl, this.yScl*this.extraScl, 0, 0.5, 0.5);
    sprites[SPR.CLOUD].drawExtRelative(this.x+this.floatX, this.y+this.floatY + this.height/2, 0, this.xScl*2, this.yScl*2, 0, 0.5, 0.5);
    
  }
}



var elapsedTime = 0;
var thenTimeDate = new Date();
const FRAMERATE = 60;

function step() {


  var nowTimeDate = new Date();
  elapsedTime = nowTimeDate.getTime() - thenTimeDate.getTime();

  var discountTime = 0;
  if(pageFocusChange && pageFocused){
    discountTime = nowTimeDate.getTime() - pageUnfocusedStart.getTime();
    pageFocusChange = false;
  }

  elapsedTime = Math.max(elapsedTime - discountTime, 0);

  thenTimeDate = new Date(nowTimeDate);
  var dt = elapsedTime/(1000/FRAMERATE);

  canvas.style.cursor = 'default';


  ctx.fillStyle = "rgb(10, 10, 10)";
  ctx.fillRect(0,0, canvas.width, canvas.height);


  executingState(dt);

  // Input Handling
  input.update();




  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
