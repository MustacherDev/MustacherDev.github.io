// Canvas Initialization
var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');
canvas.width = 2090;
canvas.height = 1000;

canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";

var width = canvas.width ;
var height = canvas.height ;

// Anti-alising deactivator
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
