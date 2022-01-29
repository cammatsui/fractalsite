//======================================================================================================================
/**
 * @file mem-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */
// IMPORTS
import { createAffineMatrix, invertAffineMatrix, getTransformedImageData, composeAffineTransforms } from './utils/affine-transform.js';
//======================================================================================================================
//======================================================================================================================
/**
 * An abstract class represnting an iterated function system with memory.
 */
export class IFSWithMemory {
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Constructor for the IFSWithMemory.
     *
     * @param canvas The canvas to draw the fractal on.
     */
    constructor(canvas, matrix) {
        this.numIters = 0;
        this.transformations = [[]];
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.baseTransformations = [
            createAffineMatrix(0.5, 0.5, 0, 0, 0, 0, this.width, this.height),
            createAffineMatrix(0.5, 0.5, 0, 0, 0.5, 0, this.width, this.height),
            createAffineMatrix(0.5, 0.5, 0, 0, 0, 0.5, this.width, this.height),
            createAffineMatrix(0.5, 0.5, 0, 0, 0.5, 0.5, this.width, this.height),
        ];
        this.transformations = this.getTransformationsFromMatrix(matrix);
        this.maxIters = this.findMaxIters();
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Apply an iteration of the transformation.
     */
    applyTransform() {
        this.numIters++;
        var transformedImageData = getTransformedImageData(this.ctx, this.width, this.height, this.transformations);
        this.ctx.putImageData(transformedImageData, 0, 0);
    } // applyTransform ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Find the minimum on the x or y axis of drawn pixels.
     *
     * @returns The minimum dimension.
     */
    findMinDrawingDimension() {
        var iD = this.ctx.getImageData(0, 0, this.width, this.height);
        var minX = this.width;
        var maxX = 0;
        var minY = this.height;
        var maxY = 0;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (iD.data[(y * iD.width + x) * 4 + 3] != 0) {
                    if (x < minX)
                        minX = x;
                    if (x > maxX)
                        maxX = x;
                    if (y < minY)
                        minY = y;
                    if (y > maxY)
                        maxY = y;
                }
            }
        }
        return Math.min(maxX - minX, maxY - minY);
    } // findMinDrawingDimension ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Calculate the maximum number of iterations for the IFS based on the input image, canvas dimensions,
     * and minimum scaling factor of the transformations.
     *
     * @param transformParams The transformaton parameters.
     * @returns The maximum number of iterations.
     */
    findMaxIters() {
        var minDim = this.findMinDrawingDimension();
        var minScalingFactor = this.findMinScalingFactor();
        // if square of minDim, how many times can we multiply by minScalingFactor to get to 1?
        //  i = log_{minScalingFactor}(1/minDim)
        return Math.floor(Math.log(1 / minDim) / Math.log(minScalingFactor));
    } // findMaxIters ()
} // class IFSWithMemory
//======================================================================================================================
//======================================================================================================================
export class IFSWithMemory2D extends IFSWithMemory {
    //======================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Constructor for the IFSWithMemory2D.
     *
     * @param canvas The canvas to draw the fractal onto.
     * @param matrix The 2d boolean matrix to allow/disallow composed transformations.
     */
    constructor(canvas, matrix) {
        super(canvas, matrix);
    } // constructor();
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Get the correct transformations matrices.
     *
     * @param matrix The original matrix for allowing/disallowing compositions.
     * @returns The inverted, correct transformation matrices.
     */
    getTransformationsFromMatrix(matrix) {
        var transformations = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (!matrix[i][j])
                    continue;
                var composedTransform = composeAffineTransforms([this.baseTransformations[i],
                    this.baseTransformations[j]]);
                var thisTransform = invertAffineMatrix(composedTransform);
                transformations.push(thisTransform);
            }
        }
        return transformations;
    } // getTransformationsFromMatrix ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Return the minimum scaling factor out of the allowed transforms.
     */
    findMinScalingFactor() {
        return 0.25;
    } // findMinScalingFactor ()
} // class IFSWithMemory2D
//======================================================================================================================
//======================================================================================================================
export class IFSWithMemory3D extends IFSWithMemory {
    //======================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Constructor for the IFSWithMemory3D.
     *
     * @param canvas The canvas to draw the fractal onto.
     * @param matrix The 3d boolean matrix to allow/disallow composed transformations.
     */
    constructor(canvas, matrix) {
        super(canvas, matrix);
    } // constructor();
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Get the correct transformations matrices.
     *
     * @param matrix The original matrix for allowing/disallowing compositions.
     * @returns The inverted, correct transformation matrices.
     */
    getTransformationsFromMatrix(matrix) {
        var transformations = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                for (var k = 0; k < 4; k++) {
                    if (!matrix[i][j][k])
                        continue;
                    var composedTransform = composeAffineTransforms([this.baseTransformations[i],
                        this.baseTransformations[j], this.baseTransformations[k]]);
                    var thisTransform = invertAffineMatrix(composedTransform);
                    transformations.push(thisTransform);
                }
            }
        }
        return transformations;
    } // getTransformationsFromMatrix ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Return the min scaling factor out of the allowed transforms.
     */
    findMinScalingFactor() {
        return 0.125;
    } // findMinScalingFactor ()
} // class IFSWithMemory3D 
//======================================================================================================================
