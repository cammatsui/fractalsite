//======================================================================================================================
/**
 * @file det-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */
// IMPORTS
import { DrawingCanvas } from '../etc/drawing.js';
import { AffineTable, DeterministicIFS } from '../fractals/det-ifs-new.js';
import { presetIfs } from '../etc/presetIfs.js';
//======================================================================================================================
//======================================================================================================================
// SETUP
//======================================================================================================================
// The max dimension for the fractal canvas.
const maxCanvasDimension = Math.floor(Math.min(window.innerWidth * .85, window.innerHeight * .85));
// Get the canvas to draw on, and set up the DrawingCanvas object.
const drawingCanvas = document.getElementById("drawing-canvas");
let drawing = new DrawingCanvas(drawingCanvas);
// Setup the fractal canvas.
const fractalCanvas = document.getElementById("fractal-canvas");
fractalCanvas.height = maxCanvasDimension;
fractalCanvas.width = maxCanvasDimension;
const fractalCtx = fractalCanvas.getContext("2d");
// Setup the affine table.
const affineTable = new AffineTable(document.getElementById("affineTable"));
// Initialize variables for animation.
let intervalID = 0;
let warned = false;
let iterationEnabled = true;
// Setup the fractal canvas' initial content and create the intial ifs.
let ifs = new DeterministicIFS(fractalCanvas, affineTable, 0, 1);
resetIFS();
//======================================================================================================================
// END SETUP
//======================================================================================================================
//======================================================================================================================
// BUTTON FUNCTIONS & HELPERS
//======================================================================================================================
//==================================================================================================================
/**
 * Reset the IFS. Resets both the ifs itself as well as the canvas.
 */
function resetIFS() {
    warned = false;
    ifs = new DeterministicIFS(fractalCanvas, affineTable, 0, 1);
    updateIterations();
} // resetIFS ()
//==================================================================================================================
//==================================================================================================================
/**
 * Update the iterations HTML so that the correct number is displayed.
 */
function updateIterations() {
    let iterationsHTML = document.getElementById("numIters");
    iterationsHTML.innerHTML = "Iterations: " + ifs.numIters;
} // updateIterations ()
//==================================================================================================================
//==================================================================================================================
/**
 * Set the pen color for the drawing canvas.
 */
function setPenColor(color) {
    drawing.setColor(color);
} // setPenColor ()
//==================================================================================================================
//==================================================================================================================
/**
 * Move the drawing to the fractal canvas.
 */
function moveDrawing() {
    resetIFS(); // Reset the IFS so that iterations reset.
    fractalCtx.scale(1, 1);
    fractalCtx.clearRect(0, 0, fractalCanvas.width, fractalCanvas.height);
    let scalingFactor = fractalCanvas.width / drawingCanvas.width;
    fractalCtx.scale(scalingFactor, scalingFactor);
    fractalCtx.drawImage(drawingCanvas, 0, 0);
    fractalCtx.scale(1 / scalingFactor, 1 / scalingFactor);
} // moveDrawing ()
//==================================================================================================================
//==================================================================================================================
/**
 * Run an iteration of the IFS while accounting for max iterations.
 */
function runIteration() {
    // If not warned but IFS has iterated too much, warn and don't iterate.
    if (ifs.numIters > ifs.maxIters && !warned) {
        if (intervalID != 0)
            toggleAnimation();
        alert("Warning: maximum recommended iterations reached based on your screen resolution. " +
            "Proceeding may cuase IFS to fade.");
        warned = true;
    }
    else {
        // Otherwise, just iterate.
        ifs.iterate();
        updateIterations();
    }
} // runIteration ()
//==================================================================================================================
//==================================================================================================================
/**
 * Run an iteration only after checking that animation is not running and iteration is enabled.
 */
function runIterationButton() {
    // Don't run an iteration if the cooldown has not expired or the animation is running.
    if (!iterationEnabled || intervalID != 0)
        return;
    runIteration();
    iterationEnabled = false;
    // Set a cooldown based on the number of iterations that the ifs needs.
    let cooldown = ifs.calculateCooldown();
    setTimeout(() => { iterationEnabled = true; }, cooldown);
} // runIterationButton ()
//==================================================================================================================
//==================================================================================================================
/**
 * Start the animation.
 */
function startAnimation(ms) {
    intervalID = setInterval(() => { runIteration(); }, ms);
} // startAnimation ()
//==================================================================================================================
//==================================================================================================================
/**
 * Stop the animation.
 */
function stopAnimation() {
    clearInterval(intervalID);
    intervalID = 0;
} // stopAnimation ()
//==================================================================================================================
//==================================================================================================================
/**
 * Toggle the animation on / off.
 */
function toggleAnimation() {
    if (intervalID != 0) {
        // Animation is running, so stop it.
        animateButton.innerHTML = "Start Animation";
        stopAnimation();
        iterationEnabled = true;
    }
    else {
        animateButton.innerHTML = "Stop Animation";
        startAnimation(ifs.calculateCooldown());
        iterationEnabled = false;
    }
} // toggleAnimation ()
//==================================================================================================================
//==================================================================================================================
/**
 * Resize the drawing canvas to the appropriate size.
 */
function resizeDrawingCanvas() {
    const drawingModal = document.getElementById("drawingModalBody");
    var drawingCanvasMaxDimension = Math.min(maxCanvasDimension * .8, drawingModal.offsetWidth);
    drawingCanvas.width = drawingCanvasMaxDimension;
    drawingCanvas.height = drawingCanvasMaxDimension;
} // resizeDrawingCanvas ()
//==================================================================================================================
//==================================================================================================================
/**
 * Activate the drawing canvas.
 */
function activateDrawingCanvas() {
    drawing = new DrawingCanvas(drawingCanvas);
    setTimeout(resizeDrawingCanvas, 250);
    setTimeout(() => { drawing.resetDrawingTools(); }, 250);
} // activateDrawingCanvas ()
//==================================================================================================================
//==================================================================================================================
/**
 * Load the preset ifs with the given name from the "presetIfs.js" file.
 */
function getPresetIFS(name) {
    // By default, use the Sierpinski Gasket.
    let ifs = presetIfs[0].ifs;
    presetIfs.every(preset => {
        if (preset.name == name) {
            ifs = preset.ifs;
            return false;
        }
        return true;
    });
    return ifs;
} // getPresetIFS ()
//==================================================================================================================
//==================================================================================================================
/**
 * Set the table to a preset ifs.
 */
function setPresetIFS(ifs) {
    affineTable.applyPreset(ifs);
} // setPresetIFS ()
//==================================================================================================================
//======================================================================================================================
// END BUTTON FUNCTIONS & HELPERS
//======================================================================================================================
//======================================================================================================================
// BUTTON SETUP
//======================================================================================================================
//==================================================================================================================
// DRAWING BUTTONS
var colorButtonBlack = document.getElementById("color-btn-black");
colorButtonBlack.onclick = () => setPenColor('black');
var colorButtonRed = document.getElementById("color-btn-red");
colorButtonRed.onclick = () => setPenColor('red');
var colorButtonYellow = document.getElementById("color-btn-yellow");
colorButtonYellow.onclick = () => setPenColor('yellow');
var colorButtonGreen = document.getElementById("color-btn-green");
colorButtonGreen.onclick = () => setPenColor('green');
var colorButtonBlue = document.getElementById("color-btn-blue");
colorButtonBlue.onclick = () => setPenColor('blue');
// Clear the drawing.
var clearDrawingButton = document.getElementById("clear-drawing-btn");
clearDrawingButton.onclick = () => drawing.clear();
// Move the drawing.
var drawingModalOpenButton = document.getElementById("drawingModalOpen");
drawingModalOpenButton.onclick = activateDrawingCanvas;
//==================================================================================================================
//==================================================================================================================
// FRACTAL BUTTONS
var blankTableButton = document.getElementById("blankTable");
blankTableButton.onclick = () => { affineTable.clear(); };
var runIterButton = document.getElementById("runIter");
runIterButton.onclick = runIterationButton;
var animateButton = document.getElementById("animate");
animateButton.onclick = toggleAnimation;
var addRowButton = document.getElementById("addRow");
addRowButton.onclick = () => { affineTable.addRow(); };
var delRowButton = document.getElementById("delRow");
delRowButton.onclick = () => { affineTable.deleteLastRow(); };
var resetIFSButton = document.getElementById("resIFS");
resetIFSButton.onclick = resetIFS;
var moveDrawingButton = document.getElementById("moveDr");
moveDrawingButton.onclick = moveDrawing;
var resetButton = document.getElementById("resetDr");
resetButton.onclick = resetIFS;
var presetIfsOptions = document.getElementById("ifsDropDown");
var options = Array.from(presetIfsOptions.getElementsByTagName("a"));
options.forEach(option => {
    option.onclick = () => setPresetIFS(getPresetIFS(option.innerHTML));
});
//==================================================================================================================
//======================================================================================================================
// END BUTTON SETUP
//======================================================================================================================
