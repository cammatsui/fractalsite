//======================================================================================================================
/**
 * @file affine-table.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date March 2022.
 */
// IMPORTS
import { AffineTransform } from '../../fractals/affine-transform.js';
//======================================================================================================================
//======================================================================================================================
/**
 * The AffineTable class wraps an HTML table which allows the user to change an IFS.
 */
export class AffineTable {
    //==================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * The constructor for the AffineTable.
     */
    constructor(table) {
        this.table = table;
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Parse the table's HTML to create the corresponding array of AffineTransforms.
     */
    collectTransforms() {
        let affineParams = [];
        let numParams = 6; // r, s, theta, phi, e, f.
        for (var i = 1; i < this.table.rows.length; i++) {
            let rawRow = this.table.rows[i];
            let numberRow = [];
            for (var j = 0; j < numParams; j++) {
                let cellHTML = rawRow.cells[j].innerHTML;
                let nextParam = cellHTML == "0" ? 0 : AffineTable.parseTableEntry(rawRow.cells[j].innerText);
                numberRow.push(nextParam);
            }
            affineParams.push(new AffineTransform(numberRow[0], numberRow[1], numberRow[2], numberRow[3], numberRow[4], numberRow[5]));
        }
        return affineParams;
    } // collectTransforms ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Add a row to the table.
     */
    addRow() {
        let newRow = this.table.insertRow(this.table.rows.length);
        for (var i = 0; i < this.table.rows[0].cells.length; i++) {
            this.styleCell(newRow.insertCell(i), "0"); // Insert a cell and style it to match the table.
        }
    } // addRow ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Delete the last row of the table, or blank it out if there is only one remaining.
     */
    deleteLastRow() {
        if (this.table.rows.length > 2) { // Make sure we have at least one editable row remaining.
            this.table.deleteRow(this.table.rows.length - 1);
            return;
        }
        // If not more than one remaining, blank out last row.
        let firstRow = this.table.rows[1];
        for (var i = 0; i < firstRow.cells.length; i++) {
            this.styleCell(firstRow.cells[i], "0");
        }
    } // deleteLastRow ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Clear the table such that only one editable, but blanked, row remains.
     */
    clear() {
        while (this.table.rows.length > 2)
            this.deleteLastRow();
        this.deleteLastRow();
    } // clear ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Update the table to match the given preset ifs, provided as a list of affine transformations.
     */
    applyPreset(transforms) {
        // Set the number of rows to the number of affine transforms.
        this.setNumRows(transforms.length);
        // Set the table entries to match the given transforms.
        for (var i = 1, row; row = this.table.rows[i]; i++) {
            row.cells[0].innerHTML = "" + transforms[i - 1].r;
            row.cells[1].innerHTML = "" + transforms[i - 1].s;
            row.cells[2].innerHTML = "" + transforms[i - 1].theta;
            row.cells[3].innerHTML = "" + transforms[i - 1].phi;
            row.cells[4].innerHTML = "" + transforms[i - 1].e;
            row.cells[5].innerHTML = "" + transforms[i - 1].f;
        }
    } // applyPreset ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Set the number of rows for the table.
     */
    setNumRows(num) {
        let rowDifferential = num - (this.table.rows.length - 1);
        for (var i = 0; i < Math.abs(rowDifferential); i++) {
            if (rowDifferential < 0)
                this.deleteLastRow();
            else
                this.addRow();
        }
    } // setNumRows ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Style a given cell to have the default value of "0", be editeable, and have the same height as previous rows'
     * cells.
     */
    styleCell(cell, innerText) {
        cell.style.height = "" + this.table.rows[0].offsetHeight; // Set the height to be the same as the first row.
        cell.contentEditable = "true";
        cell.innerHTML = innerText;
    } // styleCell
    //==================================================================================================================
    //==================================================================================================================
    // STATIC METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Convert an entry entered by a user into a number.
     */
    static parseTableEntry(html) {
        if (html.includes("/")) {
            // Text is a fraction; parse as such.
            let frac = html.replace(/\s/g, "").split('/');
            return (+frac[0] / (+frac[1]));
        }
        return (+html.replace(/\s/g, ""));
    } // parseTableEntry ()
} // class AffineTable
//======================================================================================================================
//======================================================================================================================
/**
 * A class representing an Affine Table which allows for probabilites for each transform.
 */
export class ProbabilityAffineTable extends AffineTable {
    //======================================================================================================================
    //==================================================================================================================
    /**
     * The constructor for the ProbabilityAffineTable.
     */
    constructor(table) {
        super(table);
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Collect the table's cumulative probabilities.
     */
    collectProbabilities() {
        let probabilities = [];
        let sum = 0;
        // Collect the entered probabilities.
        for (var i = 1; i < this.table.rows.length; i++) {
            let parsedProb = AffineTable.parseTableEntry(this.table.rows[i].cells[6].innerText);
            sum += parsedProb;
            probabilities.push(parsedProb);
        }
        // Normalize the probabilities.
        for (var i = 0; i < probabilities.length; i++) {
            probabilities[i] = probabilities[i] / sum;
        }
        // Create cumulative probabilities.
        let cumulativeProbabilities = [];
        sum = 0;
        for (var i = 0; i < probabilities.length; i++) {
            cumulativeProbabilities.push(sum);
            sum += probabilities[i];
        }
        cumulativeProbabilities.push(1);
        return cumulativeProbabilities;
    } // collectProbabilities ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Add a row to the table.
     */
    addRow() {
        let newRow = this.table.insertRow(this.table.rows.length);
        for (var i = 0; i < this.table.rows[0].cells.length; i++) {
            if (i == 6)
                this.styleCell(newRow.insertCell(i), "1");
            else
                this.styleCell(newRow.insertCell(i), "0"); // Insert a cell and style it to match the table.
        }
    } // addRow ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Delete the last row of the table, or blank it out if there is only one remaining.
     */
    deleteLastRow() {
        if (this.table.rows.length > 2) { // Make sure we have at least one editable row remaining.
            this.table.deleteRow(this.table.rows.length - 1);
            return;
        }
        // If not more than one remaining, blank out last row.
        let firstRow = this.table.rows[1];
        for (var i = 0; i < firstRow.cells.length; i++) {
            if (i == 6)
                this.styleCell(firstRow.cells[i], "1");
            else
                this.styleCell(firstRow.cells[i], "0");
        }
    } // deleteLastRow ()
} // class ProbabilityAffineTable
//=======================================================================================================================
