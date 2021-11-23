var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var maxDimension = Math.min(window.innerHeight * 0.95, window.innerWidth);
canvas.height = maxDimension;
canvas.width = maxDimension;

//ctx.setTransform(1, .5, .8, 1, 0, 0);


drawCircle(50, 50, 50, 0, "red", "", "")
var imageData = ctx.getImageData(0, 0, 100, 100);
ctx.putImageData(imageData, 50, 50)


function affineTransformImageData(ctx, imageData, mat) {
    var height = imageData.height;
    var width = imageData.width;
    var pixelData = imageData.data;
    var transformedImageData = ctx.createImageData(width, height);
    var pixelData = ctx.getImageData(0, 0, width, height).data;
    var transformedPixelData = transformedImageData.data;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            // mat = [a, b, c, d, e, f];
            var newX = Math.floor(mat[0]*x + mat[1]*y + mat[4]);
            var newY = Math.floor(mat[2]*x + mat[3]*y + mat[5]);
            if (newX >= 0 && newX <= width && newY >= 0 && newY <= height) {
                // Copy each color channel
                for (var i = 0; i < 4; i++)
                    transformedPixelData[(y*width + x)*4 + i] = pixelData[(newY + width*newX)*4 + i];
            }
        }
    }
    return transformedImageData;
}

function compactUnion(pixelSets, backgroundColor) {
    return 0;
}