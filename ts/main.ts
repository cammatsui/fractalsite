//======================================================================================================================
// INITIALIZATION
const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const maxDimension = Math.min(window.innerHeight*.8, window.innerHeight*.9);

const height = maxDimension;
const width = maxDimension;

canvas.height = height;
canvas.width = width;
//======================================================================================================================



//======================================================================================================================
// TYPES
type PxCoord = {
    x: number;
    y: number;
};
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
    function copyPixel(iD1: ImageData, c1: PxCoord, iD2: ImageData, c2: PxCoord): void {
        for (var i = 0; i < 4; i++)
            iD2.data[(c2.y*iD1.width + c2.x)*4 + i] = iD1.data[(c1.y*iD1.width + c1.x)*4 + i];
    } // copyPixel ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Create a "matrix" representing a parameterized affine transformation.
     * 
     * @params See documentation.
     * @returns A number[]: [a, b, c, d, e, f]
     */
    function createAffineMatrix(r: number, s: number, theta: number, phi: number, e: number, f: number): number[] {
        return [r*Math.cos(theta), -s*Math.sin(phi), r*Math.sin(theta), s*Math.cos(phi), e*width, f*height];
    } // createAffineMatrix
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Invert a matrix which represents an affine transformation.
     * 
     * @param affineMatrix The affine matrix (from createAffineMatrix) to invert.
     * @returns The inverted affine matrix.
     */
    function invertAffineMatrix(affineMatrix: number[]): number[] {
        var det = affineMatrix[0]*affineMatrix[3] - affineMatrix[1]*affineMatrix[2];
        if (det == 0) throw new Error("Attempted to invert noninvertible affine matrix.");
        var invDet = 1/det;
        return [invDet*affineMatrix[3], -invDet*affineMatrix[1], -invDet*affineMatrix[2], invDet*affineMatrix[0], 
                -affineMatrix[4], -affineMatrix[5]];
    } // invertAffineMatrix()
    //==================================================================================================================


    //==================================================================================================================
    function getTransformedImageData(matrices: number[][]): ImageData {
        var iD = ctx.createImageData(width, height);
        var oldID = ctx.getImageData(0, 0, width, height);
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                matrices.forEach(matrix => {
                    var coordTo: PxCoord = { x: x, y: y };
                    var coordFrom = applyAffineMatrix(matrix, coordTo);
                    if (coordFrom.x >= 0 && coordFrom.x < width && coordFrom.y >= 0 && coordFrom.y < height)  {
                        if ((coordFrom.y*width + coordFrom.x)*4 + 4 > 0) // alpha > 0
                            copyPixel(oldID, coordFrom, iD, coordTo);
                    }
                })
            }
        }
        return iD;
    } // getTransformedImageData ()
    //==================================================================================================================



    //==================================================================================================================
    function applyAffineMatrix(matrix: number[], c: PxCoord): PxCoord {
        var c2: PxCoord = {
            x: Math.floor(matrix[0]*c.x + matrix[1]*c.y + matrix[4]),
            y: Math.floor(matrix[2]*c.x + matrix[3]*c.y + matrix[5]),
        };
        return c2;
    } // applyAffineMatrix ()
    //==================================================================================================================


    //==================================================================================================================
    var affineMatrices = [
        createAffineMatrix(0.5, 0.5, 0, 0, 0, 0.5),
        createAffineMatrix(0.5, 0.5, 0, 0, 0.5, 0),
        createAffineMatrix(0.5, 0.5, 0, 0, 0,   0)
    ];

    var inverseAffineMatrices = [
        invertAffineMatrix(affineMatrices[0]),
        invertAffineMatrix(affineMatrices[1]),
        invertAffineMatrix(affineMatrices[2]),
    ];
    //==================================================================================================================




//======================================================================================================================
ctx.fillStyle = "red";
ctx.rect(0, 0, width, height);
ctx.fill();

function runIteration() {
    console.log("test");
    var transImageData = getTransformedImageData(inverseAffineMatrices);
    ctx.putImageData(transImageData, 0, 0);
}

document.getElementById("runIter").onclick = runIteration;
//======================================================================================================================
