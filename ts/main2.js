//======================================================================================================================
// INITIALIZATION
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var maxDimension = Math.ceil(Math.min(window.innerHeight * .8, window.innerHeight * .9));
var height = maxDimension;
var width = maxDimension;
canvas.height = height;
canvas.width = width;
//======================================================================================================================
//======================================================================================================================
// FUNCTIONS
//======================================================================================================================
//==================================================================================================================
/**
 * Copy the value of a pixel at PxCoord c1 on ImageData id1 to PxCoord c2 on ImageData id2.
 *
 * @param iD1   The ImageData to copy from.
 * @param c1    The PxCoord to copy from.
 * @param iD2   The ImageData to copy to.
 * @param c2    The PxCoord teo copy to.
 */
function copyPixel(iD1, c1, iD2, c2) {
    for (var i = 0; i < 4; i++)
        iD2.data[(c2.y * iD1.width + c2.x) * 4 + i] = iD1.data[(c1.y * iD1.width + c1.x) * 4 + i];
} // copyPixel ()
//==================================================================================================================
//==================================================================================================================
/**
 * Create a "matrix" representing a parameterized affine transformation.
 *
 * @params See documentation.
 * @returns A number[]: [a, b, c, d, e, f]
 */
function createAffineMatrix(r, s, theta, phi, e, f) {
    return [r * Math.cos(theta), -s * Math.sin(phi), r * Math.sin(theta), s * Math.cos(phi), e * width, f * height];
} // createAffineMatrix
//==================================================================================================================
//==================================================================================================================
function getTransformedImageData(matrices) {
    var iD = ctx.createImageData(width, height);
    var oldID = ctx.getImageData(0, 0, width, height);
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            matrices.forEach(function (matrix) {
                var coordFrom = { x: x, y: y };
                var coordTo = applyAffineMatrix(matrix, coordFrom);
                if (coordTo.x >= 0 && coordTo.x < width && coordTo.y >= 0 && coordTo.y < height)
                    copyPixel(oldID, coordFrom, iD, coordTo);
            });
        }
    }
    return iD;
} // getTransformedImageData ()
//==================================================================================================================
//==================================================================================================================
function applyAffineMatrix(matrix, c) {
    var c2 = {
        x: Math.floor(matrix[0] * c.x + matrix[1] * c.y + matrix[4]),
        y: Math.floor(matrix[2] * c.x + matrix[3] * c.y + matrix[5])
    };
    return c2;
} // applyAffineMatrix ()
//==================================================================================================================
//======================================================================================================================
var affineMatrices = [
    createAffineMatrix(0.5, 0.5, 0, 0, 0, 0.5),
    createAffineMatrix(0.5, 0.5, 0, 0, 0.5, 0),
    createAffineMatrix(0.5, 0.5, 0, 0, 0, 0)
];
affineMatrices = [
    createAffineMatrix(0.333, 0.333, 0, 0, 0, 0),
    createAffineMatrix(0.333, 0.333, 1.0472, 1.0472, 0.333, 0),
    createAffineMatrix(0.333, 0.333, -1.0472, -1.0472, 0.5, 0.289),
    createAffineMatrix(0.333, 0.333, 0, 0, 0.667, 0),
];
ctx.fillStyle = "red";
ctx.rect(0, 0, width, height);
ctx.fill();
function runIteration() {
    console.log("test");
    var transImageData = getTransformedImageData(affineMatrices);
    ctx.putImageData(transImageData, 0, 0);
}
document.getElementById("runIter").onclick = runIteration;
//======================================================================================================================
