



function createCloud(outScreen) {
    var _cloud = new Cloud(Math.random() * width + outScreen * width, Math.random() * height);
    _cloud.depth = -2 + Math.random() * 4;
    _cloud.hspd = (-2 - Math.random() * 0.5 + _cloud.depth * 0.5) * 3;
    _cloud.xScl = 5 + Math.random() * 0.25 - _cloud.depth;
    addList(_cloud, OBJECT.DRAW)
    addList(_cloud, OBJECT.GAMEOBJECT);
}
for (var i = 0; i < 20; i++) {
    createCloud(0);
}


function createBeanstalk(xx, yy) {
    var _inst = new BeanStalkPlant(xx, yy, spr_HittedBlock, 0);
    _inst.depth = -0.77 + (-0.5 + Math.random() * 1);
    _inst.hspd = -7;
    addList(_inst, OBJECT.DRAW)
    addList(_inst, OBJECT.GAMEOBJECT);
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




var addY = 0;
var frame = 0;
var tick = 0;
var tickHold = 20;

boat.x = width / 2 - 150;

function step() {
    // Background
    ctx.fillStyle = "rgb(150,180,250)";
    ctx.fillRect(0, 0, width, height);

    frame += 0.05;

    console.log(BeanStalkPlant.xScl);

    addY = Math.sin(frame) * 40;
    // boat.vspd += 0.2;
    // boat.x += boat.hspd;
    // boat.y += boat.vspd;
    //boat.hspd *= 0.9999;

    boat.y = height / 2 + addY - 50;

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
            var beanY = (height / 1.5) + (Math.random() * height/2);
            for (var i = 0; i < beanNum; i++) {
                createBeanstalk(beanX, beanY);

                if (Math.random() < 0.3) {
                    beanY += BeanStalkPlant.xScl*16;
                }

                beanX += BeanStalkPlant.xScl*16 * Math.ceil(Math.random()*4);
            }
        }
    }


    // if(boat.y > height/2){
    // 	boat.y = height/2;
    // 	boat.vspd *= -1;
    // }


    updateList(OBJECT.GAMEOBJECT);

    sortDepth();

    drawList(OBJECT.DRAW);

    //boat.show();



    // Black Border
    //ctx.strokeStyle = "rgb(0,0,0)";
    // ctx.strokeRect(0, 0, width, height);

    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
