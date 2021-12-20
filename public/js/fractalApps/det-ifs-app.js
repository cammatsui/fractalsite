//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
/**
 * @file det-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */
// IMPORTS
import { DrawingCanvas } from '../drawing.js';
import { DeterministicIFS } from '../fractals/det-ifs.js';
//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
// FUNCTIONS
//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
// Drawing Functions
function setColor(color) {
    drawing.updateColor(color);
} // setColor ()
// Fractal Functions
function moveDrawing() {
    var drawingCtx = drawing.ctx;
    ctx.putImageData(drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height), 0, 0);
} // moveDrawing ()
function reDraw() {
    ctx.fillStyle = "blue";
    ctx.putImageData(ctx.createImageData(fractalCanvas.width, fractalCanvas.height), 0, 0);
    ctx.rect(-100, -100, fractalCanvas.width + 100, fractalCanvas.height + 100);
    ctx.fill();
}
// Add a new row to the bottom of the IFS table.
function addRow() {
    var affineTable = document.getElementById("affineTable");
    var nRows = affineTable.rows.length;
    var row = affineTable.insertRow(nRows);
    for (var i = 0; i < 6; i++) {
        var cell = row.insertCell(i);
        cell.contentEditable = "true";
        cell.innerHTML = "0";
    }
} // addRow ()
// Delete the last row of the IFS table.
function deleteLastRow() {
    var affineTable = document.getElementById("affineTable");
    var nRows = affineTable.rows.length;
    if (nRows > 2) {
        affineTable.deleteRow(nRows - 1);
    }
} // deleteLastRow ()
// Create an IFS object from the table to be applied to the canvas.
function createIFSFromTable() {
    var affineTable = document.getElementById("affineTable");
    var affineParams = [];
    var nRows = affineTable.rows.length;
    for (var i = 1; i < nRows; i++) {
        var row = affineTable.rows[i];
        var thisRowParam = {
            r: +row.cells[0].innerHTML,
            s: +row.cells[1].innerHTML,
            thetaD: +row.cells[2].innerHTML,
            phiD: +row.cells[3].innerHTML,
            e: +row.cells[4].innerHTML,
            f: +row.cells[5].innerHTML
        };
        affineParams.push(thisRowParam);
    }
    var detIFS = new DeterministicIFS(fractalCanvas, affineParams);
    return detIFS;
} // createIFSFromTable ()
// Reset the iterated function system.
function resetIFS() {
    reDraw();
    detIFS = createIFSFromTable();
} // resetIFS ()
function runIteration() {
    detIFS.applyTransform();
} // runIteration ()
//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
// INITIALIZATION
//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
const maxDimension = Math.floor(Math.min(window.innerWidth * .5, window.innerHeight * .83));
// Drawing Canvas
const drawingCanvas = document.getElementById('drawing-canvas');
drawingCanvas.width = maxDimension;
drawingCanvas.height = maxDimension;
var drawing = new DrawingCanvas(drawingCanvas);
// Fractal Canvas
const fractalCanvas = document.getElementById('fractal-canvas');
fractalCanvas.height = maxDimension;
fractalCanvas.width = maxDimension;
const ctx = fractalCanvas.getContext('2d');
// Reset canvas and create IFS object.
reDraw();
var detIFS = createIFSFromTable();
//======================================================================================================================
// BUTTON SETUP
//======================================================================================================================
// Drawing Buttons
// color buttons
var colorButtonBlack = document.getElementById("color-btn-black");
colorButtonBlack.onclick = () => setColor('black');
var colorButtonRed = document.getElementById("color-btn-red");
colorButtonRed.onclick = () => setColor('red');
var colorButtonYellow = document.getElementById("color-btn-yellow");
colorButtonYellow.onclick = () => setColor('yellow');
var colorButtonGreen = document.getElementById("color-btn-green");
colorButtonGreen.onclick = () => setColor('green');
var colorButtonBlue = document.getElementById("color-btn-blue");
colorButtonBlue.onclick = () => setColor('blue');
// clear drawing
var clearDrawingButton = document.getElementById("clear-drawing-btn");
clearDrawingButton.onclick = () => drawing.clear();
// Fractal Buttons
var runIterButton = document.getElementById("runIter");
runIterButton.onclick = runIteration;
var addRowButton = document.getElementById("addRow");
addRowButton.onclick = addRow;
var delRowButton = document.getElementById("delRow");
delRowButton.onclick = deleteLastRow;
var resetIFSButton = document.getElementById("resIFS");
resetIFSButton.onclick = resetIFS;
var moveDrawingButton = document.getElementById("moveDr");
moveDrawingButton.onclick = moveDrawing;
var resetButton = document.getElementById("resetDr");
resetButton.onclick = reDraw;
