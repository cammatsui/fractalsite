//======================================================================================================================
/**
 * @file mem-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { IFSWithMemory } from '../fractals/mem-ifs.js';
import { MemIFSParamCanvas } from '../etc/mem-params.js';
//======================================================================================================================


//======================================================================================================================
// FUNCTIONS
//======================================================================================================================

// Resize the parameter canvas when the modal is opened.
function resizeParamCanvas() {
    const paramModal = <HTMLDivElement>document.getElementById("ifsModalBody");
    var paramCanvasMaxDimension = Math.min(maxDimension *.8, paramModal.offsetWidth);
    paramCanvas.width = paramCanvasMaxDimension;
    paramCanvas.height = paramCanvasMaxDimension;
} // resizeParamCanvas ()


// Reset the fractal canvas.
function reDraw() {
    fractalCtx.fillStyle = "blue"
    fractalCtx.putImageData(fractalCtx.createImageData(fractalCanvas.width, fractalCanvas.height), 0, 0);
    fractalCtx.rect(-100, -100, fractalCanvas.width+100, fractalCanvas.height+100);
    fractalCtx.fill();
} // reDraw ()


// Change the parameter canvas when the modal is opened.
function activateParamCanvas() {
    setTimeout(resizeParamCanvas, 250);
    setTimeout(drawGrid, 290);
} // activateParamCanvas ()


// Draw the grid on the parameter canvas.
function drawGrid() {
    ifsParamSelector.drawGrid();
} // drawGrid ()


// Reset the MemIFS.
function resetIFS() {
    warned = false;
    ifs = new IFSWithMemory(fractalCanvas, ifsParamSelector);
    updateNumIters();
} // resetIFS ()


// Swap the dimension from 2D to 3D (or vice versa) on both the IFS and the parameter canvas.
function changeDimension() {
    ifsParamSelector.swapDimension();
    ifs = new IFSWithMemory(fractalCanvas, ifsParamSelector);
} // changeDimension ()


// Run an iteration of the IFS with memory.
function runIteration() {
    if (ifs.shouldWarn && !warned) {
        if (intervalID != 0) toggleAnimation();
        alert("Warning: maximum recommended iterations reached based on your screen resolution.");
        warned = true;
    } else {
        ifs.applyTransform(); 
        updateNumIters();
    }
} // runIteration ()


// Run an iteration after checking if iteration is enabled.
function runIterationFromButton() {
    if (!iterationEnabled || intervalID != 0) return;
    runIteration();
    iterationEnabled = false;
    setTimeout( () => { iterationEnabled  = true }, 500);
} // runIterationFromButton();


// Update the number of iterations displayed.
function updateNumIters() {
    var numItersP = document.getElementById("numIters")!;
    numItersP.innerHTML = "Iterations: " + ifs.numIters;
} // updateNumIters ()


// Start the animation.
function startAnimation(ms: number) {
    intervalID = setInterval( () => { runIteration() }, ms );
} // startAnimation ()


// Stop the animation.
function stopAnimation() {
    clearInterval(intervalID);
    intervalID = 0;
} // stopAnimation ()


// Toggle animation on/off.
function toggleAnimation() {
    // animation running
    if (intervalID != 0) {
        animateButton.innerHTML = "Start Animation";
        stopAnimation();
        iterationEnabled = true;
    } else {
    // animation stopped
        animateButton.innerHTML = "Stop Animation";
        startAnimation(1000);
        iterationEnabled = false;
    }
} // toggleAnimation ()


// Clear all cells in the parameter selector.
function clearCells() {
    ifsParamSelector.clearCells();
} // clearCells ()


// Fill all cells in the parameter selector.
function fillCells() {
    ifsParamSelector.fillCells();
} // fillCells ()

//======================================================================================================================
// INITIALIZATION
//======================================================================================================================

const maxDimension = Math.floor(Math.min(window.innerWidth*.85, window.innerHeight*.85));

// Parameter Canvas
const paramCanvas = <HTMLCanvasElement>document.getElementById('parameter-canvas');
var ifsParamSelector = new MemIFSParamCanvas(paramCanvas);

// Fractal Canvas
const fractalCanvas = <HTMLCanvasElement>document.getElementById('fractal-canvas');
fractalCanvas.width = maxDimension;
fractalCanvas.height = maxDimension;

const fractalCtx = fractalCanvas.getContext("2d")!;

// Reset canvas and create IFS object.
var ifs : IFSWithMemory = new IFSWithMemory(fractalCanvas, ifsParamSelector);

// Animation stuff
var intervalID: number = 0;

// For warning
var warned = false;

// To stop iteration button.
var iterationEnabled = true;

//======================================================================================================================
// BUTTON SETUP
//======================================================================================================================

var runIterButton = document.getElementById("runIter")!;
runIterButton.onclick = runIterationFromButton;

var animateButton = document.getElementById("animate")!;
animateButton.onclick = toggleAnimation;

var resetIFSButton = document.getElementById("resIFS")!;
resetIFSButton.onclick = resetIFS;

var resetIFSModalButton = document.getElementById("resIFSModal")!;
resetIFSModalButton.onclick = resetIFS;

var ifsModalOpenButton = document.getElementById("ifsModalOpen")!;
ifsModalOpenButton.onclick = activateParamCanvas;

var changeDimensionButton = document.getElementById("changeDim")!;
changeDimensionButton.onclick = changeDimension;

var clearCellsButton = document.getElementById("clearCells")!;
clearCellsButton.onclick = clearCells;

var fillCellsButton = document.getElementById("fillCells")!;
fillCellsButton.onclick = fillCells;