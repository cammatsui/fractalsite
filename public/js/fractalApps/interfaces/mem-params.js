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
        /* whether we're in 2d or 3d mode. */
        this.is2D = true;
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
        /* The width of a 2D cell on the canvas. */
        this.inc = 0;
        /* The width on the canvas to add row/column labels. */
        this.labelBufferWidth = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "blue";
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
        this.setCells(false);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    } // clearCells ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Set all of the cells to false.
     */
    fillCells() {
        this.setCells(true);
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
                for (var j = 0; j < this.matrix2D[0].length; j++)
                    this.matrix2D[i][j] = value;
            }
        }
        else {
            for (var i = 0; i < this.matrix3D.length; i++) {
                for (var j = 0; j < this.matrix3D[0].length; j++) {
                    for (var k = 0; k < this.matrix3D[0][0].length; k++)
                        this.matrix3D[i][j][k] = value;
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
        this.inc = (2 * this.canvas.width) / 9;
        this.labelBufferWidth = this.canvas.width / 9;
        var numCellsSide = 3;
        for (var row = 0; row <= numCellsSide; row++) {
            for (var col = 0; col <= numCellsSide; col++) {
                if (this.is2D)
                    this.draw2DCell(row, col);
                else
                    this.draw3DCells(row, col);
            }
        }
        this.drawLabels();
        if (!this.is2D)
            this.draw3DLabels();
    } // drawGrid ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw example depth labels on the cell 4,1.
     */
    draw3DLabels() {
        var inc3D = this.inc * (1 / 6);
        var curX = this.labelBufferWidth + (2 * inc3D);
        var curY = this.labelBufferWidth + (3 * this.inc) + (2 * inc3D);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '18px sans-serif';
        for (var i = 1; i <= 4; i++) {
            this.ctx.fillText("" + i, curX - 9, curY + 9);
            curX += inc3D;
            curY += inc3D;
        }
    } // draw3DLabels ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw row/column labels on the canvas.
     */
    drawLabels() {
        var curX = this.labelBufferWidth + 0.5 * this.inc;
        var curY = 1 / 2 * this.labelBufferWidth;
        this.ctx.fillStyle = 'black';
        // Draw colunn labels.
        for (var i = 1; i <= 4; i++) {
            this.ctx.font = '24px sans-serif';
            this.ctx.fillText("" + i, curX - 12, curY + 12);
            curX += this.inc;
        }
        curX = 1 / 2 * this.labelBufferWidth;
        curY = this.labelBufferWidth + 0.5 * this.inc;
        // Draw row labels.
        for (var i = 1; i <= 4; i++) {
            this.ctx.font = '24px sans-serif';
            this.ctx.fillText("" + i, curX - 12, curY + 12);
            curY += this.inc;
        }
        // Reset the fill style.
        this.ctx.fillStyle = 'blue';
    } // drawLabels ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw the 2D cell based on the state of matrix2D at the given row and column.
     *
     * @param row The row to draw the correct cell at.
     * @param col The column to draw the correct cell at.
     */
    draw2DCell(row, col) {
        this.clearCell(row, col);
        this.ctx.beginPath();
        this.ctx.rect(row * this.inc + this.labelBufferWidth, col * this.inc + this.labelBufferWidth, this.inc, this.inc);
        this.ctx.fillStyle = this.matrix2D[col][row] ? "blue" : "white";
        this.ctx.fill();
        this.ctx.stroke();
    } // draw2DCell ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw the 3d cells corresponding to the state of matrix3D at the given row/column.
     *
     * @param row The row of the 3d cells.
     * @param col The column of the 3d cells.
     */
    draw3DCells(row, col) {
        this.clearCell(row, col);
        var inc3D = this.inc * (1 / 6);
        // Draw the outside cell.
        this.ctx.beginPath();
        this.ctx.rect(row * this.inc + this.labelBufferWidth, col * this.inc + this.labelBufferWidth, this.inc, this.inc);
        this.ctx.stroke();
        // Draw the four inside cells.
        for (var i = 3; i >= 0; i--) {
            this.ctx.beginPath();
            this.ctx.rect(row * this.inc + (i + 0.5) * inc3D + this.labelBufferWidth, col * this.inc + (i + 0.5) * inc3D + this.labelBufferWidth, 2 * inc3D, 2 * inc3D);
            this.ctx.fillStyle = this.matrix3D[col][row][i] ? "blue" : "white";
            this.ctx.fill();
            this.ctx.stroke();
        }
        this.draw3DLabels();
    } // draw3DCells()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Clear the cell at the given row/column position.
     */
    clearCell(row, col) {
        this.ctx.clearRect(row * this.inc + this.labelBufferWidth, col * this.inc + this.labelBufferWidth, this.inc, this.inc);
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
     */
    parseClick(event) {
        var rect = this.canvas.getBoundingClientRect();
        var clickX = event.clientX - rect.left - this.labelBufferWidth;
        var clickY = event.clientY - rect.top - this.labelBufferWidth;
        // Return if outside of the selectable part of the canvas.
        if (clickX < 0 || clickY < 0)
            return;
        // Calculate the row and column which was clicked on.
        var row = Math.floor(clickX / this.inc);
        var col = Math.floor(clickY / this.inc);
        if (this.is2D) {
            this.toggle2DCell(row, col);
        }
        else {
            // Calculate the 3d cell to activate based on the click coordinates.
            var cellX = clickX % this.inc - (1 / 12) * this.inc;
            var cellY = clickY % this.inc - (1 / 12) * this.inc;
            if (cellX > (10 / 12) * this.inc || cellY > (10 / 12) * this.inc || cellX < 0 || cellY < 0)
                return;
            var inc3D = this.inc * (1 / 6);
            var subRow = Math.floor(cellX / inc3D);
            var subCol = Math.floor(cellY / inc3D);
            var cellCoords = [[[true, true, false, false, false],
                    [true, true, false, false, false],
                    [false, false, false, false, false],
                    [false, false, false, false, false],
                    [false, false, false, false, false]],
                [[false, false, false, false, false],
                    [false, false, true, false, false],
                    [false, true, true, false, false],
                    [false, false, false, false, false],
                    [false, false, false, false, false]],
                [[false, false, false, false, false],
                    [false, false, false, false, false],
                    [false, false, false, true, false],
                    [false, false, true, true, false],
                    [false, false, false, false, false]],
                [[false, false, false, false, false],
                    [false, false, false, false, false],
                    [false, false, false, false, false],
                    [false, false, false, false, true],
                    [false, false, false, true, true]]];
            for (var i = 0; i < cellCoords.length; i++)
                if (cellCoords[i][subRow][subCol])
                    this.toggle3DCell(row, col, i);
        }
    } // parseClick ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Toggle the given cell on/off by updating the canvas and change the value in matrix2D.
     */
    toggle2DCell(row, col) {
        var numCellsSide = 3;
        if (row > numCellsSide || col > numCellsSide)
            return;
        this.matrix2D[col][row] = !this.matrix2D[col][row];
        this.draw2DCell(row, col);
    } // toggleGridElt ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Toggle the given cell on/off by updating the canvas and change the value in matrix3D.
     * d is the "depth" of the cell.
     */
    toggle3DCell(row, col, d) {
        var numCellsSide = 3;
        if (row > numCellsSide || col > numCellsSide)
            return;
        this.matrix3D[col][row][d] = !this.matrix3D[col][row][d];
        this.draw3DCells(row, col);
    } // toggle3DCell ()
} // class MemIFSParamCanvas
//======================================================================================================================
