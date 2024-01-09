// Mouse Initialization
mouseX = 0;
mouseY = 0;
mouseXScreen = 0;
mouseYScreen = 0;

//  MouseState = [Left, middle, right, left first, middle first, right first]
mouseState = [];
for(var i = 0; i < 3; i++){
  mouseState.push([false, false, false]);
}






// Event Handlers
canvas.addEventListener("mousemove", function(event){
	var scl = getCanvasTransformScale();
	var rect = canvas.getBoundingClientRect();
	var scaleX = canvas.width / rect.width*scl.x;
	var scaleY = canvas.height / rect.height*scl.y;

	mouseXScreen = event.offsetX;
	mouseYScreen = event.offsetY;


	mouseX = (event.offsetX*scaleX);
	mouseY = (event.offsetY*scaleY);
});



canvas.addEventListener("mousedown", function (event) {
    mouseState[event.button][0] = true;
    mouseState[event.button][1] = true;
});

canvas.addEventListener("mouseup", function (event) {
    mouseState[event.button][0] = false;
    mouseState[event.button][2] = true;
});



function Input() {
    this.keyState = [];

    this.init = function () {
        for (var i = 0; i < 256; i++) {
            var vals = [];
            for (var j = 0; j < 3; j++) {
                vals.push(false);
            }
            this.keyState.push(vals);
        }
    }

    this.update = function () {
        for (var i = 0; i < 256; i++) {
            this.keyState[i][1] = false;
            this.keyState[i][2] = false;
        }
    }

}
document.addEventListener('keydown', function (event) {
    const keyCode = event.keyCode || event.which;
    if (!input.keyState[keyCode][0]) {
        input.keyState[keyCode][0] = true; // Set active state
        input.keyState[keyCode][1] = true; // Set pressed state
    }

    //input.keyState[event.keyCode][0] = true;
});

document.addEventListener('keyup', function (event) {
    const keyCode = event.keyCode || event.which;
    input.keyState[keyCode][0] = false; // Set inactive state
    input.keyState[keyCode][2] = true; // Set released state

    //input.keyState[event.keyCode][0] = false;
});


var input = new Input();
input.init();
