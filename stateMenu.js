


function createCloud(outScreen) {
    var _cloud = new Cloud(Math.random() * width + outScreen * width, Math.random() * height);
    _cloud.depth = -2 + Math.random() * 4;
    _cloud.hspd = (-2 - Math.random() * 0.5 + _cloud.depth * 0.5) * 3;
    _cloud.xScl = 5 + Math.random() * 0.25 - _cloud.depth;
    addList(_cloud, OBJECT.DRAW);
    addList(_cloud, OBJECT.CLOUD);
    addList(_cloud, OBJECT.GAMEOBJECT);
}


function createBeanstalk(xx, yy) {
    var _inst = new BeanStalkPlant(xx, yy, sprites[SPR.HITBLOCK], 0);
    _inst.depth = -0.77 + (-0.5 + Math.random() * 1);
    _inst.hspd = -7;
    addList(_inst, OBJECT.DRAW);
    addList(_inst, OBJECT.BEANSTALK);
    addList(_inst, OBJECT.GAMEOBJECT);
}


var boat;
var baleadeira;
var boatFlying = false;
var addY = 0;
var frame = 0;
var tick = 0;
var tickHold = 20;


function setupMenuState() {

    for (var i = 0; i < 20; i++) {
        createCloud(0);
    }

    // Object Declaration
    boat = new Ball(100, 100, 40);
    boat.hspd = 4;
    boat.depth = -0.77;
    boat.centerX = 2;
    boat.centerY = 2;
    boat.XScl = 2;
    boat.x = -250;
    boat.y = -100 + (height / 2);
    boat.weight = 10;
    addList(boat, OBJECT.DRAW);


    baleadeira = new Baleadeira(300, 400);
    baleadeira.ammo = boat;

    if (Math.random() < 0.1) {
        addList(baleadeira, OBJECT.GAMEOBJECT);
        addList(baleadeira, OBJECT.DRAW);
    } else {
        boat.hspd = 0;
        boat.gravity = 0;
        boatFlying = true;
    }

    boat.x = width / 2 - 150;
}


function menuState(){
  ctx.fillStyle = "rgb(150,180,250)";
  ctx.fillRect(0, 0, width, height);

    //ctx.fillStyle = "rgb(0,0,0)";
    //ctx.fillRect(0, 0, 10, height);
    //ctx.fillRect(width - 10, 0, 10, height);
    //ctx.fillRect(0, 0, width, 10);
    //ctx.fillRect(0, height-10, width, 10);




  frame += 0.05;

  if (boatFlying) {
      addY = Math.sin(frame) * 40;
      boat.y = height / 2 + addY - 50;
  }
  boat.update();

  
  tick++;
  if (tickHold < 50) {
      tickHold += 0.01;
  }
  if (tick > tickHold) {
      tick = 0;
      createCloud(1);

      if (Math.random() > 0.9) {

          var beanNum = 1;

          if (Math.random() < 0.2) {
              beanNum += Math.floor(Math.random() * 4);
          }


          var beanX = (Math.random() * width) + width + 160;
          var beanY = (height / 1.5) + (Math.random() * height / 2);
          for (var i = 0; i < beanNum; i++) {
              createBeanstalk(beanX, beanY);

              if (Math.random() < 0.3) {
                  beanY += BeanStalkPlant.xScl * 16;
              }

              beanX += BeanStalkPlant.xScl * 16 * Math.ceil(Math.random() * 4);
          }
      }
  }



  checkUpLists();
  for (var i = 0; i < objectLists[OBJECT.BEANSTALK].length; i++) {
      var beanStalkObj = objectLists[OBJECT.BEANSTALK][i];
      if (beanStalkObj.hasDust) {
          if (beanStalkObj.boundingBox.checkCollision(boat.boundingBox)) {

              beanStalkObj.hasDust = false;

              snd_Hit.play();

              boat.angSpd += -0.25 + Math.random() * 0.5;
              beanStalkObj.vineSpeed = 0;

              for (var j = 0; j < 3; j++) {
                  _dust = new Dust(boat.x, boat.y);
                  var xx = boat.x + Math.random() * boat.sprite.width + boat.sprite.width * boat.xScl * 0.5 - _dust.sprite.width * _dust.xScl;
                  var yy = boat.y + Math.random() * boat.sprite.width + boat.sprite.height * boat.yScl * 0.5 - _dust.sprite.height * _dust.yScl;
                  _dust.x = xx;
                  _dust.y = yy;

                  addList(_dust, OBJECT.GAMEOBJECT);
                  addList(_dust, OBJECT.DRAW);
                  addList(_dust, OBJECT.DUST);
              }
          }
      }
  }
  
  updateList(OBJECT.GAMEOBJECT);

  sortDepth();

  drawList(OBJECT.DRAW);

}
