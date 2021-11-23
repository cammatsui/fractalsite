//======================================================================================================================
var rawCanvas = document.getElementById('canvas');
var canvas = (rawCanvas as HTMLCanvasElement);
const ctx = (canvas as HTMLCanvasElement).getContext('2d');
var maxDimension = Math.min(window.innerHeight*.8, window.innerWidth*.9);

const height = maxDimension;
const width = maxDimension;
(canvas as HTMLCanvasElement).height = height;
(canvas as HTMLCanvasElement).width = width;
//======================================================================================================================


//======================================================================================================================
function getTransformedImageData(ctx, width, height, matrices){
    var imageData = ctx.createImageData(width, height)
    var oldImageData = ctx.getImageData(0, 0, width, height);
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            for (var i = 0; i < matrices.length; i++) {
                var matrix = matrices[i];
                var newX = Math.floor(matrix[0]*x + matrix[1]*y + matrix[4]);
                var newY = Math.floor(matrix[2]*x + matrix[3]*y + matrix[5]);
                if (newX >= 0 && newX < width && newY >= 0 && newY < height)
                    copyPixels(oldImageData, x, y, imageData, newX, newY);
            }
        }
    }
    return imageData;
} // getTransformedImageData ()
//======================================================================================================================



//======================================================================================================================
function copyPixels(imageData1, x1, y1, imageData2, x2, y2) {
    for (var i = 0; i < 4; i++)
        imageData2.data[(y2*imageData1.width + x2)*4 + i] = imageData1.data[(y1*imageData1.width + x1)*4 + i];
} // copyPixels ()
//======================================================================================================================




//======================================================================================================================
function createAffineMatrix(width, height, r, s, theta, phi, e, f) {
    return [r*Math.cos(theta), -s*Math.sin(phi), r*Math.sin(theta), s*Math.cos(phi), e*width, f*height];
} // createAffineMatrix ()
//======================================================================================================================



//======================================================================================================================
ctx.fillStyle = "red";
ctx.rect(0, 0, width/2, height/2);
ctx.fill();

var matrices = [[.5, 0, .5, 0, 0, 0],
                [.5, 0, .5, 0, .5, 0],
                [.5, 0, .5, 0, 0, .5]]

matrices = [createAffineMatrix(width, height, 0.5, 0.5, 0, 0, 0, 0),
            createAffineMatrix(width, height, 0.5, 0.5, 0, 0, 0.5, 0),
            createAffineMatrix(width, height, 0.5, 0.5, 0, 0, 0, 0.5)];


function runIteration() {
    console.log("test")
    var transImageData = getTransformedImageData(ctx, width, height, matrices);
    ctx.putImageData(transImageData, 0, 0);

    ctx.globalCompositeOperation = "copy";
    ctx.scale( 1, 1 ); // so 500x500
    // newest browsers can control interpolation quality
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage( canvas, 0, 0 );

    // clean
    ctx.globalCompositeOperation = "source-over";
    ctx.setTransform( 1, 0, 0, 1, 0, 0);
}


document.getElementById("runIter").onclick = runIteration;
//======================================================================================================================

//======================================================================================================================
/**
 * Plan:
 *  Check that each Affine Transformation is Invertible.
 *  Invert each Affine Transformation as "inverses"
 *  Create new ImageData imageData.
 *  Loop through each pixel of imageData, apply inverse transformation, round, and set pixel at this value on original
 *  canvas to this.
 */
//======================================================================================================================