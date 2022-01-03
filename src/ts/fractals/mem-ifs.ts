//======================================================================================================================
/**
 * @file mem-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { createAffineMatrix, invertAffineMatrix, 
         getTransformedImageData, composeAffineTransforms } from './utils/affine-transform.js';
//======================================================================================================================


//======================================================================================================================
/**
 * An abstract class represnting an iterated function system with memory.
 */
export abstract class IFSWithMemory {
//======================================================================================================================


    //==================================================================================================================
    // FIELDS

    // The canvas to draw the fractal onto.
    readonly canvas: HTMLCanvasElement;

    // The context to draw the fractal with.
    readonly ctx: CanvasRenderingContext2D;

    // The width of the canvas in pixels.
    readonly width: number;

    // The height of the canvas in pixels.
    readonly height: number;

    // The affine transformations T_1, T_2, T_3, and T_4.
    baseTransformations: number[][];
    
    // The composed, inverted transformations to use.
    transformations: number[][];
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Constructor for the IFSWithMemory.
     * 
     * @param canvas The canvas to draw the fractal on.
     */
    constructor (canvas: HTMLCanvasElement) {
        this.transformations = [[]];
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
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
    public applyTransform(): void {
        var transformedImageData = getTransformedImageData(this.ctx, this.width, this.height, this.transformations);
        this.ctx.putImageData(transformedImageData, 0, 0);
    } // applyTransform ()
    //==================================================================================================================


    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================


//======================================================================================================================
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
    constructor(canvas: HTMLCanvasElement, matrix: boolean[][]) {
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
    private getTransformationsFromMatrix(matrix: boolean[][]) {
        var transformations = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (!matrix[i][j]) continue;
                var thisTransform = invertAffineMatrix(composeAffineTransforms([this.baseTransformations[i], 
                    this.baseTransformations[j]]));
                transformations.push(thisTransform);
            }
        }
        return transformations;
    } // getTransformationsFromMatrix ()
    //==================================================================================================================


//======================================================================================================================
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
    constructor(canvas: HTMLCanvasElement, matrix: boolean[][][]) {
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
    private getTransformationsFromMatrix(matrix: boolean[][][]) {
        var transformations = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                for (var k = 0; k < 4; k++) {
                    if (!matrix[i][j][k]) continue;
                    var thisTransform = invertAffineMatrix(composeAffineTransforms([this.baseTransformations[i], 
                        this.baseTransformations[j], this.baseTransformations[k]]));
                    transformations.push(thisTransform);
                }
            }
        }
        return transformations;
    } // getTransformationsFromMatrix ()
    //==================================================================================================================


//======================================================================================================================
} // class IFSWithMemory3D 
//======================================================================================================================