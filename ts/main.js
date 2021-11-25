//======================================================================================================================
// INITIALIZATION
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var maxDimension = Math.floor(Math.min(window.innerHeight * .8, window.innerHeight * .9));
var height = maxDimension;
var width = maxDimension;
canvas.height = height;
canvas.width = width;
//==================================================================================================================
//==================================================================================================================
/**
 * A class representing a Deterministic IFS.
 */
var DetIFS = /** @class */ (function () {
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
    function DetIFS(ctx, w, h, transformParams) {
        var _this = this;
        this.ctx = ctx;
        this.width = w;
        this.height = height;
        this.numIters = 0;
        this.affineTransformMatrices = [];
        transformParams.forEach(function (t) {
            _this.affineTransformMatrices.push(DetIFS.invertAffineMatrix(_this.createAffineMatrix(t.r, t.s, t.thetaD, t.phiD, t.e, t.f)));
        });
    } // constructor ()
    //==============================================================================================================
    //==============================================================================================================
    // INSTANCE METHODS
    //==============================================================================================================
    //==============================================================================================================
    /**
     * Apply an iteration of the IFS.
     */
    DetIFS.prototype.applyTransform = function () {
        var transformedImageData = this.getTransformedImageData();
        this.ctx.putImageData(transformedImageData, 0, 0);
        this.numIters++;
        console.log(this.numIters);
    }; // applyTransform ()
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
    DetIFS.prototype.getTransformedImageData = function () {
        var _this = this;
        var iD = this.ctx.createImageData(width, height);
        var oldID = this.ctx.getImageData(0, 0, width, height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.affineTransformMatrices.forEach(function (matrix) {
                    var coordTo = { x: x, y: y };
                    var coordFrom = DetIFS.applyAffineMatrix(matrix, coordTo);
                    if (coordFrom.x >= 0 && coordFrom.x < width && coordFrom.y >= 0 && coordFrom.y < height) {
                        if ((coordFrom.y * width + coordFrom.x) * 4 + 4 > 0) // alpha > 0
                            _this.copyPixel(oldID, coordFrom, iD, coordTo);
                    }
                });
            }
        }
        return iD;
    }; // getTransformedImageData ()
    //==============================================================================================================
    //==============================================================================================================
    /**
     * Convert the PxCoord c such that the origin is in the bottom left of the canvas.
     *
     * @param c The PxCoord to convert.
     */
    DetIFS.prototype.convertCoord = function (c) {
        c.y = this.height - c.y;
    }; // convertCoord ()
    //==============================================================================================================
    //==============================================================================================================
    /**
     * Create a "matrix" representing a parameterized affine transformation.
     *
     * @params See documentation.
     * @returns A number[]: [a, b, c, d, e, f]
     */
    DetIFS.prototype.createAffineMatrix = function (r, s, thetaD, phiD, e, f) {
        var theta = DetIFS.toRadians(thetaD);
        var phi = DetIFS.toRadians(phiD);
        return [r * Math.cos(theta), -s * Math.sin(phi), r * Math.sin(theta), s * Math.cos(phi), e * this.width,
            f * this.height];
    }; // createAffineMatrix
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
    DetIFS.prototype.copyPixel = function (iD1, c1, iD2, c2) {
        // Convert coordinates of c1 and c2 such that origin is in bottom left.
        this.convertCoord(c1);
        this.convertCoord(c2);
        for (var i = 0; i < 4; i++)
            iD2.data[(c2.y * this.width + c2.x) * 4 + i] = iD1.data[(c1.y * this.width + c1.x) * 4 + i];
    }; // copyPixel ()
    //==============================================================================================================
    //==============================================================================================================
    // END INSTANCE METHODS
    //==============================================================================================================
    //==============================================================================================================
    // STATIC METHODS
    //==============================================================================================================
    //==============================================================================================================
    /**
     * Convert an angle in degrees to an angle in radians.
     *
     * @param angleDegs The degree measurement of the angle.
     * @returns The radian measurement of the angle.
     */
    DetIFS.toRadians = function (angleDegs) {
        return angleDegs * (Math.PI / 180);
    }; // toRadians ()
    //==============================================================================================================
    //==============================================================================================================
    /**
     * Invert a matrix which represents an affine transformation.
     *
     * @param affineMatrix The affine matrix (from createAffineMatrix) to invert.
     * @returns The inverted affine matrix.
     */
    DetIFS.invertAffineMatrix = function (affineMatrix) {
        var det = affineMatrix[0] * affineMatrix[3] - affineMatrix[1] * affineMatrix[2];
        if (det == 0)
            throw new Error("Attempted to invert noninvertible affine matrix.");
        var invDet = 1 / det;
        return [invDet * affineMatrix[3], -invDet * affineMatrix[1], -invDet * affineMatrix[2], invDet * affineMatrix[0],
            invDet * (affineMatrix[1] * affineMatrix[5] - affineMatrix[3] * affineMatrix[4]),
            invDet * (affineMatrix[2] * affineMatrix[4] - affineMatrix[0] * affineMatrix[5])];
    }; // invertAffineMatrix()
    //==============================================================================================================
    //==============================================================================================================
    /**
     * Apply the affine transformation represented by the given matrix to the given coordinate.
     *
     * @param matrix The matrix representing the affine transformation.
     * @param c A PxCoord representing the coordinate that we would like to transform.
     * @returns A PXCoord of the transformed coordinate c.
     */
    DetIFS.applyAffineMatrix = function (matrix, c) {
        var c2 = {
            x: Math.floor(matrix[0] * c.x + matrix[1] * c.y + matrix[4]),
            y: Math.floor(matrix[2] * c.x + matrix[3] * c.y + matrix[5])
        };
        return c2;
    }; // applyAffineMatrix ()
    return DetIFS;
}()); // class DetIFS
//==================================================================================================================
//======================================================================================================================
// END TYPES
//======================================================================================================================
//======================================================================================================================
var affineParams = [
    { r: 0.5, s: 0.5, thetaD: 0, phiD: 0, e: 0, f: 0 },
    { r: 0.5, s: 0.5, thetaD: 0, phiD: 0, e: 0.5, f: 0 },
    { r: 0.5, s: 0.5, thetaD: 0, phiD: 0, e: 0, f: 0.5 },
];
function runIteration() { detIFS.applyTransform(); }
;
ctx.fillStyle = "blue";
ctx.rect(width / 4, height / 4, width / 2, height / 2);
ctx.rect(0, 0, width, height);
ctx.fill();
var detIFS = new DetIFS(ctx, width, height, affineParams);
var runIterButton = document.getElementById("runIter");
runIterButton.onclick = runIteration;
//======================================================================================================================
