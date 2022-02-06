//======================================================================================================================
/**
 * @file det-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { ParameterizedAffineTransform } from '../types.js';
import { createAffineMatrix, invertAffineMatrix, getTransformedImageDataAnimated, 
    combineImageDatas } from './utils/affine-transform.js';
//======================================================================================================================


//======================================================================================================================
/**
 * A class representing a Deterministic Iterated Function System (IFS).
 */
export class DeterministicIFS {
//======================================================================================================================


    //==================================================================================================================
    // FIELDS
    
    /* The canvas to draw the fractal onto. */
    readonly canvas: HTMLCanvasElement;

    /* The context to draw the fractal with. */
    readonly ctx: CanvasRenderingContext2D;
    
    /* The matrices representing affine transforms for this IFS. */
    readonly affineTransformMatrices: number[][];

    /* The number of iterations that have been performed on this IFS. */
    numIters: number;

    /* The maximum number of iterations before disintegration. */
    readonly maxIters: number;

    /* The delay (in ms) between applying each affine transform in animation. */
    readonly AFFINE_DELAY = 220;

    //==================================================================================================================


    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    
    
    //==================================================================================================================
    /**
     * The constructor for the DeterministicIFS.
     */
    constructor(canvas: HTMLCanvasElement, transformParameters: ParameterizedAffineTransform[]) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.numIters = 0;
        this.affineTransformMatrices = []
        this.maxIters = this.findMaxIters(transformParameters)-1;

        // Convert the parameterized affine transforms into inverted matrices.
        transformParameters.forEach(t => {
            // Invert the matrix, and check if it is valid (invertible and numbers will return a valid matrix).
            //  If not, throw an error.
            var inverted = invertAffineMatrix(createAffineMatrix(t.r, t.s, t.thetaD, t.phiD, t.e, t.f, 
                this.canvas.width, this.canvas.height));
            for (var i = 0; i < inverted.length; i++) {
                if (isNaN(inverted[i])) throw new Error("Invalid affine transform."); 
            }
            this.affineTransformMatrices.push(inverted);
        })
    } // constructor ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Apply an iteration of the IFS with animation.
     */
    public async applyTransformAnimated() {
        // Sleep function.
        function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

        this.numIters++;
        // oldID is the ImageData of the previous iteration; curID used to store the current animation frame.
        var oldID = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height); 
        var curID = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        // ids holds the resulting ImageDatas for animation.
        var ids: ImageData[] = [];

        for (var i = 0; i < this.affineTransformMatrices.length; i++) {
            // Get the result of applying the ith transform to the previous iteration.
            var transformed = getTransformedImageDataAnimated(this.ctx, this.canvas.width, this.canvas.height,
                this.affineTransformMatrices, i, oldID);
            // Combine the previous animation frame and the transformed image data.
            curID = combineImageDatas(curID, transformed, this.canvas);
            // Copy the new animation frame and store it.
            ids.push(new ImageData(
                new Uint8ClampedArray(curID.data),
                curID.width,
                curID.height
            ));
        }

        // Run the animation.
        for (var i = 0; i < ids.length; i++) {
            this.ctx.putImageData(ids[i], 0, 0);
            if (i != ids.length-1) await sleep(this.AFFINE_DELAY);
        }
    } // applyTransformAnimated ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Scale the canvas.
     * 
     * @param scalingFactor The factor to scale the canvas by.
     */
    public scale(scalingFactor: number) {
        this.ctx.scale(scalingFactor, scalingFactor);
    } // scale ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Find the minimum on the x or y axis of drawn pixels.
     * 
     * @returns The minimum dimension.
     */
    private findMinDrawingDimension(): number {
        var iD = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        // Find the minimum/maximumum x and y values containing non-empty pixels.
        var minX = this.canvas.width;
        var maxX = 0;
        var minY = this.canvas.height;
        var maxY = 0;
        for (var x = 0; x < this.canvas.width; x++) {
            for (var y = 0; y < this.canvas.height; y++) {
                if (iD.data[(y*iD.width + x)*4 + 3] != 0) {
                    minX = Math.min(x, minX);
                    maxX = Math.max(x, maxX);
                    minY = Math.min(y, minY);
                    maxY = Math.max(y, maxY);
                }
            }
        }
        return Math.min(maxX-minX, maxY-minY);
    }// findMinDrawingDimension ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Calculate the maximum number of iterations for the IFS based on the input image, canvas dimensions,
     * and minimum scaling factor of the transformations.
     * 
     * @param transformParams The transformaton parameters.
     * @returns The maximum number of iterations.
     */
    private findMaxIters(transformParams: ParameterizedAffineTransform[]): number {
        var minDim = this.findMinDrawingDimension();
        var minScalingFactor = DeterministicIFS.findMinScalingFactor(transformParams);
        // if square of minDim, how many times can we multiply by minScalingFactor to get to 1?
        //  i = log_{minScalingFactor}(1/minDim)
        return Math.floor(Math.log(1/minDim) / Math.log(minScalingFactor))
    } // findMaxIters ()
    //==================================================================================================================


    //==================================================================================================================
    // STATIC METHODS
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Find the minimum scaling factor (r or s) of the given transformation parameters.
     * 
     * @param transformParams The transformation parameters of interest.
     * @returns The minimum scaling factor of transformParams.
     */
    static findMinScalingFactor(transformParams: ParameterizedAffineTransform[]) {
        var min: number = Number.MAX_VALUE
        transformParams.forEach(t => {
            if (t.r < min) min = t.r;
            if (t.s < min) min = t.s;
        })
        return min;
    } // findMinScalingFactor ()
    //==================================================================================================================


//======================================================================================================================
} // class DeterministicIFS
//======================================================================================================================