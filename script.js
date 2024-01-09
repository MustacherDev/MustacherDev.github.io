



var state = initState;



function step() {
  scaleCanvasContent();

  state();


  // Input Handling
  // Reseting released and pressed states of mouse
  for(var i = 0; i < 3; i++){
    mouseState[i][1] = false;
    mouseState[i][2] = false;
  }

  input.update();

  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
