//======================================================================================================================
/**
 * @file det-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { DrawingCanvas } from '../etc/drawing.js';
import { DeterministicIFS } from '../fractals/det-ifs.js';
import { presetIfs } from '../etc/presetIfs.js';
import { ParameterizedAffineTransform } from '../types.js';
//======================================================================================================================


//======================================================================================================================
// FUNCTIONS
//======================================================================================================================

// Drawing Functions

// Set the color of the pen on the drawing canvas.
function setColor(color: string) {
    drawing.setColor(color);
} // setColor ()


// Fractal Functions

// Move the drawing to the fractal canvas to be used for the IFS.
function moveDrawing() {
    resetIFS(); // reset the IFS so that iterations etc reset.
    ctx.scale(1, 1);
    ctx.clearRect(0, 0, fractalCanvas.width, fractalCanvas.height);
    var scalingFactor = fractalCanvas.width / drawingCanvas.width;
    ctx.scale(scalingFactor, scalingFactor);
    ctx.drawImage(drawingCanvas, 0, 0);
    ctx.scale(1/scalingFactor, 1/scalingFactor);
} // moveDrawing ()


// Get a preset IFS from the json object.
function getPresetIfs(fractalName: string): ParameterizedAffineTransform[] {
    var ifs = presetIfs[0].ifs;
    // Look through preset IFSs and find one that matches; otherwise, return Sierpinski gasket.
    presetIfs.every(preset => {
        if (preset.name == fractalName) {
            ifs = preset.ifs;
            return false;
        }
        return true;
    });
    return ifs;
} // getPresetIfs ()


// Apply a preset deterministic ifs from the json object.
function applyPresetIfs(fractalName: string) {
    var ifs = getPresetIfs(fractalName);
    var affineTable = <HTMLTableElement>document.getElementById("affineTable");

    // Set number of rows equal to ifs rows.
    var ifsLength = Object.keys(ifs).length;
    var rowDifference = ifsLength - (affineTable.rows.length-1);
    for (var i = 0; i < Math.abs(rowDifference); i++) {
        if (rowDifference < 0) deleteLastRow();
        else addRow();
    }

    // Set rows to ifs parameters.
    for (var i = 1, row; row = affineTable.rows[i]; i++) {
        row.cells[0].innerHTML = ""+ifs[i-1].r;
        row.cells[1].innerHTML = ""+ifs[i-1].s;
        row.cells[2].innerHTML = ""+ifs[i-1].thetaD;
        row.cells[3].innerHTML = ""+ifs[i-1].phiD;
        row.cells[4].innerHTML = ""+ifs[i-1].e;
        row.cells[5].innerHTML = ""+ifs[i-1].f;
    }

    // Reset the IFS.
    resetIFS();
} // applyPresetIfs ()


// Redraw the fractal canvas with a blue square.
function reDraw() {
    ctx.fillStyle = "blue"
    ctx.putImageData(ctx.createImageData(fractalCanvas.width, fractalCanvas.height), 0, 0);
    ctx.rect(-100, -100, fractalCanvas.width+100, fractalCanvas.height+100);
    ctx.fill();
}

// Add a new row to the bottom of the IFS table.
function addRow() {
    var affineTable = <HTMLTableElement>document.getElementById("affineTable");
    var nRows: number = affineTable.rows.length;
    var row = affineTable.insertRow(nRows);
    for (var i = 0; i < 6; i++) {
        var cell = row.insertCell(i);
        cell.contentEditable = "true"; // cell is editable
        cell.innerHTML = "0"; // default value 0
    }
} // addRow ()


// Delete the last row of the IFS table.
function deleteLastRow() {
    var affineTable: HTMLTableElement = <HTMLTableElement>document.getElementById("affineTable");
    var nRows: number = affineTable.rows.length;
    if (nRows > 2) affineTable.deleteRow(nRows-1); // make sure that we have at least one ifs row.
} // deleteLastRow ()


// Create an IFS object from the table to be applied to the canvas.
function createIFSFromTable(): DeterministicIFS {
    var affineTable: HTMLTableElement = <HTMLTableElement>document.getElementById("affineTable");
    var affineParams: any[] = [];
    var nRows: number = affineTable.rows.length;
    for (var i = 1; i < nRows; i++) {
        var row = affineTable.rows[i];
        // get the affine parameters for this row of the table, and add them to the IFS.
        var thisRowParam = {
            r:      +row.cells[0].innerText,
            s:      +row.cells[1].innerText,
            thetaD: +row.cells[2].innerText,
            phiD:   +row.cells[3].innerText,
            e:      +row.cells[4].innerText,
            f:      +row.cells[5].innerText
        }
        affineParams.push(thisRowParam);
    }

    // Make sure that IFS is valid (matrices invertible, numbers).
    try {
        return new DeterministicIFS(fractalCanvas, affineParams);
    } catch (error) {
        alert("Invalid IFS input.");
        return new DeterministicIFS(fractalCanvas, [{r: 1, s: 1, thetaD: 0, phiD: 0, e: 0, f: 0}]);
    }
} // createIFSFromTable ()


// Reset the iterated function system.
function resetIFS() {
    warned = false;
    detIFS = createIFSFromTable();
    reDraw();
    updateNumIters();
} // resetIFS ()


// Update the number of iterations displayed on the webpage.
function updateNumIters() {
    var numItersP = document.getElementById("numIters")!;
    numItersP.innerHTML = "Iterations: " + detIFS.numIters;
} // updateNumIters ()


// Run an iteration of the ifs.
function runIteration() {
    if (detIFS.numIters > detIFS.maxIters && !warned) {
        if (intervalID != 0) toggleAnimation();
        alert("Warning: maximum recommended iterations reached based on your screen resolution. Proceeding may cause IFS to fade.");
        warned = true;
    } else {
        detIFS.applyTransformAnimated(); 
        updateNumIters();
    }
} // runIteration ()


// Run an iteraton after checking that iteration is enabled.
function runIterationFromButton() {
    // Don't run if cooldown has not expired or animation is enabled.
    if (!iterationEnabled || intervalID != 0) return;
    runIteration();
    iterationEnabled = false;
    // Set a cooldown based on the number of iterations that the deterministic ifs needs.
    var ifsCooldown = calculateIFSCooldown();
    setTimeout( () => { iterationEnabled  = true }, ifsCooldown);
} // runIterationFromButton ()


// Calculate the appropriate cooldown for an IFS iteration.
function calculateIFSCooldown(): number {
    var numTransforms = detIFS.affineTransformMatrices.length;
    console.log(numTransforms);
    var affineDelay = detIFS.AFFINE_DELAY;
    return (numTransforms * affineDelay) * 1.5;
} // calculateIFSCooldown ()


// Start the animation.
function startAnimation(ms: number) {
    intervalID = setInterval( () => { runIteration() }, ms );
} // startAnimation ()


// Stop the animation.
function stopAnimation() {
    clearInterval(intervalID);
    intervalID = 0;
} // stopAnimation ()


// Toggle the animation on/off.
function toggleAnimation() {
    if (intervalID != 0) {
        // Animation is running => stop the animation.
        animateButton.innerHTML = "Start Animation";
        stopAnimation();
        iterationEnabled = true;
    } else {
        // Animation is stopped => start the animation.
        animateButton.innerHTML = "Stop Animation";
        startAnimation(calculateIFSCooldown());
        iterationEnabled = false;
    }
} // toggleAnimation ()


// Reset the size of the drawing canvas when the modal is opened.
function resizeDrawingCanvas() {
    const drawingModal = <HTMLDivElement>document.getElementById("drawingModalBody");
    var drawingCanvasMaxDimension = Math.min(maxDimension *.8, drawingModal.offsetWidth);
    drawingCanvas.width = drawingCanvasMaxDimension;
    drawingCanvas.height = drawingCanvasMaxDimension;
} // resizeDrawingCanvas ()


// Reset the drawing tools.
function resetDrawingTools() {
    drawing.resetDrawingTools();
} // resetDrawingTools ()


// Setup the drawing canvas when the modal is opened.
function activateDrawingCanvas() {
    drawing = new DrawingCanvas(drawingCanvas);
    setTimeout(resizeDrawingCanvas, 250);
    setTimeout(resetDrawingTools, 250);
} // activateDrawingCanvas ()


//======================================================================================================================
// INITIALIZATION
//======================================================================================================================

const maxDimension = Math.floor(Math.min(window.innerWidth*.85, window.innerHeight*.85));

// Drawing Canvas
const drawingCanvas = <HTMLCanvasElement>document.getElementById('drawing-canvas');
var drawing = new DrawingCanvas(drawingCanvas);

// Fractal Canvas
const fractalCanvas = <HTMLCanvasElement>document.getElementById('fractal-canvas');
fractalCanvas.height = maxDimension;
fractalCanvas.width = maxDimension;

const ctx = fractalCanvas.getContext('2d')!;

// Reset canvas and create IFS object.
reDraw();
var detIFS = createIFSFromTable();

// The interval id for animation.
var intervalID: number = 0;

// Whether or not the user has been warned about IFS fade.
var warned = false;

// Whether the user is currently allowed to run an iteration via the UI button.
var iterationEnabled = true;

//======================================================================================================================
// BUTTON SETUP
//======================================================================================================================

// Drawing Buttons

// color buttons
var colorButtonBlack = document.getElementById("color-btn-black")!;
colorButtonBlack.onclick = () => setColor('black');

var colorButtonRed = document.getElementById("color-btn-red")!;
colorButtonRed.onclick = () => setColor('red');

var colorButtonYellow = document.getElementById("color-btn-yellow")!;
colorButtonYellow.onclick = () => setColor('yellow');

var colorButtonGreen = document.getElementById("color-btn-green")!;
colorButtonGreen.onclick = () => setColor('green');

var colorButtonBlue = document.getElementById("color-btn-blue")!;
colorButtonBlue.onclick = () => setColor('blue');

// clear drawing
var clearDrawingButton = document.getElementById("clear-drawing-btn")!;
clearDrawingButton.onclick = () => drawing.clear();

// move drawing
var drawingModalOpenButton = document.getElementById("drawingModalOpen")!
drawingModalOpenButton.onclick = activateDrawingCanvas;

// Fractal Buttons
var runIterButton = document.getElementById("runIter")!;
runIterButton.onclick = runIterationFromButton;

var animateButton = document.getElementById("animate")!;
animateButton.onclick = toggleAnimation;

var addRowButton = document.getElementById("addRow")!;
addRowButton.onclick = addRow;

var delRowButton = document.getElementById("delRow")!;
delRowButton.onclick = deleteLastRow;

var resetIFSButton = document.getElementById("resIFS")!;
resetIFSButton.onclick = resetIFS;

var moveDrawingButton = document.getElementById("moveDr")!;
moveDrawingButton.onclick = moveDrawing;

var resetButton = document.getElementById("resetDr")!;
resetButton.onclick = resetIFS;

// set up preset event listeners
var presetIfsOptions = document.getElementById("ifsDropDown")!;
var options = Array.from(presetIfsOptions.getElementsByTagName("a"))!;
options.forEach(option => {
    option.onclick = () => applyPresetIfs(option.innerHTML);
});