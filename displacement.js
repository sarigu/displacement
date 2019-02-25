//Variables

// Maximum distance for xy displacement offset
const MAX_MOVEMENT = 10;

// Create canvases and contexts for source image,
// displacement map, and output

let outputCanvas = document.querySelector("#output");
let ctxOutput = output.getContext("2d");
let originalCanvas = document.createElement("canvas");
let ctxOriginal = originalCanvas.getContext("2d");
let mapCanvas = document.createElement("canvas");
let ctxMap = mapCanvas.getContext("2d");

// Ensure all canvases are the same size

const CANVAS_HEIGHT = outputCanvas.height;
const CANVAS_WIDTH = outputCanvas.width;

// Empty  image data

let originalData = ctxOutput.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
let mapData = ctxOutput.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
let outputData = ctxOutput.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);

//As source
let originalImg;
let mapImg;

//For calculating
let mouseYratio = 0,
  mouseXratio = 0;

let tx, ty;

let offsetX, offsetY;

let x, y;

//Functions

init(); //call function to start all

function copyPixel() {
    
      //code snippet from here: https://codepen.io/njmcode/pen/BNLKbK
  let time = 0.002 * Date.now();
  mouseXratio = Math.sin(time);
  mouseYratio = Math.cos(time * 0.5);
    
  let displacementX = mouseXratio * MAX_MOVEMENT;
  let displacementY = mouseYratio * MAX_MOVEMENT;

  for (let x = 0; y < CANVAS_HEIGHT; y++) {
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      //calculate the current pixelIndex, using the standard formula:

      let pixelIndex = 4 * (x + y * CANVAS_WIDTH);

      //Find the corresponding pixel in the map, and convert its’ color to a greyscale value between 0 and 1, using this formula:
      let greyvalue = mapData.data[pixelIndex] / 255;

      //Calculate the offsetX and offsetY coordinates of the original image, to be copied into the output, at the current x and y position:
      offsetX = Math.round(x + displacementX * greyvalue);
      offsetY = Math.round(y + displacementY * greyvalue);

      //code snippet from here: https://codepen.io/njmcode/pen/BNLKbK
      if (offsetX < 0) offsetX = 0;
      if (offsetX > CANVAS_WIDTH - 1) offsetX = CANVAS_WIDTH - 1;
      if (offsetY < 0) offsetY = 0;
      if (offsetY > CANVAS_HEIGHT - 1) offsetY = CANVAS_HEIGHT - 1;

      //Calculate the index of the pixel at this offset:

      let originalPixelIndex = (offsetY * CANVAS_WIDTH + offsetX) * 4;

      //copy the values from the original image at the originalPixelIndex to the resulting output at the pixelIndex.

      outputData.data[pixelIndex + 0] =
        originalData.data[originalPixelIndex + 0];
      outputData.data[pixelIndex + 1] =
        originalData.data[originalPixelIndex + 1];
      outputData.data[pixelIndex + 2] =
        originalData.data[originalPixelIndex + 2];
      outputData.data[pixelIndex + 3] =
        originalData.data[originalPixelIndex + 3];
    }
  }
}

//Listening for mouse movements
function registerMouse() {
  outputCanvas.addEventListener("mousemove", mouseMoved);
}

//Create a function mouseMoved, to be called when the mouse is moved over the imageCanvas.
function mouseMoved(evt) {
  x = evt.offsetX;
  y = evt.offsetY;

  //Create a function to draw the global zoomData imageData to the zoom canvas.
  //Call that function whenever the user moves the mouse.
  copyPixel();

  // draw the imageData to the canvas.
  ctxOutput.putImageData(outputData, 0, 0);
}

//Create an init-function, and let that load an image
function init() {
  //create an empty imageData for the zoom canvas
  originalImg = new Image();
  mapImg = new Image();

  //Create another function to be called when the image is loaded
  originalImg.addEventListener("load", drawOnCanvas);
  mapImg.addEventListener("load", drawOnCanvas);

  originalImg.src = "flower.jpg";
  mapImg.src = "map2.jpg";
}

//Draw the image to the imageCanvas.

function drawOnCanvas() {
  ctxOriginal.drawImage(originalImg, 0, 0);
  originalData = getOriginalData(); //Part 5 - Call that function only once, right after having drawn the image to the canvas.

  ctxMap.drawImage(mapImg, 0, 0);
  mapData = getMapData();
  //You are also going to need a ctx for that canvas, and you have to store the imageData in a global variable

  registerMouse();
}

//Make a function that gets the imageData object from the canvas, and stores it in a global variable
function getOriginalData() {
  return ctxOriginal.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function getMapData() {
  return ctxMap.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
