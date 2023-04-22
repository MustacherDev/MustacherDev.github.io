// Sprite OBJECT
function Sprite(img, wid, hei, imgWid, imgHei) {
    this.img = img;

    this.imgWid = imgWid;
    this.imgHei = imgHei;

    this.width = wid;
    this.height = hei;

    this.imgNumX = Math.floor(this.imgWid / this.width);
    this.imgNumY = Math.floor(this.imgHei / this.height);

    this.imgNum = this.imgNumX * this.imgNumY;

    this.xoffset = 0;
    this.yoffset = 0;

    /// Draw sprite
    this.drawSimple = function (x, y, img, scl) {
        var imgx = img % this.imgNumX;
        var imgy = Math.floor(img / this.imgNumX) % this.imgNumY;
        ctx.drawImage(this.img, imgx * this.width, imgy * this.height, this.width, this.height, x - this.xoffset, y - this.yoffset, this.width * scl, this.height * scl);
    }

    /// Draw sprite with separe scaling and centralizing option
    this.draw = function (x, y, img, xscl, yscl, centerTransform) {
        // Image X and Y based on img number
        var imgx = (img % this.imgNumX);
        var imgy = (Math.floor(img / this.imgNumX) % this.imgNumY);


        // Centralizing Transformations
        let centerTrnsf = centerTransform || false;

        let offx = this.xoffset;
        let offy = this.yoffset;
        if (centerTrnsf) {
            offx = this.width / 2;
            offy = this.height / 2;
        }

        // Actual Transformations
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(xscl, yscl);

        ctx.drawImage(this.img, imgx * this.width, imgy * this.height, this.width, this.height, -offx, -offy, this.width, this.height);

        ctx.restore();
    }

    /// Draw sprite with rotation
    this.drawRot = function (x, y, img, xscl, yscl, ang, centerTransform) {

        var imgx = img % this.imgNumX;
        var imgy = Math.floor(img / this.imgNumX) % this.imgNumY;

        // Centralizing Transformations
        let centerTrnsf = centerTransform || false;

        let offx = this.xoffset;
        let offy = this.yoffset;
        if (centerTrnsf) {
            offx = this.width / 2;
            offy = this.height / 2;
        }

        // Actual Transformations
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(xscl, yscl);
        ctx.rotate(ang);

        ctx.drawImage(this.img, imgx * this.width, imgy * this.height, this.width, this.height, -offx, -offy, this.width, this.height);

        ctx.restore();
    }

    /// Draw sprite with rotation and offset
    this.drawFix = function (x, y, img, xscl, yscl, ang, transfX, transfY, offSetX, offSetY) {

        var imgx = img % this.imgNumX;
        var imgy = Math.floor(img / this.imgNumX) % this.imgNumY;

        // Centralizing Transformations

        let transX = transfX;
        let transY = transfY;

        let offx = (-offSetX + transX) * Math.abs(xscl);
        let offy = (-offSetY + transY) * Math.abs(yscl);

        // Actual Transformations
        ctx.save();
        ctx.translate(x + offx, y + offy);
        ctx.scale(xscl, yscl);

        if (ang != 0) {
            ctx.rotate(ang);
        }

        ctx.drawImage(this.img, imgx * this.width, imgy * this.height, this.width, this.height, -transX, -transY, this.width, this.height);

        ctx.restore();
    }
}
