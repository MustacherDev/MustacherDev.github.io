



// Creating Dust objects

for (var i = 0; i < 0; i++) {
    var _block = new Block(randInt(0, width), randInt(0, height), randInt(20, 100), randInt(20, 100));
    addList(_block, OBJECT.BLOCK);
    addList(_block, OBJECT.DRAW)
    addList(_block, OBJECT.GAMEOBJECT);
}


// Object Declaration
boat = new Ball(-200, height - 150, 40);
boat.hspd = 10;
boat.depth = -20;
boat.centerX = 20;
boat.centerY = 20;
boat.weight = 10;

// addList(boat, OBJECT.BALL);
// addList(boat, OBJECT.BLOCK);
// addList(boat, OBJECT.DRAW);
// addList(boat, OBJECT.GAMEOBJECT);



bomb = new Ball(-200, height - 500, 40);
bomb.hspd = 3;
bomb.depth = -20;
bomb.centerX = 45;
bomb.centerY = 55;
bomb.sprite = spr_Bomb;

bomb.angSpd = 0.1;
bomb.angDamp = 0.99;
bomb.linDamp = 0.998;
bomb.vLoss = 0.6;

//addList(bomb, OBJECT.BALL);
// addList(bomb, OBJECT.BLOCK);
// addList(bomb, OBJECT.DRAW);
// addList(bomb, OBJECT.GAMEOBJECT);

splinter = new Ball(100, height - 200, 75);
splinter.hspd = 8;
splinter.depth = -20;
splinter.centerX = 302;
splinter.centerY = 302;
splinter.sprite = spr_Splinter;

splinter.xScl = 0.25;
splinter.yScl = 0.25;

splinter.angSpd = 0;
splinter.angDamp = 0;
splinter.linDamp = 0.99;
splinter.vLoss = 0;

addList(splinter, OBJECT.BALL);
addList(splinter, OBJECT.BLOCK);
addList(splinter, OBJECT.DRAW);
addList(splinter, OBJECT.GAMEOBJECT);

premierBall = new Ball(-200, height - 500, 30);
premierBall.hspd = 10;
premierBall.depth = -20;
premierBall.centerX = 66;
premierBall.centerY = 66;
premierBall.sprite = spr_PremierBall;

premierBall.xScl = 0.5;
premierBall.yScl = 0.5;

premierBall.angSpd = 1;
premierBall.angDamp = 0.96;
premierBall.linDamp = 0.994;
premierBall.vLoss = 0.5;

addList(premierBall, OBJECT.BALL);
//addList(premierBall, OBJECT.BLOCK);
addList(premierBall, OBJECT.DRAW);
//addList(premierBall, OBJECT.GAMEOBJECT);




var balHeiLim = height - (520 + 200);
baleadeira = new Baleadeira(750, height - 200);
baleadeira.ammo = null;
baleadeira.depth = -10;
//addList(baleadeira, OBJECT.DRAW);
//addList(baleadeira, OBJECT.GAMEOBJECT);

//boat.collector = baleadeira;
//bomb.collector = baleadeira;


var hasCollected = false;

var hasShot = false;
var timerShot = 0;

var hasLanded = false;


function step() {
    // Background
    ctx.fillStyle = "rgb(0,255,0)";
    ctx.fillRect(0, 0, width, height);

    if (hasCollected) {
        if (baleadeira.y > balHeiLim) {
            baleadeira.y -= 3;
            baleadeira.x += 8 * (Math.random() - 0.5);
        }
    } else {
        if (baleadeira.ammo != null) {
            hasCollected = true;
        }
    }

    if (!hasShot) {
        timerShot++;
        if (splinter.hspd < 1 && timerShot > 100) {
            hasShot = true;
            premierBall.hspd = 30;
            premierBall.vspd = -10;
            addList(premierBall, OBJECT.GAMEOBJECT);
        }
    } else {
        if (!hasLanded) {
            if (Math.abs(premierBall.hspd) < 0.3) {
                hasLanded = true;
                premierBall.sprite = spr_OpenPremierBall;
            }
        }
    }



    // Update all Gameobjects
    updateList(OBJECT.GAMEOBJECT);

    if (!hasShot) {
        premierBall.x = splinter.x + splinter.r;
        premierBall.y = splinter.y;
    }
    collisions();

    // Draw all Drawnables
    sortDepth();
    drawList(OBJECT.DRAW);

    cleanAllLists();



    // Black Border
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.strokeRect(0, 0, width, height);

    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
