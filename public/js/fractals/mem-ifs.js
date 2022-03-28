//======================================================================================================================
/**
 * @file mem-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date February 2022.
 */
//======================================================================================================================
//======================================================================================================================
/**
 * A class representing an IFS With Memory.
 */
export class IFSWithMemory {
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Constructor for the MemIFS.
     *
     * @param fractalCanvas The canvas to draw the fractal onto.
     * @param memParams A MemIFSParamCanvas to get the parameters for the IFS.
     */
    constructor(fractalCanvas, memParams) {
        /* The amount of time (in ms) to wait between iterations. */
        this.ANIMATION_COOLDOWN = 800;
        /* The number of iterations that have been run on this IFSWithMemory. */
        this.numIters = 0;
        /* How many iterations are possible before disintegration. */
        this.maxIters = Number.MAX_VALUE;
        /* The allowed addresses for the current iteration. */
        this.currentAddresses = [];
        /* The base disallowed addresses. */
        this.baseDisallowedAddresses = new Set();
        this.canvas = fractalCanvas;
        this.ctx = fractalCanvas.getContext("2d");
        this.memParams = memParams;
        this.clearCanvas();
        this.collectBaseAddresses();
        this.setCanvas();
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Setup the first iteration of current addresses and the disallowed base addresses for this IFS.
     */
    collectBaseAddresses() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                // For 2d.
                if (this.memParams.is2D) {
                    var address = "" + (i + 1) + "" + (j + 1);
                    if (this.memParams.matrix2D[i][j])
                        this.currentAddresses.push(address);
                    else
                        this.baseDisallowedAddresses.add(address);
                }
                else {
                    // For 3d.
                    for (var k = 0; k < 4; k++) {
                        var address = "" + (i + 1) + "" + (j + 1) + "" + (k + 1);
                        if (this.memParams.matrix3D[i][j][k])
                            this.currentAddresses.push(address);
                        else
                            this.baseDisallowedAddresses.add(address);
                    }
                }
            }
        }
    } // collectBaseAddresses ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Return the cooldown for an animation (the time between iterations, in ms).
     */
    calculateCooldown() {
        return this.ANIMATION_COOLDOWN;
    } // calculateCooldown
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Apply an iteration of the IFS.
     */
    iterate() {
        this.numIters++;
        this.clearCanvas();
        if (this.numIters == 1) {
            this.drawGrid();
            this.drawCurrentAddresses();
            return;
        }
        this.iterateAddresses();
        this.drawCurrentAddresses();
        if (this.numIters == 2) {
            this.drawGrid();
        }
    } // applyTransform ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Setup the canvas with the iteration 0 drawing.
     */
    setCanvas() {
        var baseAddresses = [];
        for (var i = 1; i <= 4; i++) {
            if (this.memParams.is2D) {
                baseAddresses.push(i + "");
            }
            else {
                for (var j = 1; j <= 4; j++) {
                    baseAddresses.push(i + "" + j);
                }
            }
        }
        baseAddresses.forEach(address => { this.drawAddress(address); });
    } // setCanvas ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Set this.currentAddresses to the next iteration's allowed addresses.
     */
    iterateAddresses() {
        var d = this.memParams.is2D ? 2 : 3;
        var newAddresses = [];
        this.currentAddresses.forEach(currentAddress => {
            for (var i = 1; i <= 4; i++) {
                var tempAddress = currentAddress + "" + i;
                if (!this.baseDisallowedAddresses.has(tempAddress.substring(tempAddress.length - d)))
                    newAddresses.push(tempAddress);
            }
        });
        this.currentAddresses = newAddresses;
    } // iterateAddresses ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw all of the currently allowed addresses.
     */
    drawCurrentAddresses() {
        this.currentAddresses.forEach(address => { this.drawAddress(address); });
    } // drawCurrentAddresses ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw a square at the given address.
     */
    drawAddress(address) {
        // The coordinates for the top left (tL) and bottom right (bR) of the fractal canvas.
        // These become the corresponding coordinates of the square to draw at the given address.
        var tL = { x: 0, y: 0 };
        var bR = { x: this.canvas.width, y: this.canvas.height };
        // Loop through the addresses and recalculate coordinates based on the address value.
        for (var i = 0; i < address.length; i++) {
            var mid = { x: (tL.x + bR.x) / 2, y: (tL.y + bR.y) / 2 };
            switch (address.charAt(i)) {
                case '1':
                    tL = { x: tL.x, y: mid.y };
                    bR = { x: mid.x, y: bR.y };
                    break;
                case '2':
                    tL = { x: mid.x, y: mid.y };
                    bR = { x: bR.x, y: bR.y };
                    break;
                case '3':
                    tL = { x: tL.x, y: tL.y };
                    bR = { x: mid.x, y: mid.y };
                    break;
                case '4':
                    tL = { x: mid.x, y: tL.y };
                    bR = { x: bR.x, y: mid.y };
                    break;
                default:
                    break;
            }
        }
        this.drawSquare(tL.x, tL.y, bR.x, bR.y);
    } // drawAddress ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw gridlines on the canvas for verifying addresses.
     */
    drawGrid() {
        var toAdd = this.memParams.is2D ? 1 : 2;
        var numRows = 2 ** (this.numIters + toAdd);
        var rowWidth = this.canvas.width / numRows;
        // Draw vertical bars.
        for (var x = 0; x <= this.canvas.width; x += rowWidth)
            this.drawLine(x, 0, x, this.canvas.height);
        // Draw horizontal bars.
        for (var y = 0; y <= this.canvas.width; y += rowWidth)
            this.drawLine(0, y, this.canvas.width, y);
    } // drawGrid ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw a line from the coordinates (tx, ty) to (bx, by).
     */
    drawLine(tx, ty, bx, by) {
        this.ctx.beginPath();
        this.ctx.moveTo(tx, ty);
        this.ctx.lineTo(bx, by);
        this.ctx.stroke();
    } // drawLine ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw a square with the given coordinates.
     */
    drawSquare(tx, ty, bx, by) {
        if (bx - tx < 1.2) {
            // Toggle warning.
            this.maxIters = this.numIters;
        }
        this.ctx.beginPath();
        this.ctx.rect(tx, ty, bx - tx, by - ty);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(tx, ty, bx - tx, by - ty);
    } // drawSquare ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Clear the fractal canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } // clearCanvas ()
} // class IFSWithMemory
//======================================================================================================================
