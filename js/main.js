var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var maxDimension = Math.min(window.innerHeight * 0.95, window.innerWidth);
canvas.height = maxDimension;
canvas.width = maxDimension;

function affineTransform(ctx, r, s, theta, phi, e, f) {
    var a = r * Math.cos(theta);
    var b = -s * Math.sin(phi);
    var c = r * Math.sin(theta);
    var d = s * Math.cos(phi);  
    var e2 = e * canvas.width;
    var f2 = f * canvas.height;
    ctx.transform(a, b, c, d, e2, f2);
}

function copyImageData(ctx, source) {
    var copiedImageData = ctx.createImageData(source.width, source.height);
    copiedImageData.data.set(source.data);
    return copiedImageData;
}

ctx.fillStyle = "red";
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fill();

var copiedImageData = copyImageData(ctx, ctx.getImageData(0, 0, canvas.width, canvas.height));

ctx.putImageData(ctx.createImageData(canvas.width, canvas.height), 0, 0);

ctx.save();
ctx.transform(0.5, 0, 0, 0.5, 0, 0);
ctx.putImageData(copiedImageData, 0, 0);
ctx.restore();


//affineTransform(ctx, 0.5, 0.5, 0, 0, 0, 0);