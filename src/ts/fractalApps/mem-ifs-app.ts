//======================================================================================================================
/**
 * @file mem-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { IFSWithMemory } from '../fractals/mem-ifs.js';
import { MemIFSParamCanvas } from './interfaces/mem-params.js';
import { Animator } from '../etc/animation.js';
//======================================================================================================================


//======================================================================================================================
// SETUP
//======================================================================================================================

// Calculate the max dimension for the fractal canvas.
const maxDimension = Math.floor(Math.min(window.innerWidth*.85, window.innerHeight*.85));

// Get the canvas for the MemIFS parameters, and set up the MemIFSParamCanvas object.
const paramCanvas = <HTMLCanvasElement>document.getElementById('parameter-canvas');
let ifsParamSelector = new MemIFSParamCanvas(paramCanvas);

// Setup the fractal canvas.
const fractalCanvas = <HTMLCanvasElement>document.getElementById('fractal-canvas');
fractalCanvas.width = maxDimension;
fractalCanvas.height = maxDimension;

// Reset canvas and create IFS object.
let ifs : IFSWithMemory = new IFSWithMemory(fractalCanvas, ifsParamSelector);

// Set up the animation.
let iterationsHTML: HTMLElement = document.getElementById("numIters")!;
let animateButton = <HTMLButtonElement>document.getElementById("animate")!;

let warning = "Warning: maximum recommended iterations reached based on your screen resolution.";
let animator = new Animator(ifs, animateButton, warning, iterationsHTML);
    
// Get the parameter modal.
const paramModal = <HTMLDivElement>document.getElementById("ifsModalBody");

//======================================================================================================================
// END SETUP
//======================================================================================================================


//======================================================================================================================
// BUTTON FUNCTIONS & HELPERS
//======================================================================================================================


    //==================================================================================================================
    /**
     * Resize the parameter canvas. For use in activateParamCanvas() when the modal is opened.
     */
    function resizeParamCanvas() {
        var paramCanvasMaxDimension = Math.min(maxDimension *.8, paramModal.offsetWidth);
        paramCanvas.width = paramCanvasMaxDimension;
        paramCanvas.height = paramCanvasMaxDimension;
    } // resizeParamCanvas ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Activate the parameter canvas (resize and draw the grid) when the modal is opened.
     */
    function activateParamCanvas() {
        setTimeout(resizeParamCanvas, 250);
        setTimeout(drawGrid, 290);
    } // activateParamCanvas ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Draw the grid on the parameter canvas to mark cells.
     */
    function drawGrid() {
        ifsParamSelector.drawGrid();
    } // drawGrid ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Reset the IFS. Resets both the ifs itself as well as the canvas and animator.
     */
    function resetIFS() {
        ifs = new IFSWithMemory(fractalCanvas, ifsParamSelector);
        animator = new Animator(ifs, animateButton, warning, iterationsHTML);
    } // resetIFS ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Swap the dimension from 2D to 3D (or vice versa) on both the IFS and the parameter canvas.
     */
    function changeDimension() {
        ifsParamSelector.swapDimension();
        ifs = new IFSWithMemory(fractalCanvas, ifsParamSelector);
    } // changeDimension ()
    //==================================================================================================================


//======================================================================================================================
// END BUTTON FUNCTIONS & HELPERS
//======================================================================================================================


//======================================================================================================================
// BUTTON SETUP
//======================================================================================================================


    //==================================================================================================================

    // Run an iteration.
    var runIterButton = document.getElementById("runIter")!;
    runIterButton.onclick = () => { animator.runIterationWithCooldown(); }

    // Toggle animation.
    animateButton.onclick = () => { animator.toggleAnimation() };

    // Reset the IFS.
    var resetIFSButton = document.getElementById("resIFS")!;
    resetIFSButton.onclick = resetIFS;

    // Reset IFS from the parameter modal.
    var resetIFSModalButton = document.getElementById("resIFSModal")!;
    resetIFSModalButton.onclick = resetIFS;

    // Open the parameter modal.
    var ifsModalOpenButton = document.getElementById("ifsModalOpen")!;
    ifsModalOpenButton.onclick = activateParamCanvas;

    // Change the dimension of the parameter modal.
    var changeDimensionButton = document.getElementById("changeDim")!;
    changeDimensionButton.onclick = changeDimension;

    // Clear the cells on the parameter modal.
    var clearCellsButton = document.getElementById("clearCells")!;
    clearCellsButton.onclick = () => { ifsParamSelector.clearCells() };

    // Fill the cells on the parameter modal.
    var fillCellsButton = document.getElementById("fillCells")!;
    fillCellsButton.onclick = () => { ifsParamSelector.fillCells() };

    //==================================================================================================================

//======================================================================================================================
// END BUTTON SETUP
//======================================================================================================================