//======================================================================================================================
/**
 * @file det-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */
// IMPORTS
import { DrawingCanvas } from './interfaces/drawing.js';
import { DeterministicIFS } from '../fractals/det-ifs.js';
import { presetIFS } from '../etc/preset-ifs.js';
import { AffineTransform } from '../fractals/affine-transform.js';
import { Animator } from '../etc/animation.js';
import { AffineTable } from './interfaces/affine-table.js';
//======================================================================================================================


//======================================================================================================================
// SETUP
//======================================================================================================================

// Calculate the max dimension for the fractal canvas.
const maxCanvasDimension = Math.floor(Math.min(window.innerWidth*.85, window.innerHeight*.85));

// Get the canvas to draw on, and set up the DrawingCanvas object.
const drawingCanvas = <HTMLCanvasElement>document.getElementById("drawing-canvas");
let drawing = new DrawingCanvas(drawingCanvas);

// Setup the fractal canvas.
const fractalCanvas = <HTMLCanvasElement>document.getElementById("fractal-canvas");
fractalCanvas.height = maxCanvasDimension;
fractalCanvas.width = maxCanvasDimension;
const fractalCtx = fractalCanvas.getContext("2d")!;

// Setup the affine table.
const affineTable = new AffineTable(<HTMLTableElement>document.getElementById("affineTable"));

// Setup the fractal canvas' initial content and create the intial ifs.
let ifs = new DeterministicIFS(fractalCanvas, affineTable, 0, 1);

// Setup the animation.
let iterationsHTML: HTMLElement = document.getElementById("numIters")!;
let animateButton = <HTMLButtonElement>document.getElementById("animate")!;

let warning =   "Warning: maximum recommended iterations reached based on your screen resolution. " +
                "Proceeding may cuase IFS to fade.";

let animator = new Animator(ifs, animateButton, warning, iterationsHTML);

//======================================================================================================================
// END SETUP
//======================================================================================================================


//======================================================================================================================
// BUTTON FUNCTIONS & HELPERS
//======================================================================================================================


    //==================================================================================================================
    /**
     * Reset the IFS. Resets both the ifs itself as well as the canvas and animator.
     */
    function resetIFS() {
        ifs = new DeterministicIFS(fractalCanvas, affineTable, 0, 1);
        animator = new Animator(ifs, animateButton, warning, iterationsHTML);
        iterationsHTML.innerHTML = "Iterations: 0";
    } // resetIFS ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Set the pen color for the drawing canvas. 
     */
    function setPenColor(color: string) {
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
        fractalCtx.scale(1/scalingFactor, 1/scalingFactor);
    } // moveDrawing ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Resize the drawing canvas to the appropriate size.
     */
    function resizeDrawingCanvas() {
        const drawingModal = <HTMLDivElement>document.getElementById("drawingModalBody");
        var drawingCanvasMaxDimension = Math.min(maxCanvasDimension *.8, drawingModal.offsetWidth);
        drawingCanvas.width = drawingCanvasMaxDimension;
        drawingCanvas.height = drawingCanvasMaxDimension;
    } // resizeDrawingCanvas ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Activate the drawing canvas.
     */
    function activateDrawingCanvas () {
        drawing = new DrawingCanvas(drawingCanvas);
        setTimeout(resizeDrawingCanvas, 250);
        setTimeout(() => { drawing.resetDrawingTools() }, 250);
    } // activateDrawingCanvas ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Load the preset ifs with the given name from the "presetIFS.js" file. 
     */
    function getPresetIFS(name: string): AffineTransform[] {
        // By default, use the Sierpinski Gasket.
        let ifs = presetIFS[0].ifs;

        presetIFS.every(preset => {
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
    function setPresetIFS(ifs: AffineTransform[]) {
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

    // Set pen colors.
    var colorButtonBlack = document.getElementById("color-btn-black")!;
    colorButtonBlack.onclick = () => setPenColor('black');

    var colorButtonRed = document.getElementById("color-btn-red")!;
    colorButtonRed.onclick = () => setPenColor('red');

    var colorButtonYellow = document.getElementById("color-btn-yellow")!;
    colorButtonYellow.onclick = () => setPenColor('yellow');

    var colorButtonGreen = document.getElementById("color-btn-green")!;
    colorButtonGreen.onclick = () => setPenColor('green');

    var colorButtonBlue = document.getElementById("color-btn-blue")!;
    colorButtonBlue.onclick = () => setPenColor('blue');

    // Clear the drawing.
    var clearDrawingButton = document.getElementById("clear-drawing-btn")!;
    clearDrawingButton.onclick = () => drawing.clear();

    // Move the drawing.
    var drawingModalOpenButton = document.getElementById("drawingModalOpen")!
    drawingModalOpenButton.onclick = activateDrawingCanvas;

    //==================================================================================================================


    //==================================================================================================================
    // FRACTAL BUTTONS

    // Blank the affine table.
    var blankTableButton = document.getElementById("blankTable")!;
    blankTableButton.onclick = () => { affineTable.clear() };

    // Run an iteration.
    var runIterButton = document.getElementById("runIter")!;
    runIterButton.onclick = () => { animator.runIterationWithCooldown() };

    // Toggle animation.
    animateButton.onclick = () => { animator.toggleAnimation() };

    // Add a row to the affine table.
    var addRowButton = document.getElementById("addRow")!;
    addRowButton.onclick = () => { affineTable.addRow() };

    // Delete a row from the affine table.
    var delRowButton = document.getElementById("delRow")!;
    delRowButton.onclick = () => { affineTable.deleteLastRow() };

    // Reset the IFS from the table.
    var resetIFSButton = document.getElementById("resIFS")!;
    resetIFSButton.onclick = resetIFS;

    // Move the drawing.
    var moveDrawingButton = document.getElementById("moveDr")!;
    moveDrawingButton.onclick = moveDrawing;

    // Reset the drawing.
    var resetButton = document.getElementById("resetDr")!;
    resetButton.onclick = resetIFS;

    // Set options and event listeners for the preset dropdown menu.
    var presetIFSOptions = document.getElementById("ifsDropDown")!;
    var options = Array.from(presetIFSOptions.getElementsByTagName("a"))!;
    options.forEach(option => {
        option.onclick = () => setPresetIFS(getPresetIFS(option.innerHTML));
    });

    //==================================================================================================================


//======================================================================================================================
// END BUTTON SETUP
//======================================================================================================================