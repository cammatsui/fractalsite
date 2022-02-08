//======================================================================================================================
/**
 * @file mem-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date February 2022.
 */
//======================================================================================================================
//======================================================================================================================
export class IFSWithMemory {
    //==================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Constructor for the MemIFS.
     *
     * @param fractalCanvas The canvas to draw the fractal onto.
     * @param memParams A MemIFSParamCanvas to get the parameters for the IFS.
     */
    constructor(fractalCanvas, memParams) {
        this.canvas = fractalCanvas;
        this.ctx = fractalCanvas.getContext("2d");
        this.memParams = memParams;
        this.numIters = 0;
        this.currentAddresses = [];
        this.baseDisallowedAddresses = new Set();
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
                if (this.memParams.is2D) {
                    var address = "" + (i + 1) + "" + (j + 1);
                    if (this.memParams.matrix2D[i][j])
                        this.currentAddresses.push(address);
                    else
                        this.baseDisallowedAddresses.add(address);
                }
                else {
                    for (var k = 0; i < 4; k++) {
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
     * Apply an iteration of the IFS.
     */
    applyTransform() {
        this.numIters++;
        this.clearCanvas();
        if (this.numIters == 1) {
            this.drawCurrentAddresses();
            return;
        }
        this.iterateAddresses();
        this.drawCurrentAddresses();
    } // applyTransform ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Setup the canvas with the iteration 0 drawing.
     */
    setCanvas() {
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
     *
     * @param address The address to draw at.
     */
    drawAddress(address) {
        var tL = { x: 0, y: 0 };
        var bR = { x: this.canvas.width, y: this.canvas.height };
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
     * Draw a square with the given coordinates.
     *
     * @param tx The x coordinate of the top left corner.
     * @param ty The y coordinate of the top left corner.
     * @param bx The x coordinate of the bottom right corner.
     * @param by The y coordinate of the bottom right corner.
     */
    drawSquare(tx, ty, bx, by) {
        this.ctx.beginPath();
        this.ctx.rect(tx, ty, bx - tx, by - ty);
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
