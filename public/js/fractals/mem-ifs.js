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
    constructor(canvas) {
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
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Apply an iteration of the transformation.
     */
    applyTransform() {
        var transformedImageData = getTransformedImageData(this.ctx, this.width, this.height, this.transformations);
        this.ctx.putImageData(transformedImageData, 0, 0);
    } // applyTransform ()
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
        super(canvas);
        this.transformations = this.getTransformationsFromMatrix(matrix);
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
                var thisTransform = invertAffineMatrix(composeAffineTransforms([this.baseTransformations[i],
                    this.baseTransformations[j]]));
                transformations.push(thisTransform);
            }
        }
        return transformations;
    } // getTransformationsFromMatrix ()
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
        super(canvas);
        this.transformations = this.getTransformationsFromMatrix(matrix);
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
                    var thisTransform = invertAffineMatrix(composeAffineTransforms([this.baseTransformations[i],
                        this.baseTransformations[j], this.baseTransformations[k]]));
                    transformations.push(thisTransform);
                }
            }
        }
        return transformations;
    } // getTransformationsFromMatrix ()
} // class IFSWithMemory3D 
//======================================================================================================================
