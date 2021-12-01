//======================================================================================================================
// TYPES
//======================================================================================================================


    //==================================================================================================================
    /**
     * A type representing the color/transparency of a pixel.
     */
    type PxGraphics = {
        r: number;
        g: number;
        b: number;
        a: number // alpha.
    } // type PxGraphics
    //==================================================================================================================


    //==================================================================================================================
    /**
     * A type for a coordinate on the canvas.
     */
    type PxCoord = {
        x: number;
        y: number;
    }; // type PxCoord
    //==================================================================================================================


    //==================================================================================================================
    /**
     * A type for a parameterized affine transform (see notes)
     */
    type AffineParam = {
        r: number;
        s: number;
        thetaD: number;
        phiD: number;
        e: number;
        f: number;
    }; // type AffineParam
    //==================================================================================================================


    //==================================================================================================================
    /**
     * A class representing a Deterministic IFS.
     */
    class DetIFS {
    //==================================================================================================================


        //==============================================================================================================
        // FIELDS

        /* The context to draw with. */
        readonly ctx: CanvasRenderingContext2D;

        /* The width of the canvas in pixels. */
        readonly width: number;

        /* The height of the canvas in pixels. */
        readonly height: number;

        /* The matrices representing affine transforms for this IFS. */
        readonly affineTransformMatrices: number[][];

        /* The number of iterations performed on this IFS. */
        numIters: number;

        /* The maximum number of iterations possible. */
        readonly maxIters: number;
        //==============================================================================================================


        //==============================================================================================================
        // INSTANCE METHODS
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Default constructor for the DetIFS.
         * 
         * @param ctx The CanvasRenderingContext2D to use for drawing.
         * @param w The width of the canvas.
         * @param h The height of the canvas.
         * @param transformParams An array of AffineParams to describe the IFS.
         */
        constructor(ctx: CanvasRenderingContext2D, w: number, h: number, transformParams: AffineParam[]) {
            this.ctx = ctx;
            this.width = w;
            this.height = h;
            this.numIters = 0;
            this.affineTransformMatrices = [];
            this.maxIters = this.findMaxIters(transformParams);

            transformParams.forEach(t => {
                this.affineTransformMatrices.push(
                    DetIFS.invertAffineMatrix(this.createAffineMatrix(t.r, t.s, t.thetaD, t.phiD, t.e, t.f))
                );
            })
        } // constructor ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Calculate the maximum number of iterations for the IFS based on the input image, canvas dimensions,
         * and minimum scaling factor of the transformations.
         * 
         * @param transformParams The transformaton parameters.
         * @returns The maximum number of iterations.
         */
        private findMaxIters(transformParams: AffineParam[]): number {
            var minDim = this.findMinDrawingDimension();
            var minScalingFactor = DetIFS.findMinScalingFactor(transformParams);
            // if square of minDim, how many times can we multiply by minScalingFactor to get to 1?
            //  i = log_{minScalingFactor}(1/minDim)
            return Math.floor(Math.log(1/minDim) / Math.log(minScalingFactor))
        } // findMaxIters ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Find the minimum on the x or y axis of drawn pixels.
         */
        private findMinDrawingDimension(): number {
            var iD = this.ctx.getImageData(0, 0, this.width, this.height);
            var minX = this.width;
            var maxX = 0;
            var minY = this.height;
            var maxY = 0;
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    if (iD.data[(y*iD.width + x)*4 + 3] != 0) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            return Math.min(maxX-minX, maxY-minY);
        }// findMinDrawingDimension ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Apply an iteration of the IFS.
         */
        public applyTransform(): void {
            if (this.numIters < this.maxIters) {
                var transformedImageData = this.getTransformedImageData();
                this.ctx.putImageData(transformedImageData, 0, 0);
                this.numIters++;
            }
        } // applyTransform ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Get an ImageData object representing the next iteration of the IFS based on the provided affine 
         * transformation. To do this, we look at each pixel in the *output* ImageData, apply each of the inverse 
         * transformations, and see if there is a non-transparent pixel for any of them. If so, we set the output
         * pixel to one of the colors.
         * 
         * @param matrices Affine transform matrices representing the IFS.
         * @returns The ImageData transformed according to the IFS.
         */
        private getTransformedImageData(): ImageData {
            var iD = this.ctx.createImageData(width, height);
            var oldID = this.ctx.getImageData(0, 0, width, height);
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var coordTo: PxCoord = { x: x, y: y };
                    var transformedPx: PxGraphics[] = [];
                    this.affineTransformMatrices.forEach(matrix => {
                        var coordFrom = DetIFS.applyAffineMatrix(matrix, coordTo);
                        this.convertCoord(coordTo);
                        this.convertCoord(coordFrom);
                        if (coordFrom.x >= 0 && coordFrom.x < width && coordFrom.y >= 0 && coordFrom.y < height)  {
                            var oldDataIdx = (coordFrom.x*width + coordFrom.y)*4;
                            if (DetIFS.getAlpha(oldID, coordFrom) > 0 || DetIFS.getAlpha(iD, coordTo) == 0)
                                this.copyPixel(oldID, coordFrom, iD, coordTo);
                        }
                    });
                }
            }
            return iD;
        } // getTransformedImageData ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Convert the PxCoord c such that the origin is in the bottom left of the canvas.
         * 
         * @param c The PxCoord to convert.
         */
        private convertCoord(c: PxCoord): void {
            c.y = this.height - c.y;
        } // convertCoord ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Create a "matrix" representing a parameterized affine transformation.
         * 
         * @params See documentation.
         * @returns A number[]: [a, b, c, d, e, f]
         */
        createAffineMatrix(r: number, s: number, thetaD: number, phiD: number, e: number, f: number): number[] {
            var theta = DetIFS.toRadians(thetaD);
            var phi = DetIFS.toRadians(phiD);
            return [r*Math.cos(theta), -s*Math.sin(phi), r*Math.sin(theta), s*Math.cos(phi), e*this.width, 
                    f*this.height];
        } // createAffineMatrix
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Copy the value of a pixel at PxCoord c1 on ImageData id1 to PxCoord c2 on ImageData id2.
         * 
         * @param iD1   The ImageData to copy from.
         * @param c1    The PxCoord to copy from.
         * @param iD2   The ImageData to copy to.
         * @param c2    The PxCoord teo copy to.
         */
        private copyPixel(iD1: ImageData, c1: PxCoord, iD2: ImageData, c2: PxCoord): void {
            // Convert coordinates of c1 and c2 such that origin is in bottom left.
            for (var i = 0; i < 4; i++)
                iD2.data[(c2.y*this.width + c2.x)*4 + i] = iD1.data[(c1.y*this.width + c1.x)*4 + i];
        } // copyPixel ()
        //==============================================================================================================


        //==============================================================================================================
        // END INSTANCE METHODS
        //==============================================================================================================


        //==============================================================================================================
        // STATIC METHODS
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Find the minimum scaling factor (r or s) of the given transformation parameters.
         * 
         * @param transformParams The transformation parameters of interest.
         * @returns The minimum scaling factor of transformParams.
         */
        static findMinScalingFactor(transformParams: AffineParam[]) {
            var min: number = Number.MAX_VALUE
            transformParams.forEach(t => {
                if (t.r < min) min = t.r;
                if (t.s < min) min = t.s;
            })
            return min;
        } // findMinScalingFactor ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Get the alpha value of the given PxCoord on the given ImageData.
         * 
         * @param iD The ImageData to look at.
         * @param c The coordiante to look at.
         * @returns The alpha value.
         */
        static getAlpha(iD: ImageData, c: PxCoord) {
            return iD.data[(c.y*iD.width + c.x)*4 + 3];
        } // getAlpha ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Convert an angle in degrees to an angle in radians.
         * 
         * @param angleDegs The degree measurement of the angle.
         * @returns The radian measurement of the angle.
         */
        static toRadians(angleDegs: number): number {
            return angleDegs * (Math.PI / 180);
        } // toRadians ()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Invert a matrix which represents an affine transformation.
         * 
         * @param affineMatrix The affine matrix (from createAffineMatrix) to invert.
         * @returns The inverted affine matrix.
         */
        static invertAffineMatrix(affineMatrix: number[]): number[] {
            var det = affineMatrix[0]*affineMatrix[3] - affineMatrix[1]*affineMatrix[2];
            if (det == 0) throw new Error("Attempted to invert noninvertible affine matrix.");
            var invDet = 1/det;
            return [invDet*affineMatrix[3], -invDet*affineMatrix[1], -invDet*affineMatrix[2], invDet*affineMatrix[0], 
                    invDet*(affineMatrix[1]*affineMatrix[5] - affineMatrix[3]*affineMatrix[4]),
                    invDet*(affineMatrix[2]*affineMatrix[4] - affineMatrix[0]*affineMatrix[5])];
        } // invertAffineMatrix()
        //==============================================================================================================


        //==============================================================================================================
        /**
         * Apply the affine transformation represented by the given matrix to the given coordinate.
         * 
         * @param matrix The matrix representing the affine transformation.
         * @param c A PxCoord representing the coordinate that we would like to transform.
         * @returns A PXCoord of the transformed coordinate c.
         */
        static applyAffineMatrix(matrix: number[], c: PxCoord): PxCoord {
            var c2: PxCoord = {
                x: Math.floor(matrix[0]*c.x + matrix[1]*c.y + matrix[4]),
                y: Math.floor(matrix[2]*c.x + matrix[3]*c.y + matrix[5]),
            };
            return c2;
        } // applyAffineMatrix ()
        //==============================================================================================================


        //==============================================================================================================
        // END STATIC METHODS
        //==============================================================================================================


    //==================================================================================================================
    } // class DetIFS
    //==================================================================================================================


//======================================================================================================================
// END TYPES
//======================================================================================================================


//======================================================================================================================
// TEMP FUNCTION

//======================================================================================================================


//======================================================================================================================
// INITIALIZATION
const canvas = <HTMLCanvasElement>document.getElementById('fractal-canvas');
const ctx = canvas.getContext('2d')!;
const maxDimension = Math.floor(Math.min(window.innerWidth*.5, window.innerHeight*.9));

const height = maxDimension;
const width = maxDimension;

canvas.height = height;
canvas.width = width;

reDraw();

var detIFS = createIFSFromTable();
//======================================================================================================================


//======================================================================================================================
// TEMP FUNCTIONS
function reDraw() {
    ctx.fillStyle = "blue";
    ctx.putImageData(ctx.createImageData(width, height), 0, 0);
    //ctx.rect(0, 0, width, height);
    ctx.rect(width / 4, height / 4, width / 2, height / 2);
    ctx.fill();
} // reDraw ()
//======================================================================================================================



//======================================================================================================================
// BUTTON FUNCTIONS 
function addRow() {
    var affineTable = <HTMLTableElement>document.getElementById("affineTable");
    var nRows: number = affineTable.rows.length;
    var row = affineTable.insertRow(nRows);
    for (var i = 0; i < 6; i++) {
        var cell = row.insertCell(i);
        cell.contentEditable = "true";
        cell.innerHTML = "0";
    }
} // addRow ()

function deleteLastRow() {
    var affineTable: HTMLTableElement = <HTMLTableElement>document.getElementById("affineTable");
    var nRows: number = affineTable.rows.length;
    if (nRows > 2) {
        affineTable.deleteRow(nRows-1);
    }
} // deleteLastRow ()

function createIFSFromTable(): DetIFS {
    var affineTable: HTMLTableElement = <HTMLTableElement>document.getElementById("affineTable");
    var affineParams: AffineParam[] = [];
    var nRows: number = affineTable.rows.length;
    for (var i = 1; i < nRows; i++) {
        var row = affineTable.rows[i];
        var thisRowParam: AffineParam = {
            r:      +row.cells[0].innerHTML,
            s:      +row.cells[1].innerHTML,
            thetaD: +row.cells[2].innerHTML,
            phiD:   +row.cells[3].innerHTML,
            e:      +row.cells[4].innerHTML,
            f:      +row.cells[5].innerHTML
        }
        affineParams.push(thisRowParam);
    }
    var detIFS: DetIFS = new DetIFS(ctx, width, height, affineParams);
    return detIFS;
} // createIFSFromTable ()

function resetIFS() {
    moveDrawing();
    detIFS = createIFSFromTable();
} // resetIFS ()

function runIteration() {
    detIFS.applyTransform(); 
} // runIteration ()

function moveDrawing() {
    var otherCanvas = <HTMLCanvasElement>document.getElementById('drawing-canvas');
    var otherCtx = otherCanvas.getContext('2d')!;
    ctx.putImageData(otherCtx.getImageData(0, 0, width, height), 0, 0);
} // moveDrawing ()
//======================================================================================================================


//======================================================================================================================
// BUTTON SETUP
var runIterButton = document.getElementById("runIter")!;
runIterButton.onclick = runIteration;

var addRowButton = document.getElementById("addRow")!;
addRowButton.onclick = addRow;

var delRowButton = document.getElementById("delRow")!;
delRowButton.onclick = deleteLastRow;

var resetIFSButton = document.getElementById("resIFS")!;
resetIFSButton.onclick = resetIFS;

var moveDrawingButton = document.getElementById("moveDr")!;
moveDrawingButton.onclick = moveDrawing;
//======================================================================================================================