//======================================================================================================================
/**
 * @file mem-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { IFSWithMemory, IFSWithMemory2D, IFSWithMemory3D } from '../fractals/mem-ifs.js';
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
    reDraw();
    if (ifsParamSelector.is2D) ifs = new IFSWithMemory2D(fractalCanvas, ifsParamSelector.matrix2D);
    else ifs = new IFSWithMemory3D(fractalCanvas, ifsParamSelector.matrix3D);
} // resetIFS ()


// Swap the dimension from 2D to 3D (or vice versa) on both the IFS and the parameter canvas.
function changeDimension() {
    if (ifsParamSelector.is2D) {
        ifs = new IFSWithMemory3D(fractalCanvas, ifsParamSelector.matrix3D);
        ifsParamSelector.swapDimension();
    } else {
        ifs = new IFSWithMemory2D(fractalCanvas, ifsParamSelector.matrix2D);
        ifsParamSelector.swapDimension();
    }
} // changeDimension ()


// Run an iteration of the IFS with memory.
function runIteration() {
    ifs.applyTransform();
} // runIteration ()

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
reDraw();
var ifs : IFSWithMemory = new IFSWithMemory2D(fractalCanvas, ifsParamSelector.matrix2D);

//======================================================================================================================
// BUTTON SETUP
//======================================================================================================================

var runIterButton = document.getElementById("runIter")!;
runIterButton.onclick = runIteration;

var resetIFSButton = document.getElementById("resIFS")!;
resetIFSButton.onclick = resetIFS;

var ifsModalOpenButton = document.getElementById("ifsModalOpen")!;
ifsModalOpenButton.onclick = activateParamCanvas;

var changeDimensionButton = document.getElementById("changeDim")!;
changeDimensionButton.onclick = changeDimension;