
// Base Object
class GameObject {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.hspd = 0;
    this.vspd = 0;
    this.angSpd = 0;

    this.sprite = sprite;
    this.depth = 0;
    this.ang = 0;
    this.xScl = 1;
    this.yScl = 1;

    this.type = OBJECT.GAMEOBJECT;

    this.active = true;
  }


  draw(ctx) {
    this.sprite.drawExt(this.x, this.y, 0, this.xScl, this.xScl, 0, 0, 0);
  }

  update() {
    this.x += this.hspd;
    this.y += this.vspd;
    this.ang += this.angSpd;
  }

  pushDrawList() {
    addList(new DrawRequest(this, this.depth, 0), OBJECT.DRAW);
  }

  drawRequest(ctx, parameter) {
    this.draw(ctx);
  }

  onDestroy() {

  }

  onRespawn() {

  }
}


class DrawRequest {
  constructor(obj, depth, parameter = null) {
    this.obj = obj;
    this.depth = depth;
    this.parameter = parameter;
  }

  draw(ctx) {
    this.obj.drawRequest(ctx, this.parameter);

  }
}





class TextObject extends GameObject {
  constructor(x, y, text) {
    super(x, y, null);
    this.hspd = 0;
    this.vspd = 0;
    this.scl = 2;
    this.text = text;

    this.depth = -1;

    this.maxLife = 150;
    this.life = this.maxLife;
  }

  update(dt) {
    this.y -= 1*dt;
    this.life -= dt;

    if (this.life <= 0) {
      this.active = false;
    }
  }


  draw(ctx) {
    ctx.font = "20px Fixedsys";

    let hue = Math.random() * 360;
    ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
    ctx.fillText(this.text, this.x + 2, this.y + 2);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(this.text, this.x, this.y);
  }

}


class GameManager {
  constructor() {
    this.holding = false;
    this.holdingObject = null;
    this.holdingContent = null;

    this.prevMousePos = [];
    this.prevMousePosNumber = 5;

    this.poofed = false;

    this.beanStalkScl = 5;

    this.tick = 0;
    this.tickHold = 20;

    this.startAlarm = new Alarm(0, 100);


    this.screenBorder = new ScreenBorder(sprites[SPR.ROPEFRAME]);

    this.titleUpdateAlarm = new Alarm(0, 200);
    this.titles = ["[o_O]", "[o_O]","[O_o]","[o_o]","[o_O]", "[o_o]","[o_O]", "[O_O]", "[^_^]", "[o_o]", "[-_-]", "[-_-]", "[-_-]Z","[-_-]zZ","[-_-]ZzZ", "[-_-]zZzZ", "[-_-]ZzZzZ", "[-_-]zZzZzZ", "[-_-]ZzZzZzZ", "[0_0]!!!", "[o_o]"];
    this.titleInd = 0;


    this.particles = [];
  }

  update(dt){
    this.titleUpdateAlarm.update(dt);
    if(this.titleUpdateAlarm.finished){
      this.titleUpdateAlarm.restart();
      this.titleInd = (this.titleInd+1)%this.titles.length;
      
      document.title = this.titles[this.titleInd];
    }


    this.startAlarm.update(dt);

    if(this.holdingObject == null){
      this.holding = false;
    } else if(!this.holdingObject.holder.holded){
      this.holding = false;
    } else if(!this.holdingObject.active){
      this.holding = false;
    }

    this.prevMousePos.push(new Vector(input.mouseX, input.mouseY));
    if(this.prevMousePos.length > this.prevMousePosNumber){
      this.prevMousePos.shift();
    }

    this.tick += dt;
    if (this.tickHold < 50) {
      this.tickHold += dt*0.01;
    }

    if (this.tick > this.tickHold) {
      this.tick = 0;
        createCloud(1);
  
        if (chance(0.1)) {
  
            var beanNum = 1;
  
            if (chance(0.2)) {
                beanNum += randInt(0, 4);
            }
  
  
            var beanX = (Math.random() * roomWidth) + roomWidth + 160;
            var beanY = (roomHeight / 1.5) + (Math.random() * roomHeight / 2);
            for (var i = 0; i < beanNum; i++) {
                createBeanstalk(beanX, beanY);
  
                if (chance(0.3)) {
                    beanY += manager.beanStalkScl * 16;
                }
  
                beanX += manager.beanStalkScl * 16 * Math.ceil(Math.random() * 4);
            }
        }
    }

    for(var i = 0; i < this.particles.length; i++){
      var part = this.particles[i];

      if(!part.active){
        this.particles.splice(i, 1);
        i--;
        continue;
      }


      part.update(dt);
      part.pushDrawList();


    }
  
  }

  addParticle(part){
    if(this.particles.length <= 2000){
      this.particles.push(part);
    }
  }

  draw(ctx){
    this.screenBorder.draw(ctx);
  }

  drawFade(ctx){
    if(!this.startAlarm.finished){
      ctx.fillStyle = "rgb(150,180,250," + (1-this.startAlarm.percentage()) + ")";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
}



class Holder {
  constructor() {
    this.holded = false;
    this.holdX = 0;
    this.holdY = 0;
    this.holdEvent = false;
    this.throwEvent = false;
  }

  getHold(obj) {
    if (obj.hovered && !this.holded && input.mouseState[0][1] && manager.holding == false && obj.canBeHeld) {
      manager.holding = true;
      manager.holdingObject = obj;
      manager.holdingContent = obj.type;

      this.holded = true;
      this.holdEvent = true;
      this.holdX = input.mouseX - obj.x;
      this.holdY = input.mouseY - obj.y;


      obj.hspd = 0;
      obj.vspd = 0;
    }
  }

  update(obj) {
    if (this.holded) {

      obj.x = input.mouseX - this.holdX;
      obj.y = input.mouseY - this.holdY;

      if (!input.mouseState[0][0]) {
        this.holded = false;
        this.throwEvent = true;

        this.throw(obj);
      }
    }
  }

  throw(obj) {
    let totalXDiff = 0;
    let totalYDiff = 0;

    for (const mousePos of manager.prevMousePos) {
      totalXDiff += (obj.x + this.holdX) - mousePos.x;
      totalYDiff += (obj.y + this.holdY) - mousePos.y;
    }

    var throwForce = 1;
    obj.hspd = (totalXDiff / manager.prevMousePos.length) * throwForce;
    obj.vspd = (totalYDiff / manager.prevMousePos.length) * throwForce;
  }
}






class Box extends GameObject {
  constructor(x, y, width, height, sprite) {
    super(x, y, sprite);

    this.type = OBJECT.BLOCK;

    this.width = width;
    this.height = height;

    this.xOffset = 0;
    this.yOffset = 0;

    this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
    this.boundingBox.xOffset = this.xOffset;
    this.boundingBox.yOffset = this.yOffset;

    this.clickBox = new BoundingBox(this.x, this.y, this.width, this.height);
    this.clickBox.xOffset = this.xOffset;
    this.clickBox.yOffset = this.yOffset;

    this.hovered = false;

    this.hspdMax = 20;
    this.vspdMax = 20;
    this.angSpdMax = 1;

    this.angDamp = 0.99;
    this.linDamp = 0.999;

    this.vLoss = 0.8;
    this.hLoss = 0.9;

    this.gravityOn = true;
    this.gravity = new Vector(0, 0.1);

    this.rotateOnCollision = true;

    this.hacc = 0;
    this.vacc = 0;

    // EAST, NORTH, WEST, SOUTH
    this.roomLimitsActive = [true, false, true, true];
    this.roomLimits = [roomWidth, 0, 0, roomHeight];

    this.onGround = false;

    this.holder = new Holder();
    this.canBeHeld = true;
  }

  scale2FitSprite() {
    this.xScl = this.width / this.sprite.width;
    this.yScl = this.height / this.sprite.height;
  }

  draw(ctx) {
    this.sprite.drawExt(this.x, this.y, 0, this.xScl, this.yScl, this.ang, this.xOffset / this.xScl, this.yOffset / this.yScl);
  }


  parameterStep(dt) {


    if (this.gravityOn) {
      this.hacc += this.gravity.x;
      this.vacc += this.gravity.y;
    }

    this.hspd += this.hacc * dt;
    this.vspd += this.vacc * dt;

    this.hspd *= Math.pow(this.linDamp, dt);
    this.vspd *= Math.pow(this.linDamp, dt);
    this.angSpd *= Math.pow(this.angDamp, dt);

    this.hspd = clamp(this.hspd, -this.hspdMax, this.hspdMax);
    this.vspd = clamp(this.vspd, -this.vspdMax, this.vspdMax);
    this.angSpd = clamp(this.angSpd, -this.angSpdMax, this.angSpdMax);

    this.x += this.hspd * dt;
    this.y += this.vspd * dt;
    this.ang += this.angSpd * dt;

    this.boundingBox.updatePos(this.x, this.y);
    this.clickBox.updatePos(this.x, this.y);

    this.hacc = 0;
    this.vacc = 0;

  }

  collisionAction(isHorizontal, velocity) {

  }

  updateBox(dt) {

    this.parameterStep(dt);

    this.hovered = false;
    if (this.clickBox.isPointInside(input.mouseX, input.mouseY)) {
      this.hovered = true;
    }

    this.holder.getHold(this);

    // Wall Collisions
    if (!this.holder.holded) {

      if (this.roomLimitsActive[0]) {
        if (this.x - this.boundingBox.xOffset + this.width > this.roomLimits[0]) {
          this.collisionAction(true, this.hspd);

          this.x = this.roomLimits[0] - this.width + this.boundingBox.xOffset;

          if (this.rotateOnCollision) {
            this.angSpd += this.vspd / 40;
          }
          this.hspd *= -this.hLoss;
        }
      }

      if (this.roomLimitsActive[2]) {
        if (this.x - this.boundingBox.xOffset < this.roomLimits[2]) {
          this.collisionAction(true, this.hspd);

          this.x = this.roomLimits[2] + this.boundingBox.xOffset;

          if (this.rotateOnCollision) {
            this.angSpd += this.vspd / 40;
          }
          this.hspd *= -this.hLoss;
        }
      }

      if (this.roomLimitsActive[1]) {
        if (this.y - this.boundingBox.yOffset < this.roomLimits[1]) {
          if (Math.abs(this.vspd) > Math.abs(this.gravity.y * 3)) {
            this.collisionAction(false, this.vspd);
            if (this.rotateOnCollision) {
              this.angSpd += this.hspd / 40;
            }
          }

          this.y = this.roomLimits[1] + this.boundingBox.yOffset;
          this.vspd *= -this.vLoss;
          this.hspd *= this.linDamp;
        }
      }

      if (this.roomLimitsActive[3]) {
        if (this.y - this.boundingBox.yOffset + this.height > this.roomLimits[3]) {
          if (Math.abs(this.vspd) > Math.abs(this.gravity.y * 3)) {
            this.collisionAction(false, this.vspd);
            if (this.rotateOnCollision) {
              this.angSpd += this.hspd / 40;
            }
          }

          this.y = this.roomLimits[3] - this.height + this.boundingBox.yOffset;
          this.vspd *= -this.vLoss;
          this.hspd *= this.linDamp;
        }
      }
    }

    if (this.roomLimitsActive[3]) {
      if (this.y - this.boundingBox.yOffset + this.height + 1 > this.roomLimits[3]) {
        this.onGround = true;
      } else {
        this.onGround = false;
      }
    } else {
      this.onGround = false;
    }

    if (this.onGround) {
      if (this.rotateOnCollision) {
        this.angSpd = this.hspd / 40;
      }
    }

    this.holder.update(this);
  }

  update(dt) {
    this.updateBox(dt);
  }
}


class Ball extends Box {
  constructor(x, y, radius, sprite) {
    super(x, y, radius * 2, radius * 2, sprite);
    this.type = OBJECT.BALL;
    this.xOffset = radius;
    this.yOffset = radius;

    this.boundingBox.setOffset(this.xOffset, this.yOffset);
    this.clickBox.setOffset(this.xOffset, this.yOffset);

    this.r = radius;
  }
}


class Boat extends Ball {
  constructor(x, y, radius) {
    super(x, y, radius, sprites[SPR.BOAT]);
    this.type = OBJECT.BOAT;
    this.frame = 0;
    this.addY = 0;
    this.floating = false;

    this.scale2FitSprite();
    this.xScl = this.yScl;

    this.rotateOnCollision = true;

    this.boundingBox.setOffsetRelative(0.5, 0.5);
    this.clickBox.setOffsetRelative(0.5, 0.5);
  }

  update(dt){
    this.updateBox(dt);

    this.frame += 0.05*dt;

    if (this.floating) {
      this.addY = Math.sin(this.frame) * 40;
    } else {
      this.addY = 0;
    }
  }

  draw(ctx){
    this.sprite.drawExtRelative(this.x, this.y + this.addY, 0, this.xScl, this.yScl, this.ang, 0.5, 0.5);
  }
}


class Cloud extends GameObject {
  constructor(x, y) {
    super(x, y, sprites[SPR.CLOUD]);
    this.type = OBJECT.CLOUD;
    this.xScl = 5;
  }

  update(dt){
    this.x += dt*this.hspd;
    this.y += dt*this.vspd;

    if(this.x > roomWidth*2 || this.x < -roomWidth){
      this.active = false;
    }
  }
}

class BigCloud extends Cloud {
  constructor(x, y) {
    super(x, y);
    this.sprite = sprites[SPR.BIGCLOUD];
    this.type = OBJECT.BIGCLOUD;
  }
}


class Baleadeira extends GameObject {
  constructor(x, y) {
    super(x, y, sprites[SPR.BALEA]);

    this.type = OBJECT.BALEADEIRA;

    this.xScl = 10;
    this.yScl = this.xScl;

    this.ammo = null;
    this.holding = false;

    this.followMouse = false;

    this.xOffset = 0;
    this.yOffset = 0;

    this.body = [0, 1, 3, 2, 0, 1];
  }

  draw(ctx) {

    if (this.ammo != null) {

      ctx.lineWidth = 10;
      ctx.strokeStyle = "rgb(200, 200, 200)";

      if (this.holding) {
        ctx.fillStyle = "rgb(200, 200, 200)";
        if (input.mouseState[0][0]) {
          var xx = this.x + (8 * this.xScl);
          var yy = this.y + (3 * this.yScl);

          var ax = this.ammo.x;
          var ay = this.ammo.y;

          var dx = xx - ax;
          var dy = yy - ay;

          var _hspd = clamp(dx / 30, -40, 40);
          var _vspd = clamp(dy / 30, -40, 40);

          for (let i = 0; i < 20; i++) {
            ax += _hspd * 5;
            ay += _vspd * 5;

            _vspd += 0.1 * 5;
            _hspd = clamp(_hspd, -40, 40);
            _vspd = clamp(_vspd, -40, 40);
            ctx.beginPath();
            ctx.arc(ax, ay, 10, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }

      ctx.strokeStyle = "rgb(100, 100, 100)";

      var x1 = 3 * this.xScl;
      var y1 = 5 * this.xScl;
      var x2 = 14 * this.xScl;
      var y2 = 5 * this.xScl;

      ctx.beginPath();
      ctx.moveTo(this.x + x1, this.y + y1);
      ctx.lineTo(this.ammo.x, this.ammo.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.x + x2, this.y + y2);
      ctx.lineTo(this.ammo.x, this.ammo.y);
      ctx.stroke();
    }

    this.sprite.drawExt(this.x, this.y, 0, this.xScl, this.yScl, this.ang, this.xOffset, this.yOffset);
    for (var i = 0; i < 5; i++) {
      sprites[SPR.BALEAB].drawExt(this.x, this.y + ((32 + (16 * i)) * this.yScl), this.body[i], this.xScl, this.yScl, this.ang, this.xOffset, this.yOffset);
    }

  }

  update(dt) {

    var xxx = this.x + (8 * this.xScl);
    var yyy = this.y + (3 * this.yScl);

    if (!this.holding && this.followMouse) {
      this.x += dt * (input.mouseX - xxx) / 8;
    }

    xxx = this.x + (8 * this.xScl);


    if (this.ammo != null) {
      var xx = this.ammo.x;
      var yy = this.ammo.y;
      var rr = this.ammo.r;

      if (!this.holding) {
        var dx = xxx - this.ammo.x;
        var dy = yyy - this.ammo.y;

        var dist = distance(dx, dy);

        var stretch = Math.max(dist - 200, 0);

        this.ammo.hspd *= Math.pow(0.99, dt);
        this.ammo.vspd *= Math.pow(0.99, dt);
        this.ammo.hspd += dt * (dx / dist) * stretch / 1000;
        this.ammo.vspd += dt * (dy / dist) * stretch / 1000;
      }

      if (input.mouseState[0][0]) {
        if (this.holding) {
          this.ammo.x = input.mouseX;
          this.ammo.y = input.mouseY;
        } else {
          if (pointInRect(input.mouseX, input.mouseY, xx - rr, yy - rr, xx + rr, yy + rr)) {
            this.holding = true;
          }
        }
      } else {
        if (this.holding) {

          var dx = xxx - this.ammo.x;
          var dy = yyy - this.ammo.y;

          this.ammo.hspd = dx / 20;
          this.ammo.vspd = dy / 20;

          this.holding = false;
          this.ammo.attached = false;
          this.ammo = null;
        }
      }
    }
  }
}

class BeanStalkPlant extends GameObject{
  constructor(x, y){
    super(x, y, sprites[SPR.HITBLOCK]);
    this.xScl = 5;
    this.yScl = this.xScl;

    this.width = 

    this.hspd = -4;
    this.gravity = 0;
    this.vspd = 0;


    this.frames = 0;
    this.vineSpeed = 1 / 50;

    this.vineY = 0;

    this.img = 0;

    this.spriteHead = sprites[SPR.BEANSTALK];
    this.spriteVine = sprites[SPR.VINE];

    this.dyingFrames = 100;
    this.dying = false;

    this.boundingBox = new BoundingBox(this.x, this.y, this.xScl*12, this.yScl*12);
    this.boundingBox.setOffset(0, this.vineY);


    this.hasDust = true;
  }

  draw(ctx) {

    var alpha =  ctx.globalAlpha ;
    ctx.globalAlpha = clamp(this.dyingFrames/100, 0,1);

  

      // Vine rise animation


      var vineNum = Math.floor(this.vineY);
      var vineOffset = ((this.vineY) - vineNum) * 16 * this.yScl;

      var lastY = this.y - vineOffset - (vineNum - 1) * 16 * this.yScl;


      for (var i = 0; i < vineNum; i++) {
          lastY = this.y - vineOffset - i * 16 * this.yScl;
          this.spriteVine.drawExt(this.x, lastY, 0, this.xScl, this.yScl, 0, 0, 0);
      }


      this.spriteHead.drawExt(this.x, lastY - 16 * this.yScl, Math.floor(this.img), this.xScl, this.yScl, 0, 0, 0);

      // Block
      this.sprite.drawExt(this.x, this.y, 0, this.xScl, this.yScl, 0, 0, 0);

      ctx.globalAlpha = alpha;
  }

  init() {
      this.hspd = -2;
      this.vspd = 0;

      this.facing = 1;
      this.img = 0;
  }


  update(dt) {

      this.x += dt*this.hspd;
      this.y += dt*this.vspd;

      this.vineY += dt*this.vineSpeed;

      var vineY = this.vineY*this.yScl*16;
      // this.boundingBox.x = this.x + this.xScl * 8 - (this.boundingBox.width/2);
      // this.boundingBox.y = this.y + this.yScl * 8 - (this.boundingBox.height/2) - vineY;
      this.boundingBox.x = this.x;
      this.boundingBox.y = this.y;
      this.boundingBox.setOffset(0, vineY);

      // Beanstalk Head animation
      this.img += 0.05*dt;

      if (this.img >= 2) {
          this.img = 0;
      }

      this.frames += dt;

      if (this.x < -16 * this.xScl) {
          this.dying = true;
      }

      if(this.dying){
        this.dyingFrames -= dt;
        if(this.dyingFrames <= 0){
          this.active = false;
        }
      }

     
        if (this.hasDust) {
          for(var i = 0; i < objectLists[OBJECT.BOAT].length; i++){
            var obj = objectLists[OBJECT.BOAT][i];
            if (this.boundingBox.checkCollision(obj.boundingBox)) {
  
                this.hasDust = false;
  
                snd_Hit.play();
  
                obj.angSpd += randRange(-0.25, 0.25);
                this.vineSpeed = 0;
  
                for (var j = 0; j < 3; j++) {
                  manager.addParticle(particleDust(obj.x + randRange(-64, 64), obj.y + randRange(-64, 64)));
                }
            }
          }
        }
    }
  }



class ScreenBorder{
  constructor(sprite){
    this.x = 0;
    this.y = 0;
    this.width = roomWidth;
    this.height = roomHeight;

    this.sprite = sprite;

    var scl = 4;


    var tryH = this.width/(this.sprite.width*scl);
    var tryV = this.height/(this.sprite.height*scl);

    this.hTileNum = clamp(Math.floor(tryH), 2, 16);
    this.vTileNum = clamp(Math.floor(tryV), 2, 16);

    this.tileWid = this.width/this.hTileNum;
    this.tileHei = this.height/this.vTileNum;

    this.xScl = this.tileWid/this.sprite.width;
    this.yScl = this.tileHei/this.sprite.height;

    this.emptyMiddle = true;
  }

  tileNumHelp = function (tile, tileMax, imgMin) {
    if (tile == 0) {
      return imgMin;
    } else if (tile == tileMax - 1) {
      return imgMin + 2;
    }

    return imgMin + 1;
  }


  tileNumHelpFull = function (tileX, tileY, tileXMax, tileYMax) {
    var img = 0;
    var rotation = 0;
    if (tileYMax == 1 && tileXMax == 1) {
      img = 12;
    } else if (tileXMax == 1) {
      rotation = Math.PI / 2;
      img = this.tileNumHelp(tileY, tileYMax, 9);
    } else if (tileYMax == 1) {
      img = this.tileNumHelp(tileX, tileXMax, 9);
    } else {
      if (tileY == 0) {
        img = this.tileNumHelp(tileX, tileXMax, 0);
      } else if (tileY == tileYMax - 1) {
        img = this.tileNumHelp(tileX, tileXMax, 6);
      } else {
        img = this.tileNumHelp(tileX, tileXMax, 3);
      }
    }

    return new Vector(img, rotation);
  }
  draw(ctx){

    for (var i = 0; i < this.vTileNum; i++) {

      for (var j = 0; j < this.hTileNum; j++) {
        // if(this.emptyMiddle){
        //   if(j > 0 && j < this.hTileNum -1 && i != 0 && i != this.vTileNum-1) continue;
        // }

        var xx = this.x + j * this.tileWid;
        var yy = this.y + i * this.tileHei;

        var img = 0;
        var rotation = 0;

        var imgRot = this.tileNumHelpFull(j, i, this.hTileNum, this.vTileNum);

        rotation = imgRot.y;
        img = imgRot.x;

        if(img == 4 && this.emptyMiddle) continue;


        this.sprite.drawExt(xx + 32 * this.xScl, yy + 32 * this.yScl, img, this.xScl, this.yScl, rotation, 32, 32);
      }
    }
  }
}
