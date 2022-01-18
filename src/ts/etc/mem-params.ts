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
//======================================================================================================================


    //==================================================================================================================
    // FIELDS

    /* The canvas to use for a parameter selector. */
    readonly canvas: HTMLCanvasElement;

    /* The canvas' context. */
    readonly ctx: CanvasRenderingContext2D;

    /* whether we're in 2d or 3d mode. */
    is2D: boolean;
    
    /* The boolean matrix representing the state of the 2D parameters. */
    matrix2D = [[true, true, true, true],
                [true, true, true, true],
                [true, true, true, true],
                [true, true, true, true]];

    /* The boolean matrix representing the state of the 3D parameters. */
    matrix3D = [[[true, true, true, true],
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
    private inc;

    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================


    //==================================================================================================================
    /**
     * The constructor for the MemIFSParamCanvas.
     *
     * @param canvas: The canvas to use as a MemIFSParamCanvas.
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.ctx.fillStyle = "blue";
        this.is2D = true;
        this.inc = 0;
        this.inc = 0;
        this.initializeCanvas();
    } // constructor ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Swap from 2D to 3D (or vice versa).
     */
    public swapDimension() {
        this.is2D = !this.is2D;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    } // swapDimension ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Set all of the cells to true.
     */
    public clearCells() {
        this.setCells(false);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    } // clearCells ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Set all of the cells to false.
     */
    public fillCells() {
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
    private setCells(value: boolean) {
        if (this.is2D) {
            for (var i = 0; i < this.matrix2D.length; i++) {
                for (var j = 0; j < this.matrix2D[0].length; j++) {
                    this.matrix2D[i][j] = value;
                }
            }
        } else {
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
    public drawGrid() {
        this.inc = this.canvas.width / 4;
        this.inc = this.canvas.width / 4;
        var drawEmpty = true;
        var numCellsSide = 3;
        for (var row = 0; row <= numCellsSide; row++) {
            for (var col = 0; col <= numCellsSide; col ++) {
                if (this.is2D) this.draw2DCell(row, col);
                else this.draw3DCells(row, col);
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
    private drawEmptyCell(row: number, col: number) {
        this.ctx.beginPath();
        this.ctx.rect(row*this.inc, col*this.inc, this.inc, this.inc);
        this.ctx.stroke();
    } // drawClearRect ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Draw the 2D cell based on the state of matrix2D at the given row and column.
     * 
     * @param row The row to draw the correct cell at.
     * @param col The column to draw the correct cell at.
     */
    private draw2DCell(row: number, col: number) {
        this.clearCell(row, col);
        this.ctx.beginPath();
        this.ctx.rect(row*this.inc, col*this.inc, this.inc, this.inc);
        this.ctx.fillStyle = this.matrix2D[row][col] ? "blue" : "white";
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
    private draw3DCells(row: number, col: number) {
        this.clearCell(row, col);
        var inc3D = this.inc * (1/6);
        this.ctx.beginPath();
        this.ctx.rect(row*this.inc, col*this.inc, this.inc, this.inc);
        this.ctx.stroke();
        for (var i = 3; i >= 0; i--) {
            this.ctx.beginPath();
            this.ctx.rect(row*this.inc + (i+0.5)*inc3D, col*this.inc + (i+0.5)*inc3D, 2*inc3D, 2*inc3D);
            this.ctx.fillStyle = this.matrix3D[row][col][i] ? "blue" : "white";
            this.ctx.fill();
            this.ctx.stroke();
        }
    } // draw3DCells()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Clear the cell at the given row/column position.
     * 
     * @param row The row of the cell to clear.
     * @param col The column of the cell to clear.
     */
    private clearCell(row: number, col: number) {
        this.ctx.clearRect(row*this.inc, col*this.inc, this.inc, this.inc);
    } // clearRect ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Initialize the canvas by adding the event listener for clicks.
     */
    private initializeCanvas() {
        var paramCanvas = this;
        function parseClick(e: MouseEvent) { paramCanvas.parseClick(e); }
        // Set up event listener for click enable/disable.
        this.canvas.addEventListener("mousedown", function(e) {
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
    private parseClick(event: MouseEvent) {
        var rect = this.canvas.getBoundingClientRect();
        var clickX = event.clientX - rect.left;
        var clickY = event.clientY - rect.top;
        var row = Math.floor(clickX / this.inc);
        var col = Math.floor(clickY / this.inc);
        if (this.is2D) {
            this.toggle2DCell(row, col);
        } else {
            var cellX = clickX % this.inc - (1/12)*this.inc;
            var cellY = clickY % this.inc - (1/12)*this.inc;
            if (cellX > (10/12)*this.inc || cellY > (10/12)*this.inc || cellX < 0 || cellY < 0) return;
            var inc3D = this.inc * (1/6);
            var subRow = Math.floor(cellX / inc3D);
            var subCol = Math.floor(cellY / inc3D);
            var cellCoords =
               [[[true,  true,  false, false, false],
                 [true,  true,  false, false, false],
                 [false, false, false, false, false],
                 [false, false, false, false, false],
                 [false, false, false, false, false]],
                [[false, false, false, false, false],
                 [false, false, true,  false, false],
                 [false, true,  true,  false, false],
                 [false, false, false, false, false],
                 [false, false, false, false, false]],
                [[false, false, false, false, false],
                 [false, false, false, false, false],
                 [false, false, false, true,  false],
                 [false, false, true,  true,  false],
                 [false, false, false, false, false]],
                [[false, false, false, false, false],
                 [false, false, false, false, false],
                 [false, false, false, false, false],
                 [false, false, false, false, true],
                 [false, false, false, true,  true]]];
            for (var i = 0; i < cellCoords.length; i++) {
                if (cellCoords[i][subRow][subCol]) this.toggle3DCell(row, col, i);
            }
        }
    } // parseClick ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Toggle the given cell on/off by updating the canvas and change the value in matrix2D.
     * 
     * @param row The row of the cell.
     * @param col The column of the cell.
     */
    private toggle2DCell(row: number, col: number) {
        var numCellsSide = 3;
        if (row > numCellsSide || col > numCellsSide) return;
        this.matrix2D[row][col] = !this.matrix2D[row][col];
        this.draw2DCell(row, col);
    } // toggleGridElt ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Toggle the given cell on/off by updating the canvas and change the value in matrix3D.
     * 
     * @param row The row of the cell.
     * @param col The column of the cell.
     * @param d The "depth" of the cell (0, 1, 2, 3)
     */
    private toggle3DCell(row: number, col: number, d: number) {
        var numCellsSide = 3;
        if (row > numCellsSide || col > numCellsSide) return;
        this.matrix3D[row][col][d] = !this.matrix3D[row][col][d];
        this.draw3DCells(row, col);
    } // toggle3DCell ()
    //==================================================================================================================


//======================================================================================================================
} // class MemIFSParamCanvas
//======================================================================================================================
