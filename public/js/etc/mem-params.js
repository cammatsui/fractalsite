//======================================================================================================================
/**
 * @file mem-params.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date January 2022.
 */
//======================================================================================================================
//======================================================================================================================
/**
 * A class for a canvas to record IFS with Memory parameter choices.
 */
export class MemIFSParamCanvas {
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * The constructor for the MemIFSParamCanvas.
     *
     * @param canvas: The canvas to use as a MemIFSParamCanvas.
     */
    constructor(canvas) {
        /* The boolean grid representing the state of the parameters. */
        this.matrix2D = [[true, true, true, true],
            [true, true, true, true],
            [true, true, true, true],
            [true, true, true, true]];
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "blue";
        this.incX2D = 0;
        this.incY2D = 0;
        this.initializeCanvas();
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw the grid onto the canvas for the 2D MemIFS.
     */
    draw2DGrid() {
        this.incX2D = this.canvas.width / 4;
        this.incY2D = this.canvas.height / 4;
        for (var row = 0; row <= 3; row++) {
            for (var col = 0; col <= 3; col++) {
                this.drawEmptyCell(row, col);
            }
        }
    } // draw2DGrid ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw an empty (allowed) cell at the given row/column position.
     *
     * @param row The row of the cell.
     * @param col The column of the cell.
     */
    drawEmptyCell(row, col) {
        this.ctx.beginPath();
        this.ctx.rect(row * this.incX2D, col * this.incY2D, this.incX2D, this.incY2D);
        this.ctx.stroke();
    } // drawClearRect ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw a full (disallowed) cell at the given row/column position.
     *
     * @param row The row of the cell.
     * @param col The column of the cell.
     */
    drawFullCell(row, col) {
        this.ctx.beginPath();
        this.ctx.rect(row * this.incX2D, col * this.incY2D, this.incX2D, this.incY2D);
        this.ctx.fillStyle = "blue";
        this.ctx.fill();
        this.ctx.stroke();
    } // drawFullRect ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Clear the cell at the given row/column position.
     *
     * @param row The row of the cell to clear.
     * @param col The column of the cell to clear.
     */
    clearCell(row, col) {
        this.ctx.clearRect(row * this.incX2D, col * this.incY2D, this.incX2D, this.incY2D);
    } // clearRect ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Initialize the canvas by adding the event listener for clicks.
     */
    initializeCanvas() {
        var paramCanvas = this;
        function parseClick(e) { paramCanvas.parseClick(e); }
        // Set up event listener for click enable/disable.
        this.canvas.addEventListener("mousedown", function (e) {
            parseClick(e);
        }, false);
    } // initializeCanvas ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Parse a click event by finding the corresponding row/column. Then hands the logic to toggleCell() to update the
     * canvas and the underlying matrix.
     *
     * @param event The event to parse.
     */
    parseClick(event) {
        var rect = this.canvas.getBoundingClientRect();
        var row = Math.floor((event.clientX - rect.left) / this.incX2D);
        var col = Math.floor((event.clientY - rect.top) / this.incY2D);
        this.toggleCell(row, col);
    } // parseClick ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Toggle the given cell on/off by updating the canvas and change the value in the matrix.
     *
     * @param row The row of the cell.
     * @param col The column of the cell.
     */
    toggleCell(row, col) {
        this.clearCell(row, col);
        if (this.matrix2D[row][col])
            this.drawFullCell(row, col);
        else
            this.drawEmptyCell(row, col);
        this.matrix2D[row][col] = !this.matrix2D[row][col];
    } // toggleGridElt ()
} // class MemIFSParamCanvas
//======================================================================================================================
