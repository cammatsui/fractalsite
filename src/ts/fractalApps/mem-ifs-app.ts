//======================================================================================================================
/**
 * @file mem-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { IFSWithMemory2D, IFSWithMemory3D } from '../fractals/mem-ifs.js';
import { MemIFSParamCanvas } from '../etc/mem-params.js';
//======================================================================================================================


//======================================================================================================================
// FUNCTIONS
//======================================================================================================================


function resizeParamCanvas() {
    const paramModal = <HTMLDivElement>document.getElementById("ifsModalBody");
    var paramCanvasMaxDimension = Math.min(maxDimension *.8, paramModal.offsetWidth);
    paramCanvas.width = paramCanvasMaxDimension;
    paramCanvas.height = paramCanvasMaxDimension;
} // resizeParamCanvas ()


function reDraw() {
    fractalCtx.fillStyle = "blue"
    fractalCtx.putImageData(fractalCtx.createImageData(fractalCanvas.width, fractalCanvas.height), 0, 0);
    fractalCtx.rect(-100, -100, fractalCanvas.width+100, fractalCanvas.height+100);
    fractalCtx.fill();
} // reDraw ()


function activateParamCanvas() {
    setTimeout(resizeParamCanvas, 250);
    setTimeout(draw2DGrid, 275);
} // activateParamCanvas ()

function draw2DGrid() {
    ifsParamSelector.draw2DGrid();
} // draw2DGrid ()


function resetIFS() {
    reDraw();
    ifs = new IFSWithMemory2D(fractalCanvas, ifsParamSelector.matrix2D);
}


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

reDraw();

var matrix =   [[true, true, true, true],
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true]];

var ifs = new IFSWithMemory2D(fractalCanvas, matrix);

function runIteration() {
    ifs.applyTransform();
}


var runIterButton = document.getElementById("runIter")!;
runIterButton.onclick = runIteration;

var resetIFSButton = document.getElementById("resIFS")!;
resetIFSButton.onclick = resetIFS;

// move drawing
var ifsModalOpenButton = document.getElementById("ifsModalOpen")!
ifsModalOpenButton.onclick = activateParamCanvas;