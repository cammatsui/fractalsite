//======================================================================================================================
/**
 * @file rand-ifs-app.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date February 2022.
 */
// IMPORTS
import { RandomIFS } from '../fractals/rand-ifs.js';
//======================================================================================================================
//======================================================================================================================
// FUNCTIONS
//======================================================================================================================
// Create an IFS object from the table to be applied to the canvas.
function createIFSFromTable() {
    var affineTable = document.getElementById("affineTable");
    var affineParams = [];
    var nRows = affineTable.rows.length;
    for (var i = 1; i < nRows; i++) {
        var row = affineTable.rows[i];
        // get the affine parameters for this row of the table, and add them to the IFS.
        var row2 = [];
        // Interpret blank as 0
        for (var j = 0; j < 3; j++) {
            if (row.cells[j].innerHTML == "0") {
                row2.push(0);
            }
            else {
                row2.push(parseTableEntry(row.cells[j].innerText));
            }
        }
        var thisRowParam = {
            r: row2[0],
            e: row2[1],
            f: row2[2]
        };
        affineParams.push(thisRowParam);
    }
    // Make sure that IFS is valid (matrices invertible, numbers).
    try {
        return new RandomIFS(fractalCanvas, affineParams);
    }
    catch (error) {
        alert("Invalid IFS input.");
        return new RandomIFS(fractalCanvas, [{ r: 1, e: 0, f: 0 }]);
    }
} // createIFSFromTable ()
// Turn a table entry in the IFS table into a number.
function parseTableEntry(html) {
    if (html.includes("/")) {
        // fraction
        var frac = html.replace(/\s/g, "").split('/');
        return (+frac[0]) / (+frac[1]);
    }
    else {
        return (+html.replace(/\s/g, ""));
    }
} // parseTableEntry ()
// Add a new row to the bottom of the IFS table.
function addRow() {
    var affineTable = document.getElementById("affineTable");
    var nRows = affineTable.rows.length;
    var row = affineTable.insertRow(nRows);
    for (var i = 0; i < 3; i++) {
        var cell = row.insertCell(i);
        cell.style.height = "" + affineTable.rows[0].offsetHeight;
        cell.contentEditable = "true"; // cell is editable
        cell.innerHTML = "0"; // default value 0
    }
} // addRow ()
// Create IFS table with one blank row.
function blankIFSTable() {
    var affineTable = document.getElementById("affineTable");
    while (affineTable.rows.length > 2) {
        deleteLastRow();
    }
    deleteLastRow();
} // blankIFSTable ()
// Delete the last row of the IFS table.
function deleteLastRow() {
    var affineTable = document.getElementById("affineTable");
    var nRows = affineTable.rows.length;
    if (nRows > 2) {
        affineTable.deleteRow(nRows - 1); // make sure that we have at least one ifs row.
    }
    else {
        var row = affineTable.rows[1];
        for (var i = 0; i < 3; i++) {
            row.cells[i].innerHTML = "0";
        }
    }
} // deleteLastRow ()
// reset the ifs
function resetIFS() {
    randIFS = createIFSFromTable();
    ctx.clearRect(0, 0, fractalCanvas.height, fractalCanvas.width);
}
// Update the number of iterations displayed on the webpage.
function updateNumIters() {
    var numItersP = document.getElementById("numIters");
    numItersP.innerHTML = "Iterations: " + randIFS.numIters;
} // updateNumIters ()
// Run an iteration of the ifs.
function runIteration() {
    randIFS.iterate();
    updateNumIters();
} // runIteration ()
// Start the animation.
function startAnimation(ms) {
    intervalID = setInterval(() => { runIteration(); }, ms);
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
    }
    else {
        // Animation is stopped => start the animation.
        animateButton.innerHTML = "Stop Animation";
        //startAnimation(calculateIFSCooldown());
        startAnimation(300);
        iterationEnabled = false;
    }
} // toggleAnimation ()
//======================================================================================================================
// INITIALIZATION
//======================================================================================================================
const maxDimension = Math.floor(Math.min(window.innerWidth * .85, window.innerHeight * .85));
const fractalCanvas = document.getElementById('fractal-canvas');
fractalCanvas.height = maxDimension;
fractalCanvas.width = maxDimension;
const ctx = fractalCanvas.getContext("2d");
resetIFS();
var randIFS = createIFSFromTable();
var intervalID = 0;
var iterationEnabled = true;
//======================================================================================================================
// BUTTON SETUP
//======================================================================================================================
var blankTableButton = document.getElementById("blankTable");
blankTableButton.onclick = blankIFSTable;
var runIterButton = document.getElementById("runIter");
runIterButton.onclick = runIteration;
var animateButton = document.getElementById("animate");
animateButton.onclick = toggleAnimation;
var addRowButton = document.getElementById("addRow");
addRowButton.onclick = addRow;
var delRowButton = document.getElementById("delRow");
delRowButton.onclick = deleteLastRow;
var resetIFSButton = document.getElementById("resIFS");
resetIFSButton.onclick = resetIFS;
var resetButton = document.getElementById("resetDr");
resetButton.onclick = resetIFS;
var blanktable;
