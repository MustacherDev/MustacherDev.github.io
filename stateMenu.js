


function createCloud(outScreen) {
    var _cloud = new Cloud(Math.random() * roomWidth + outScreen * roomWidth, Math.random() * roomHeight);
    _cloud.depth = -2 + Math.random() * 4;
    _cloud.hspd = (-2 - Math.random() * 0.5 + _cloud.depth * 0.5) * 3;
    _cloud.xScl = 5 + Math.random() * 0.25 - _cloud.depth;
    addObject(_cloud);
}


function createBeanstalk(xx, yy) {
    var _inst = new BeanStalkPlant(xx, yy);
    _inst.depth = -0.77 + (-0.5 + Math.random() * 1);
    _inst.hspd = -3;
    addObject(_inst);
}


var boat;
var baleadeira;
var manager;


function setupMenuState() {

    manager = new GameManager();

    for(var i = 0; i < 4; i++){
        addObject(new SiteTarget(roomWidth - 300, 80 + (30 + 130)*i, i));
    }
      

    for (var i = 0; i < 20; i++) {
        createCloud(0);
    }

    // Object Declaration
    boat = new Boat(100, 100, 40);
    boat.hspd = 4;
    boat.depth = -0.77;
    boat.centerX = 2;
    boat.centerY = 2;
    boat.XScl = 2;
    boat.x = -250;
    boat.y = -100 + (roomHeight / 2);
    boat.weight = 10;
    addObject(boat);


    baleadeira = new Baleadeira(400, 300);
    baleadeira.ammo = boat;

    if (Math.random() < 1) {
        addObject(baleadeira);
    } else {
        boat.hspd = 0;
        boat.gravity = 0;
        boatFlying = true;
    }

    boat.x = roomWidth / 2 - 150;
}




function menuState(dt){

    // BLACK BACKGROUND
    ctx.fillStyle = "rgb(150,180,250)";
    ctx.fillRect(0,0,window.innerWidth, window.innerHeight);

    ctx.save();
    ctx.translate(canvasOffsetX, canvasOffsetY);
    ctx.scale(canvasSclX, canvasSclY);
    mainCam.applyTransform(ctx);

  

  
    if(input.keyState[KeyCodes.KeyZ][0]){
      mainCam.scale += 0.01*mainCam.scale;
    }
  
    if(input.keyState[KeyCodes.KeyX][0]){
      mainCam.scale -= 0.01*mainCam.scale;
    }
  
    if(input.keyState[KeyCodes.KeyA][0]){
      mainCam.x -= 20;
    }
  
    if(input.keyState[KeyCodes.KeyD][0]){
      mainCam.x += 20;
    }
  
    if(input.keyState[KeyCodes.KeyW][0]){
      mainCam.y -= 20;
    }
  
    if(input.keyState[KeyCodes.KeyS][0]){
      mainCam.y += 20;
    }
  
    if(input.keyState[KeyCodes.KeyQ][0]){
      mainCam.angle -= 0.01;
    }
  
    if(input.keyState[KeyCodes.KeyE][0]){
      mainCam.angle += 0.01;
    }



  ctx.fillStyle = "rgb(150,180,250)";
  ctx.fillRect(0, 0, roomWidth, roomHeight);


  


  manager.update(dt);

  checkUpLists();
  
  
  updateList(OBJECT.GAMEOBJECT, dt);
  pushObjectsDrawList(OBJECT.GAMEOBJECT);

  sortDepth();

  drawList(OBJECT.DRAW);
  objectLists[OBJECT.DRAW] = [];

  manager.draw(ctx);

  ctx.restore();

  manager.drawFade(ctx);

  mainCam.lateUpdate(dt);
}
