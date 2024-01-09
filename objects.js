

function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.checkCollision = function (otherBoundingBox) {
        if (this.x < otherBoundingBox.x + otherBoundingBox.width &&
            this.x + this.width > otherBoundingBox.x &&
            this.y < otherBoundingBox.y + otherBoundingBox.height &&
            this.y + this.height > otherBoundingBox.y) {
            return true; // Collision detected
        }
        return false; // No collision
    };

    this.show = function () {
        // Draw the rectangle border
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };
}
// Block Collisions
function aabbCollision(a, b) {
    if (b.x2 - a.x1 > a.width + b.width || a.x2 - b.x1 > a.width + b.width) {
        return false;
    } else if (b.y2 - a.y1 > a.height + b.height || a.y2 - b.y1 > a.height + b.height) {
        return false;
    }
    return true;
}

function blockCollision(a, b) {
    if (aabbCollision(a, b)) {
        var dx = a.x1 - b.x2;
        var dx2 = a.x2 - b.x1;
        var dy = a.y1 - b.y2;
        var dy2 = a.y2 - b.y1;

        if (Math.abs(dx2) < Math.abs(dx)) {
            dx = dx2;
        }

        if (Math.abs(dy2) < Math.abs(dy)) {
            dy = dy2;
        }

        var rest = a.weight / (a.weight + b.weight);
        if (Math.abs(dx) < Math.abs(dy)) {
            dx /= 2;
            a.x -= (1 - rest) * dx;
            b.x += rest * dx;

            a.hspd = (a.hspd + b.hspd) * (1 - rest);
            b.hspd = (a.hspd + b.hspd) * (rest);
        } else {
            dy /= 2;
            a.y -= (1 - rest) * dy;
            b.y += rest * dy;

            a.vspd = (a.vspd + b.vspd) * (1 - rest);
            b.vspd = (a.vspd + b.vspd) * (rest);
        }
    }
}

function collisions() {
    var _len = objectLists[OBJECT.BLOCK].length;

    for (var i = 0; i < _len; i++) {
        objectLists[OBJECT.BLOCK][i].updatePos();
    }

    for (var i = 0; i < _len; i++) {
        var blockA = objectLists[OBJECT.BLOCK][i];
        for (var j = i + 1; j < _len; j++) {
            var blockB = objectLists[OBJECT.BLOCK][j];
            blockCollision(blockA, blockB);
        }
    }
}


// Base Object
function GameObject(x, y, sprite) {
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

    this.active = true;
}

GameObject.prototype.show = function () {
    this.sprite.drawSimple(this.x, this.y, 0, this.xScl);
};

GameObject.prototype.update = function () {
    this.x += this.hspd;
    this.y += this.vspd;
    this.ang += this.angSpd;
};




function TextObject(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.active = true;
    this.timer = 40;

    this.update = function () {
        this.y -= 1;
        this.timer--;

        if (this.timer == 0) {
            this.active = false;
        }
    }

    this.show = function () {
        ctx.font = "20px Fixedsys";

        let hue = Math.random() * 360;
        ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
        ctx.fillText(this.text, this.x + 2, this.y + 2);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText(this.text, this.x, this.y);
    }
}



function Block(x, y, wid, hei) {
    GameObject.call(this, x, y, sprites[SPR.BALEAB]);

    this.width = wid;
    this.height = hei;
    this.centerX = 0;
    this.centerY = 0;

    this.x1 = this.x - this.centerX;
    this.x2 = this.x - this.centerX + this.width;
    this.y1 = this.y - this.centerY;
    this.y2 = this.y - this.centerY + this.height;

    this.weight = 1;


    //   pos =  x1, y1, x2, y2
    //this.pos = [0, 0, wid, hei];

    this.show = function () {
        this.strokeBounds();
    }

    this.strokeBounds = function () {
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.strokeRect(this.x - this.centerX, this.y - this.centerY, this.width, this.height);
    }

    this.updatePos = function () {
        // Updates Bounding Points
        this.x1 = this.x - this.centerX;
        this.x2 = this.x - this.centerX + this.width;
        this.y1 = this.y - this.centerY;
        this.y2 = this.y - this.centerY + this.height;
    }

    this.update = function () {
        this.x += this.hspd;
        this.y += this.vspd;

        this.vspd += 0.1;

        this.hspd = clamp(this.hspd, -40, 40);
        this.vspd = clamp(this.vspd, -40, 40);

        if (this.x + this.width > width) {
            this.x = width - this.width;
            this.hspd *= -0.9;

        } else if (this.x < 0) {
            this.x = 0;
            this.hspd *= -0.9;
        }

        if (this.y + this.height > height) {
            this.y = height - this.height;
            this.vspd *= -0.9;
        } else if (this.y < 0) {
            this.y = 0;
            this.vspd *= -0.9;
        }

    }
}






function BallCollider(x, y, r, m) {
    this.pos = new Vector(x, y);
    this.r = r;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);

    this.m = m;
    if (this.m === 0) {
        this.inv_m = 0;
    } else {
        this.inv_m = 1 / this.m;
    }

    this.dampening = 0.9;
    this.elasticity = 1;
    this.acceleration = 1;
    this.player = false;

    this.updatePos = function () {
        this.vel = this.vel.add(this.acc).mult(this.dampening);
        this.pos = this.pos.add(this.vel);
    }

    this.show = function () {
        if (this.player) {
            ctx.fillStyle = "rgb(200, 40, 0)";
        } else {
            if (this.inv_m == 0) {
                ctx.fillStyle = "rgb(70, 60, 100)";
            } else {
                ctx.fillStyle = "rgb(100, 150, 0)";
            }
        }
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgb(220, 220, 220)";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.r, this.pos.y);
        ctx.stroke();
    }
}




function WallCollider(x1, y1, x2, y2) {
    this.pos1 = new Vector(x1, y1);
    this.pos2 = new Vector(x2, y2);

    this.normal = this.pos2.sub(this.pos1).unit();
    this.len = this.pos2.sub(this.pos1).mag();
    this.r = 0;

    this.elasticity = 1;

    this.show = function () {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgb(200, 200, 200)";
        ctx.beginPath();
        ctx.moveTo(this.pos1.x, this.pos1.y);
        ctx.lineTo(this.pos2.x, this.pos2.y);
        ctx.stroke();
    }
}
























function Ball(x, y, radius) {
    Block.call(this, x, y, radius * 2, radius * 2);
    GameObject.call(this, x, y, sprites[SPR.BOAT]);





    this.r = radius;

    this.boundingBox = new BoundingBox(this.x, this.y, this.r*1.5, this.r*1.5);


    this.holded = false;

    this.collector = null;
    this.attached = false;
    this.attachCooldown = 0;

    this.angDamp = 0.99;
    this.linDamp = 0.999;

    this.vLoss = 0.8;
    this.hLoss = 0.9;

    this.gravity = 0.1;
    this.floorY = height + 500;

    this.tick = 0;

    this.show = function () {
        //this.strokeBounds();
        this.sprite.drawRot(this.x, this.y, 0, this.xScl, this.xScl, this.ang, true);

        //this.boundingBox.show();
    }

    this.update = function () {

        // Gravity
        this.vspd += this.gravity;

        this.hspd *= this.linDamp;
        this.vspd *= this.linDamp;

        this.hspd = clamp(this.hspd, -40, 40);
        this.vspd = clamp(this.vspd, -40, 40);
        this.angSpd = clamp(this.angSpd, -0.5, 0.5);

        this.angSpd *= this.angDamp;


        this.x += this.hspd;
        this.y += this.vspd;
        this.ang += this.angSpd;

        this.boundingBox.x = this.x  - (this.boundingBox.width / 2);
        this.boundingBox.y = this.y  - (this.boundingBox.height/ 2);


        // Wall Collisions
        if (!this.holded) {
            this.tick++;
            if (this.tick > 20) {
                this.tick = 0;
                var dist = sqrDist(this.hspd, this.vspd);
                if (dist > 500) {


                    _dust = new Dust(this.x, this.y);
                    var xx = this.x + this.sprite.width * this.xScl * 0.5 - _dust.sprite.width * _dust.xScl;
                    var yy = this.y + this.sprite.height * this.yScl * 0.5 - _dust.sprite.height * _dust.yScl;
                    _dust.x = xx;
                    _dust.y = yy;

                    addList(_dust, OBJECT.GAMEOBJECT);
                    addList(_dust, OBJECT.DRAW);
                    addList(_dust, OBJECT.DUST);
                    this.tick = Math.floor(dist / 60);
                }
            }


            if (this.x + this.r > width) {
                this.x = width - this.r;
                this.angSpd += this.vspd / 40;
                this.hspd *= -this.hLoss;

            } else if (this.x - this.r < 0) {
                this.x = this.r;

                this.angSpd += this.vspd / 40;

                this.hspd *= -this.hLoss;
            }


            if (this.y + this.r > height + 200) {
                this.vspd = -15;
                this.angSpd = -0.25 + Math.random()*0.5;
            }

            if (this.y + this.r > this.floorY) {
                this.y = this.floorY - this.r;
                if (Math.abs(this.vspd) > this.gravity * 3) {
                    this.angSpd += this.hspd / 40;
                }
                this.vspd *= -this.vLoss;
                this.hspd *= this.linDamp;
            }

            /*
            if(this.y-this.r < 0){
              this.y = this.r;
              this.angSpd += this.hspd/40;
              this.vspd *= -0.9;
            }
            */


            if (this.collector != null && this.attached == false) {

                this.attachCooldown--;

                if (this.attachCooldown < 0) {

                    //  ctx.strokeStyle = "rgb(0, 0, 0)";
                    //ctx.strokeRect(this.x, this.y, this.r*this.xScl, this.r*this.yScl);

                    var xSqueeze = 5 * this.collector.xScl;
                    var colX = this.collector.x + xSqueeze;
                    var colY = this.collector.y + 8 * this.collector.yScl;
                    var colWid = -2 * xSqueeze + this.collector.sprite.width * this.collector.xScl;
                    var colHei = this.collector.sprite.height * this.collector.yScl / 4;


                    //  ctx.strokeRect(colX, colY, colWid, colHei);

                    if (rectCollision(this.x, this.y, this.r * this.xScl, this.r * this.yScl, colX, colY, colWid, colHei)) {
                        this.collector.ammo = this;
                        this.attached = true;
                        this.attachCooldown = 50;
                    }
                }
            }



        }


    }



}

function Wave(x, y) {
    GameObject.call(this, x, y, sprites[SPR.WAVE]);

    this.life = 300;

    this.update = function () {
        if (this.life > 0) {
            this.life--;
            this.x += this.hspd;
            this.y += this.vspd;

            this.hspd = clamp(this.hspd, -40, 40);
            this.vspd = clamp(this.vspd, -40, 40);
            this.angSpd = clamp(this.angSpd, -2, 2);
        } else {
            this.active = false;
        }
    }
}


function Cloud(x, y) {
    GameObject.call(this, x, y, sprites[SPR.CLOUD]);
    this.xScl = 5;
}

Cloud.prototype = Object.create(GameObject.prototype);

function BigCloud(x, y) {
    GameObject.call(this, x, y, sprites[SPR.BIGCLOUD]);
}

BigCloud.prototype = Object.create(GameObject.prototype);


function Baleadeira(x, y) {
    GameObject.call(this, x, y, sprites[SPR.BALEA]);

    this.xScl = 10;
    this.yScl = this.xScl;

    this.ammo = null;
    this.holding = false;

    this.followMouse = false;

    //  this.body = [randInt(0, 4), randInt(0, 4), randInt(0, 4), randInt(0, 4), randInt(0, 4), randInt(0, 4)];
    this.body = [0, 1, 3, 2, 0, 1];

    this.show = function () {

        if (this.ammo != null) {

            ctx.lineWidth = 10;
            ctx.strokeStyle = "rgb(200, 200, 200)";

            if (this.holding) {
                ctx.fillStyle = "rgb(200, 200, 200)";
                if (mouseState[0][0]) {
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

        this.sprite.drawRot(this.x, this.y, 0, this.xScl, this.yScl, this.ang, false);
        for (var i = 0; i < 5; i++) {
            sprites[SPR.BALEAB].drawRot(this.x, this.y + ((32 + (16 * i)) * this.yScl), this.body[i], this.xScl, this.yScl, this.ang, false);
        }

    }

    this.update = function () {

        var xxx = this.x + (8 * this.xScl);
        var yyy = this.y + (3 * this.yScl);

        if (!this.holding && this.followMouse) {
            this.x += (mouseX - xxx) / 8;
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

                this.ammo.hspd *= 0.99;
                this.ammo.vspd *= 0.99;
                this.ammo.hspd += (dx / dist) * stretch / 1000;
                this.ammo.vspd += (dy / dist) * stretch / 1000;
            }

            if (mouseState[0][0]) {
                if (this.holding) {
                    this.ammo.x = mouseX;
                    this.ammo.y = mouseY;
                } else {
                    if (pointInRect(mouseX, mouseY, xx - rr, yy - rr, xx + rr, yy + rr)) {
                        this.holding = true;
                    }
                }
            } else {
                if (this.holding) {

                    var dx = xxx - this.ammo.x;
                    var dy = yyy - this.ammo.y;

                    this.ammo.hspd = dx / 30;
                    this.ammo.vspd = dy / 30;

                    this.holding = false;
                    this.ammo.attached = false;
                    this.ammo = null;
                }
            }
        }
    }

}

function FiuFiu(x, y, spr, img) {
    GameObject.call(this, x, y, spr);
    this.xScl = 8;

    this.floorY = height / 1.5;
    this.yScl = this.xScl;

    this.hspd = 0;
    this.vspd = -12;

    this.touchedOnce = false;
    this.fallingAgain = false;

    this.danceWait = 20;

    this.danceMax = 60;
    this.danceFrames = this.danceMax;

    this.centerX = 8;
    this.centerY = 8;
    this.offsetX = 0;
    this.offsetY = 0;

    this.img = img;


    this.facing = 1;

    this.setCenterToMiddle = function () {
        this.centerX = this.sprite.width / 2;
        this.centerY = this.sprite.height / 2;
    }

    this.show = function () {
        this.sprite.drawFix(this.x, this.y, this.img, this.xScl * this.facing, this.yScl, 0, this.centerX, this.centerY, this.offsetX, this.offsetY);
    }

    this.init = function () {
        this.hspd = 0;
        this.vspd = -12;

        this.touchedOnce = false;
        this.fallingAgain = false;

        this.danceWait = 20;

        this.danceFrames = this.danceMax;

        this.facing = 1;
        this.img = (this.img + 4) % 27;

    }


    this.update = function () {



        this.x += this.hspd;
        this.y += this.vspd;


        if (this.fallingAgain) {
            this.vspd += 0.2;
            if (this.y > height + 16 * this.yScl) {
                this.y = height;
                this.init();
            }

        } else {
            if (this.touchedOnce) {
                if (this.danceWait > 0) {
                    this.danceWait--;
                } else {
                    this.danceFrames--;
                    this.facing = (this.danceFrames < this.danceMax / 2) ? 1 : -1;
                    if (this.danceFrames < 0) {
                        this.vspd -= 5;
                        this.fallingAgain = true;
                    }
                }
            } else {
                this.vspd += 0.2;
                if (this.y > this.floorY && this.vspd > 0) {
                    this.touchedOnce = true;
                    this.y = this.floorY;
                    this.vspd = 0;
                }
            }

        }

    }
}
FiuFiu.prototype = Object.create(GameObject.prototype);

function Dust(x, y) {
    GameObject.call(this, x, y, sprites[SPR.DUST]);
    this.life = randInt(100, 400);

    this.xScl = randInt(4, 10);
    this.yScl = this.xScl;

    this.hspd = randInt(-1, 2);
    this.vspd = randInt(-1, 2);

    this.update = function () {
        if (this.life > 0) {
            this.life--;
        } else {
            this.active = false;
        }

        this.x += this.hspd;
        this.y += this.vspd;


    }
}

Dust.prototype = Object.create(GameObject.prototype);





function BeanStalkPlant(x, y, spr, img) {
    GameObject.call(this, x, y, spr);
    this.xScl = 5;
    this.yScl = this.xScl;

    this.hspd = -4;
    this.gravity = 0;
    this.vspd = 0;


    this.frames = 0;
    this.vineSpeed = 1 / 40;

    this.vineY = 0;

    this.img = img;

    this.spriteHead = sprites[SPR.BEANSTALK];
    this.spriteVine = sprites[SPR.VINE];

    this.boundingBox = new BoundingBox(this.x, this.y, this.xScl*12, this.yScl*12);



    this.hasDust = true;

    this.show = function () {


        // Beanstalk Head animation
        this.img += 0.1;

        if (this.img >= 2) {
            this.img = 0;
        }


        // Vine rise animation


        var vineNum = Math.floor(this.vineY);
        var vineOffset = ((this.vineY) - vineNum) * 16 * this.yScl;

        var lastY = this.y - vineOffset - (vineNum - 1) * 16 * this.yScl;


        for (var i = 0; i < vineNum; i++) {
            lastY = this.y - vineOffset - i * 16 * this.yScl;
            this.spriteVine.draw(this.x, lastY, 0, this.xScl, this.yScl);
        }


        this.spriteHead.draw(this.x, lastY - 16 * this.yScl, Math.floor(this.img), this.xScl, this.yScl);

        // Block
        this.sprite.draw(this.x, this.y, 0, this.xScl, this.yScl);

        //this.boundingBox.show();


    }

    this.init = function () {
        this.hspd = -4;
        this.vspd = 0;

        this.facing = 1;
        this.img = 0;

    }


    this.update = function () {

        this.x += this.hspd;
        this.y += this.vspd;

        this.vineY += this.vineSpeed;

        var vineY = this.vineY*this.yScl*16;
        this.boundingBox.x = this.x + this.xScl * 8 - (this.boundingBox.width/2);
        this.boundingBox.y = this.y + this.yScl * 8 - (this.boundingBox.height/2) - vineY;


        this.frames++;

        if (this.x < -16 * this.xScl) {
            this.active = false;
        }
    }
}
BeanStalkPlant.prototype = Object.create(GameObject.prototype);

BeanStalkPlant.xScl = 5;
BeanStalkPlant.yScl = BeanStalkPlant.xScl;
