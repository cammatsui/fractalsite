//======================================================================================================================
/**
 * @file det-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { ParameterizedAffineTransform } from '../types.js';
import { createAffineMatrix, invertAffineMatrix, getTransformedImageData, 
    getTransformedImageDataAnimated, combineImageDatas } from './utils/affine-transform.js';
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

    /* The width of the canvas in pixels. */
    readonly width: number;

    /* The height of the canvas in pixels. */
    readonly height: number;
    
    /* The matrices representing affine transforms for this IFS. */
    readonly affineTransformMatrices: number[][];

    /* The number of iterations that have been performed on this IFS. */
    numIters: number;

    /* The maximum number of iterations before disintegration. */
    readonly maxIters: number;
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
        this.width = canvas.width;
        this.height = canvas.height;
        this.numIters = 0;
        this.affineTransformMatrices = []
        this.maxIters = this.findMaxIters(transformParameters);

        // Convert the parameterized affine transforms into inverted matrices.
        transformParameters.forEach(t => {
            this.affineTransformMatrices.push(
                invertAffineMatrix(createAffineMatrix(t.r, t.s, t.thetaD, t.phiD, t.e, t.f, this.width, this.height))
            );
        })
        console.log(this.affineTransformMatrices);
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
        var oldID = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var curID = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        var ids: ImageData[] = [];

        // Create array of imagedatas for each animation iteration.
        for (var i = 0; i < this.affineTransformMatrices.length; i++) {
            var transformed = getTransformedImageDataAnimated(this.ctx, this.canvas.width, this.canvas.height,
                this.affineTransformMatrices, i, oldID);
            curID = combineImageDatas(curID, transformed, this.canvas);
            // copy transformed
            ids.push(new ImageData(
                new Uint8ClampedArray(curID.data),
                curID.width,
                curID.height
            ));
        }

        for (var i = 0; i < ids.length; i++) {
            await sleep(100*(i+1));
            this.ctx.putImageData(ids[i], 0, 0);
        }
    } // applyTransform ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Apply an iteration of the IFS.
     */
    public applyTransform(): void {
        this.numIters++;
        var transformedImageData = getTransformedImageData(this.ctx, this.width, this.height, 
            this.affineTransformMatrices);
        this.ctx.putImageData(transformedImageData, 0, 0);
    } // applyTransform ()
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
        var iD = this.ctx.getImageData(0, 0, this.width, this.height);
        var minX = this.width;
        var maxX = 0;
        var minY = this.height;
        var maxY = 0;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (iD.data[(y*iD.width + x)*4 + 3] != 0) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
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