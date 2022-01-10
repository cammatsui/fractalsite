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
        /* The boolean matrix representing the state of the 2D parameters. */
        this.matrix2D = [[true, true, true, true],
            [true, true, true, true],
            [true, true, true, true],
            [true, true, true, true]];
        /* The boolean matrix representing the state of the 3D parameters. */
        this.matrix3D = [[[true, true, true, true],
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true]],
            [[true, true, true, true],
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true]],
            [[true, true, true, true],
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true]],
            [[true, true, true, true],
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true]]];
        /* Mapping from cell to matrix entry for 2D. */
        this.cellMapping3D = [[[3, 3, 3], [3, 3, 4], [3, 4, 3], [3, 4, 4], [4, 3, 3], [4, 3, 4], [4, 4, 3], [4, 4, 4]],
            [[3, 3, 1], [3, 3, 2], [3, 4, 1], [3, 4, 2], [4, 3, 1], [4, 3, 2], [4, 4, 1], [4, 4, 2]],
            [[3, 1, 3], [3, 1, 4], [3, 2, 3], [3, 2, 4], [4, 1, 3], [4, 1, 4], [4, 2, 3], [4, 2, 4]],
            [[3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2], [4, 1, 1], [4, 1, 2], [4, 2, 1], [4, 2, 2]],
            [[1, 3, 3], [1, 3, 4], [1, 4, 3], [1, 4, 4], [2, 3, 3], [2, 3, 4], [2, 4, 3], [2, 4, 4]],
            [[1, 3, 1], [1, 3, 2], [1, 4, 1], [1, 4, 2], [2, 3, 1], [2, 3, 2], [2, 4, 1], [2, 4, 2]],
            [[1, 1, 3], [1, 1, 4], [1, 2, 3], [1, 2, 4], [2, 1, 3], [2, 1, 4], [2, 2, 3], [2, 2, 4]],
            [[1, 1, 1], [1, 1, 2], [1, 2, 1], [1, 2, 2], [2, 1, 1], [2, 1, 2], [2, 2, 1], [2, 2, 2]]];
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "blue";
        this.is2D = true;
        this.incX = 0;
        this.incY = 0;
        this.initializeCanvas();
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Swap from 2D to 3D (or vice versa).
     */
    swapDimension() {
        this.is2D = !this.is2D;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    } // swapDimension ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Set all of the cells to true.
     */
    clearCells() {
        this.setCells(true);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    } // clearCells ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Set all of the cells to false.
     */
    fillCells() {
        this.setCells(false);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    } // fillCells ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Set all the cells to the given value.
     *
     * @param value The value to set all of the cells to.
     */
    setCells(value) {
        if (this.is2D) {
            for (var i = 0; i < this.matrix2D.length; i++) {
                for (var j = 0; j < this.matrix2D[0].length; j++) {
                    this.matrix2D[i][j] = value;
                }
            }
        }
        else {
            for (var i = 0; i < this.matrix3D.length; i++) {
                for (var j = 0; j < this.matrix3D[0].length; j++) {
                    for (var k = 0; k < this.matrix3D[0][0].length; k++) {
                        this.matrix3D[i][j][k] = value;
                    }
                }
            }
        }
    } // setCells ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw the grid onto the canvas for the MemIFS.
     */
    drawGrid() {
        this.incX = this.canvas.width / 4;
        this.incY = this.canvas.width / 4;
        var c;
        var drawEmpty = true;
        var numCellsSide = this.is2D ? 3 : 7;
        for (var row = 0; row <= numCellsSide; row++) {
            for (var col = 0; col <= numCellsSide; col++) {
                if (this.is2D) {
                    drawEmpty = this.matrix2D[row][col];
                }
                else {
                    c = this.cellMapping3D[col][row];
                    drawEmpty = this.matrix3D[c[0] - 1][c[1] - 1][c[2] - 1];
                }
                if (drawEmpty)
                    this.drawEmptyCell(row, col);
                else
                    this.drawFullCell(row, col);
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
        this.ctx.rect(row * this.incX, col * this.incY, this.incX, this.incY);
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
        if (this.is2D) {
            this.ctx.beginPath();
            this.ctx.rect(row * this.incX, col * this.incY, this.incX, this.incY);
            this.ctx.fillStyle = "blue";
            this.ctx.fill();
            this.ctx.stroke();
        }
        else {
            var incX3D = this.incX * (2 / 5);
            var incY3D = this.incY * (2 / 5);
            var gapX3D = this.incX * (1 / 5);
            var gapY3D = this.incY * (1 / 5);
            for (var i = 0; i < 4; i++) {
                this.ctx.beginPath();
                this.ctx.rect(row * this.incX + (i * gapX3D), col * this.incY + (i * gapY3D), incX3D, incY3D);
                this.ctx.fillStyle = "blue";
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
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
        this.ctx.clearRect(row * this.incX, col * this.incY, this.incX, this.incY);
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
        var row = Math.floor((event.clientX - rect.left) / this.incX);
        var col = Math.floor((event.clientY - rect.top) / this.incY);
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
        var numCellsSide = this.is2D ? 3 : 7;
        if (row > numCellsSide || col > numCellsSide)
            return;
        this.clearCell(row, col);
        var c; // coordinate.
        if (this.is2D) {
            if (this.matrix2D[row][col])
                this.drawFullCell(row, col);
            else
                this.drawEmptyCell(row, col);
            this.matrix2D[row][col] = !this.matrix2D[row][col];
        }
        else {
            c = this.cellMapping3D[col][row];
            if (this.matrix3D[c[0] - 1][c[1] - 1][c[2] - 1])
                this.drawFullCell(row, col);
            else
                this.drawEmptyCell(row, col);
            this.matrix3D[c[0] - 1][c[1] - 1][c[2] - 1] = !this.matrix3D[c[0] - 1][c[1] - 1][c[2] - 1];
        }
    } // toggleGridElt ()
} // class MemIFSParamCanvas
//======================================================================================================================
