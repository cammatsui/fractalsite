//======================================================================================================================
/**
 * @file affine-transform.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 *
 * Utililties for affine transforms.
 */
//======================================================================================================================
//======================================================================================================================
/**
 * Create a "matrix" representing a parameterized affine transformation.
 *
 * @params See documentation.
 * @returns A number[]: [a, b, c, d, e, f]
 */
export function createAffineMatrix(r, s, theta, phi, e, f, width, height) {
    return [r * Math.cos(theta), -s * Math.sin(phi), r * Math.sin(theta), s * Math.cos(phi), e * width, f * height];
} // createAffineMatrix ()
//======================================================================================================================
//======================================================================================================================
/**
 * Copy the value of a pixel at Coordinate c1 on ImageData id1 to Coordinate c2 on ImageData id2.
 *
 * @param iD1   The ImageData to copy from.
 * @param c1    The Coordinate to copy from.
 * @param iD2   The ImageData to copy to.
 * @param c2    The Coordinate teo copy to.
 * @param width The canvas width.
 */
export function copyPixel(iD1, c1, iD2, c2, width) {
    for (var i = 0; i < 4; i++)
        iD2.data[(c2.y * width + c2.x) * 4 + i] = iD1.data[(c1.y * width + c1.x) * 4 + i];
} /// copyPixel ()
//======================================================================================================================
//======================================================================================================================
/**
 * Invert a matrix which represents an affine transformation.
 *
 * @param affineMatrix The affine matrix (from createAffineMatrix) to invert.
 * @returns The inverted affine matrix.
 */
export function invertAffineMatrix(affineMatrix) {
    var det = affineMatrix[0] * affineMatrix[3] - affineMatrix[1] * affineMatrix[2];
    if (det == 0)
        throw new Error("Attempted to invert noninvertible affine matrix.");
    var invDet = 1 / det;
    return [invDet * affineMatrix[3], -invDet * affineMatrix[1], -invDet * affineMatrix[2], invDet * affineMatrix[0],
        invDet * (affineMatrix[1] * affineMatrix[5] - affineMatrix[3] * affineMatrix[4]),
        invDet * (affineMatrix[2] * affineMatrix[4] - affineMatrix[0] * affineMatrix[5])];
} // invertAffineMatrix ()
//======================================================================================================================
//======================================================================================================================
/**
 * Convert the Coordinate c such that the origin is in the bottom left of the canvas.
 *
 * @param c The Coordinate to convert.
 * @param height The height of the canvas.
 */
export function convertCoord(c, height) {
    c.y = height - c.y;
} // convertCoord ()
//======================================================================================================================
//======================================================================================================================
/**
 * Apply the affine transformation represented by the given matrix to the given coordinate.
 *
 * @param matrix The matrix representing the affine transformation.
 * @param c A PxCoord representing the coordinate that we would like to transform.
 * @returns A PXCoord of the transformed coordinate c.
 */
export function applyAffineMatrix(matrix, c) {
    var c2 = {
        x: Math.floor(matrix[0] * c.x + matrix[1] * c.y + matrix[4]),
        y: Math.floor(matrix[2] * c.x + matrix[3] * c.y + matrix[5]),
    };
    return c2;
} // applyAffineMatrix ()
//======================================================================================================================
//======================================================================================================================
/**
 * Get the alpha value of the given PxCoord on the given ImageData.
 *
 * @param iD The ImageData to look at.
 * @param c The coordiante to look at.
 * @returns The alpha value.
 */
export function getAlpha(iD, c) {
    return iD.data[(c.y * iD.width + c.x) * 4 + 3];
} // getAlpha ()
//======================================================================================================================
//======================================================================================================================
/**
 * Get an ImageData object representing the next iteration of the IFS based on the provided affine
 * transformation. To do this, we look at each pixel in the *output* ImageData, apply each of the inverse
 * transformations, and see if there is a non-transparent pixel for any of them. If so, we set the output
 * pixel to one of the colors.
 *
 * @param ctx       The canvas context.
 * @param width     The canvas width.
 * @param height    The canvas height.
 * @param affineTransformMatrices  Affine transform matrices representing the IFS.
 * @returns The ImageData transformed according to the IFS.
 */
export function getTransformedImageData(ctx, width, height, affineTransformMatrices) {
    var iD = ctx.createImageData(width, height);
    var oldID = ctx.getImageData(0, 0, width, height);
    for (var x = 0; x <= width; x++) {
        for (var y = 0; y <= height; y++) {
            var coordTo = { x: x, y: y };
            affineTransformMatrices.forEach(matrix => {
                var coordFrom = applyAffineMatrix(matrix, coordTo);
                convertCoord(coordTo, height);
                convertCoord(coordFrom, height);
                if (coordFrom.x >= 0 && coordFrom.x < width && coordFrom.y >= 0 && coordFrom.y < height) {
                    if (getAlpha(oldID, coordFrom) > 0 || getAlpha(iD, coordTo) == 0) {
                        copyPixel(oldID, coordFrom, iD, coordTo, width);
                    }
                }
            });
        }
    }
    return iD;
} // getTransformedImageData ()
//======================================================================================================================
//======================================================================================================================
function windowTransform(x, y, a, b, height) {
    var c = height * (-a) / (b - a);
    return {
        x: x - c,
        y: y - c
        //height*(-a)/(b-a),
        //y:  height*(-a)/(b-a)
        //x : (height*(x-a))/(b-a),
        //y : (height*(y-a))/(b-a)
    };
} // windowTransform ()
//======================================================================================================================
//======================================================================================================================
/**
 * Get an ImageData object representing the next iteration of the IFS based on the provided affine
 * transformation. To do this, we look at each pixel in the *output* ImageData, apply each of the inverse
 * transformations, and see if there is a non-transparent pixel for any of them. If so, we set the output
 * pixel to one of the colors.
 *
 * @param ctx       The canvas context.
 * @param width     The canvas width.
 * @param height    The canvas height.
 * @param affineTransformMatrices  Affine transform matrices representing the IFS.
 * @returns The ImageData transformed according to the IFS.
 */
export function getTransformedImageDataAnimatedWindow(ctx, width, height, affineTransformMatrices, transformIdx, oldID, a, b) {
    var iD = ctx.createImageData(width, height);
    for (var x = 0; x <= width; x++) {
        for (var y = 0; y <= height; y++) {
            var coordTo = { x: x, y: height - y };
            var matrix = affineTransformMatrices[transformIdx];
            var coordFromPrime = applyAffineMatrix(matrix, windowTransform(coordTo.x, height - coordTo.y, a, b, height));
            convertCoord(coordFromPrime, height);
            if (coordFromPrime.x >= 0 && coordFromPrime.x < width && coordFromPrime.y >= 0 && coordFromPrime.y < height) {
                if (getAlpha(oldID, coordFromPrime) > 0 || getAlpha(iD, coordTo) == 0) {
                    copyPixel(oldID, coordFromPrime, iD, coordTo, width);
                }
            }
        }
    }
    return iD;
} // getTransformedImageData ()
//======================================================================================================================
//======================================================================================================================
/**
 * Get an ImageData object representing the next iteration of the IFS based on the provided affine
 * transformation. To do this, we look at each pixel in the *output* ImageData, apply each of the inverse
 * transformations, and see if there is a non-transparent pixel for any of them. If so, we set the output
 * pixel to one of the colors.
 *
 * @param ctx       The canvas context.
 * @param width     The canvas width.
 * @param height    The canvas height.
 * @param affineTransformMatrices  Affine transform matrices representing the IFS.
 * @returns The ImageData transformed according to the IFS.
 */
export function getTransformedImageDataAnimated(ctx, width, height, affineTransformMatrices, transformIdx, oldID) {
    var iD = ctx.createImageData(width, height);
    for (var x = 0; x <= width; x++) {
        for (var y = 0; y <= height; y++) {
            var coordTo = { x: x, y: y };
            var matrix = affineTransformMatrices[transformIdx];
            var coordFrom = applyAffineMatrix(matrix, coordTo);
            convertCoord(coordTo, height);
            convertCoord(coordFrom, height);
            if (coordFrom.x >= 0 && coordFrom.x < width && coordFrom.y >= 0 && coordFrom.y < height) {
                if (getAlpha(oldID, coordFrom) > 0 || getAlpha(iD, coordTo) == 0) {
                    copyPixel(oldID, coordFrom, iD, coordTo, width);
                }
            }
        }
    }
    return iD;
} // getTransformedImageData ()
//======================================================================================================================
//======================================================================================================================
/**
 * Combine two ImageData objects together by layering them on top of each other.
 *
 * @param id1 The first ImageData to combine.
 * @param id2 The second ImageData to combine.
 * @param canvas The relevant canvas.
 * @returns The combined ImageData.
 */
export function combineImageDatas(id1, id2, canvas) {
    var finalID = canvas.getContext("2d").createImageData(canvas.width, canvas.height);
    for (var x = 0; x <= canvas.width; x++) {
        for (var y = 0; y <= canvas.height; y++) {
            var coord = { x: x, y: y };
            if (getAlpha(id1, coord) > 0)
                copyPixel(id1, coord, finalID, coord, canvas.width);
            if (getAlpha(id2, coord) > 0)
                copyPixel(id2, coord, finalID, coord, canvas.width);
        }
    }
    return finalID;
} // combineImageDatas ()
//======================================================================================================================
//======================================================================================================================
/**
 * Compose a list of affine transforms.
 *
 * @param transforms The list of affine transforms (in matrix form) to compose.
 * @returns The composed affine transform.
 */
export function composeAffineTransforms(transforms) {
    if (transforms.length == 1)
        return transforms[0];
    var M1 = transforms[0];
    var M2 = transforms[1];
    var result = [
        M1[0] * M2[0] + M1[1] * M2[2],
        M1[0] * M2[1] + M1[1] * M2[3],
        M1[2] * M2[0] + M1[3] * M2[2],
        M1[2] * M2[1] + M1[3] * M2[3],
        M1[0] * M2[4] + M1[1] * M2[5] + M1[4],
        M1[2] * M2[4] + M1[3] * M2[5] + M1[5]
    ];
    if (transforms.length == 2)
        return result;
    var temp = [result];
    return composeAffineTransforms(temp.concat(transforms.slice(2, transforms.length)));
} // composeAffineTransforms ()
//======================================================================================================================
