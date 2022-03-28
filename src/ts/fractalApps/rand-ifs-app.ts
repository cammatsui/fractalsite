//======================================================================================================================
/**
 * @file rand-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date February 2022.
 */

// IMPORTS
import { RandomIFS } from '../fractals/rand-ifs.js';
import { ProbabilityAffineTable } from './interfaces/affine-table.js';
import { Animator } from '../etc/animation.js';
import { AffineTransform } from '../fractals/affine-transform.js';
import { presetIFS } from '../etc/preset-ifs.js';
//======================================================================================================================


//======================================================================================================================
// SETUP
//======================================================================================================================

// Calculate the max dimension for the fractal canvas.
const maxDimension = Math.floor(Math.min(window.innerWidth*.85, window.innerHeight*.85));

// Setup the fractal canvas.
const fractalCanvas = <HTMLCanvasElement>document.getElementById('fractal-canvas')
fractalCanvas.height = maxDimension;
fractalCanvas.width = maxDimension;
const ctx = fractalCanvas.getContext("2d")!;

// Setup the affine table.
let affineTable = new ProbabilityAffineTable(<HTMLTableElement>document.getElementById("affineTable"));

// Get the number of points.
let pointsSlider = <HTMLInputElement>document.getElementById("dotsRange")!;

// Create the ifs.
let ifs : RandomIFS = new RandomIFS(fractalCanvas, affineTable, getNumPoints(), 0, 1);

// Setup the animation.
let iterationsHTML: HTMLElement = document.getElementById("numIters")!;
let animateButton = <HTMLButtonElement>document.getElementById("animate")!;
let animator = new Animator(ifs, animateButton, "", iterationsHTML);

//======================================================================================================================
// END SETUP
//======================================================================================================================


//======================================================================================================================
// BUTTON FUNCTIONS & HELPERS
//======================================================================================================================


    //==================================================================================================================
    /**
     * Reset the IFS, animator, fractal canvas, and iterations tag.
     */
    function resetIFS() {
        ifs = new RandomIFS(fractalCanvas, affineTable, getNumPoints(), 0, 1);
        animator = new Animator(ifs, animateButton, "", iterationsHTML);
        ctx.clearRect(0, 0, fractalCanvas.height, fractalCanvas.width)
        iterationsHTML.innerHTML = "Iterations: 0";
    } // resetIFS ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Get the number of points from the slider.
     */
    function getNumPoints() {
        return +pointsSlider.value;
    } // getNumPoints ()
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

    var blankTableButton = document.getElementById("blankTable")!;
    blankTableButton.onclick = () => { affineTable.clear() };

    var runIterButton = document.getElementById("runIter")!;
    runIterButton.onclick = () => { animator.runIterationWithCooldown() };

    animateButton.onclick = () => { animator.toggleAnimation() };

    var addRowButton = document.getElementById("addRow")!;
    addRowButton.onclick = () => { affineTable.addRow() };

    var delRowButton = document.getElementById("delRow")!;
    delRowButton.onclick = () => { affineTable.deleteLastRow() };

    var resetIFSButton = document.getElementById("resIFS")!;
    resetIFSButton.onclick = resetIFS;

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