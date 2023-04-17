
// Canvas Initialization
var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');

canvas.width = 1900;
canvas.height = 1000;
var width = canvas.width;
var height = canvas.height;

// Anti-alising deactivator
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;






// Mouse Initialization
mouseX = 0;
mouseY = 0;

//  MouseState = [Left, right, left first, right first]
mouseState = [false, false, false, false];



// Event Handlers
canvas.addEventListener("mousemove", function (event){
  mouseX = event.offsetX;
  mouseY = event.offsetY;
});

canvas.addEventListener("mousedown", function (event){
  // Detect first press
  if(mouseState[event.button]){
    mouseState[event.button+2] = false;
  } else {
    mouseState[event.button+2] = true;
  }

  mouseState[event.button] = true;
});

canvas.addEventListener("mouseup", function (event){
  mouseState[event.button] = false;
});



// Object Handlers
// Enumerator for Objects
function Enum(){
    for( let i = 0; i < arguments.length; ++i ){
        this[arguments[i]] = i;
    }
    return this;
}

const OBJECT = Object.freeze(new Enum(
  "GAMEOBJECT",
  "DRAW",
  "BLOCK",
  "BALL",
  "DUST",
  "WAVE",
  "TOTAL"
));


objectLists = [];

for(var i = 0; i < OBJECT.TOTAL; i++){
  var arr = [];
  objectLists.push(arr);
}

// Object List Handler Functions
function updateList(type){
  var _len = objectLists[type].length;
  for(var i = 0; i < _len; i++){
    if(objectLists[type][i].active){
      objectLists[type][i].update();
    } else {
      objectLists[type].splice(i, 1);
      i--;
      _len--;
    }
  }
}

function drawList(type){
  var _len = objectLists[type].length;
  for(var i = 0; i < _len; i++){
    if(objectLists[type][i].active){
      objectLists[type][i].show();
    } else {
      objectLists[type].splice(i, 1);
      i--;
      _len--;
    }
  }
}

function addList(obj, type){
  objectLists[type].push(obj);
}

function sortDepth(){
  objectLists[OBJECT.DRAW].sort(function(a, b){
    return b.depth-a.depth;
  });
}

function cleanList(type){
  var _len = objectLists[type].length;
  for(var i = 0; i < _len; i++){
    if(!objectLists[type][i].active){
      objectLists[type].splice(i, 1);
      i--;
      _len--;
    }
  }
}

function cleanAllLists(){
  var _total = OBJECT.TOTAL;
  for(var j = 2; j < _total; j++){
    cleanList(j);
  }
}








function Vector(x, y){
  this.x = x;
  this.y = y;

  this.add = function(vec){
    return new Vector(this.x+vec.x, this.y+vec.y);
  }

  this.sub = function(vec){
    return new Vector(this.x-vec.x, this.y-vec.y);
  }

  this.mult = function(val){
    return new Vector(this.x*val, this.y*val);
  }

  this.div = function(val){
    return new Vector(this.x/val, this.y/val);
  }

  this.mag = function(){
    return Math.sqrt((this.x*this.x) + (this.y*this.y));
  }

  this.unit = function(){
    var _mag = this.mag();
    if(_mag != 0){
      return new Vector(this.x/_mag, this.y/_mag);
    }
    return new Vector(0, 0);
  }

  this.dot = function(vec){
    return this.x*vec.x + this.y*vec.y;
  }

  this.normal = function(){
    return new Vector(-this.y, this.x);
  }

  this.cross = function(v){
    return this.x*v.y - this.y*v.x;
  }
}
























// Block Collisions
function aabbCollision(a, b){
  if(b.x2 - a.x1 > a.width + b.width || a.x2 - b.x1 > a.width + b.width){
    return false;
  } else if(b.y2 - a.y1 > a.height + b.height || a.y2 - b.y1 > a.height + b.height){
    return false;
  }
  return true;
}

function blockCollision(a, b){
  if(aabbCollision(a, b)){
    var dx = a.x1 - b.x2;
    var dx2 = a.x2 - b.x1;
    var dy = a.y1 - b.y2;
    var dy2 = a.y2 - b.y1;

    if(Math.abs(dx2) < Math.abs(dx)){
      dx = dx2;
    }

    if(Math.abs(dy2) < Math.abs(dy)){
      dy = dy2;
    }

    var rest = a.weight/(a.weight + b.weight);
    if(Math.abs(dx) < Math.abs(dy)){
      dx /= 2;
      a.x -= (1-rest)*dx;
      b.x += rest*dx;

      a.hspd = (a.hspd + b.hspd)*(1-rest);
      b.hspd = (a.hspd + b.hspd)*(rest);
    } else {
      dy /= 2;
      a.y -= (1-rest)*dy;
      b.y += rest*dy;

      a.vspd = (a.vspd + b.vspd)*(1-rest);
      b.vspd = (a.vspd + b.vspd)*(rest);
    }
  }
}

function collisions(){
  var _len = objectLists[OBJECT.BLOCK].length;

  for(var i = 0; i < _len; i++){
    objectLists[OBJECT.BLOCK][i].updatePos();
  }

  for(var i = 0; i < _len; i++){
    var blockA = objectLists[OBJECT.BLOCK][i];
    for(var j = i+1; j < _len; j++){
      var blockB = objectLists[OBJECT.BLOCK][j];
      blockCollision(blockA, blockB);
    }
  }
}




// Helper Functions

function clamp(val, min, max){
  if(val < min) return min;
  else if (val > max) return max;
  return val;
}

function sign(val){
  if(val > 0) return 1;
  else if (val < 0) return -1;
  return 0;
}

function randInt(min, max){
  return Math.floor(Math.random()*(max-min))+min;
}

function distance(dx, dy){
  return Math.sqrt((dx*dx) + (dy*dy));
}

function sqrDist(dx, dy){
  return (dx*dx) + (dy*dy);
}

function pointInRect(x, y, x1, y1, x2, y2){
  if(x > x1 && x < x2 && y > y1 && y < y2){
    return true;
  }
  return false;
}

function rectCollision(x1, y1, wid1, hei1, x2, y2, wid2, hei2){
    if(!(x2 + wid2 - x1 > 0 && x1 + wid1 - x2 > 0)){
        return 0;
    }

    if(!(y2 + hei2 - y1 > 0 && y1 + hei1 - y2 > 0)){
        return 0;
    }

    return 1;
}