class BoundingBox {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  
      this.xOffset = 0;
      this.yOffset = 0;
    }

    contains(x, y){
        return this.isPointInside(x, y);
    }

    intersects(otherBounding){
        return this.checkCollision(otherBounding);
    }

  
    checkCollision(otherBB) {
      if (this.x - this.xOffset < otherBB.x - otherBB.xOffset + otherBB.width &&
        this.x - this.xOffset + this.width > otherBB.x - otherBB.xOffset &&
        this.y - this.yOffset < otherBB.y - otherBB.yOffset + otherBB.height &&
        this.y - this.yOffset + this.height > otherBB.y - otherBB.yOffset) {
        return true;
      }
      return false;
    }
  
    isPointInside(x, y) {
      return pointInRect(x, y, this.x - this.xOffset, this.y - this.yOffset, this.x - this.xOffset + this.width, this.y - this.yOffset + this.height);
    }
  
    updatePos(x, y) {
      this.x = x;
      this.y = y;
    }
  
    setOffset(xOff, yOff) {
      this.xOffset = xOff;
      this.yOffset = yOff;
    }
  
    setOffsetRelative(xOffRelative, yOffRelative) {
      this.xOffset = this.width*xOffRelative;
      this.yOffset = this.height*yOffRelative;
    }
  
    show() {
      // Draw the rectangle border
      ctx.strokeStyle = "rgb(255, 0, 0)";
      ctx.strokeRect(this.x - this.xOffset, this.y - this.yOffset, this.width, this.height);
    }
  }
  
  
  class BoundingArea {
    constructor() {
      this.areas = [];
    }
    checkCollision(otherBoundingBox) {
  
      if (otherBoundingBox instanceof BoundingArea) {
        for (var i = 0; i < otherBoundingBox.areas.length; i++) {
          var area = otherBoundingBox.areas[i];
          if (this.checkCollisionBoundingBox(area)) {
            return true;
          }
        }
      } else {
        if (this.checkCollisionBoundingBox(otherBoundingBox)) {
          return true;
        }
      }
      return false; // No collision
    }
  
    checkCollisionBoundingBox(otherBB) {
      for (var i = 0; i < this.areas.length; i++) {
        var area = this.areas[i];
  
        if (area.checkCollision(otherBB)) {
          return true;
        }
      }
      return false;
    }
  
    isPointInside(x, y) {
      for (var i = 0; i < this.areas.length; i++) {
        var area = this.areas[i];
        if (area.isPointInside(x, y)) {
          return true;
        }
      }
      return false;
    }
  
  }
  