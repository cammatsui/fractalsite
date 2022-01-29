//======================================================================================================================
/**
 * @file det-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createAffineMatrix, invertAffineMatrix, getTransformedImageData, getTransformedImageDataAnimated, combineImageDatas } from './utils/affine-transform.js';
//======================================================================================================================
//======================================================================================================================
/**
 * A class representing a Deterministic Iterated Function System (IFS).
 */
export class DeterministicIFS {
    //==================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * The constructor for the DeterministicIFS.
     */
    constructor(canvas, transformParameters) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.numIters = 0;
        this.affineTransformMatrices = [];
        this.maxIters = this.findMaxIters(transformParameters);
        // Convert the parameterized affine transforms into inverted matrices.
        transformParameters.forEach(t => {
            this.affineTransformMatrices.push(invertAffineMatrix(createAffineMatrix(t.r, t.s, t.thetaD, t.phiD, t.e, t.f, this.width, this.height)));
        });
        console.log(this.affineTransformMatrices);
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Apply an iteration of the IFS with animation.
     */
    applyTransformAnimated() {
        return __awaiter(this, void 0, void 0, function* () {
            // Sleep function.
            function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
            this.numIters++;
            var oldID = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var curID = this.ctx.createImageData(this.canvas.width, this.canvas.height);
            var ids = [];
            // Create array of imagedatas for each animation iteration.
            for (var i = 0; i < this.affineTransformMatrices.length; i++) {
                var transformed = getTransformedImageDataAnimated(this.ctx, this.canvas.width, this.canvas.height, this.affineTransformMatrices, i, oldID);
                curID = combineImageDatas(curID, transformed, this.canvas);
                // copy transformed
                ids.push(new ImageData(new Uint8ClampedArray(curID.data), curID.width, curID.height));
            }
            for (var i = 0; i < ids.length; i++) {
                yield sleep(100 * (i + 1));
                this.ctx.putImageData(ids[i], 0, 0);
            }
        });
    } // applyTransform ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Apply an iteration of the IFS.
     */
    applyTransform() {
        this.numIters++;
        var transformedImageData = getTransformedImageData(this.ctx, this.width, this.height, this.affineTransformMatrices);
        this.ctx.putImageData(transformedImageData, 0, 0);
    } // applyTransform ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Scale the canvas.
     *
     * @param scalingFactor The factor to scale the canvas by.
     */
    scale(scalingFactor) {
        this.ctx.scale(scalingFactor, scalingFactor);
    } // scale ()
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
    findMaxIters(transformParams) {
        var minDim = this.findMinDrawingDimension();
        var minScalingFactor = DeterministicIFS.findMinScalingFactor(transformParams);
        // if square of minDim, how many times can we multiply by minScalingFactor to get to 1?
        //  i = log_{minScalingFactor}(1/minDim)
        return Math.floor(Math.log(1 / minDim) / Math.log(minScalingFactor));
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
    static findMinScalingFactor(transformParams) {
        var min = Number.MAX_VALUE;
        transformParams.forEach(t => {
            if (t.r < min)
                min = t.r;
            if (t.s < min)
                min = t.s;
        });
        return min;
    } // findMinScalingFactor ()
} // class DeterministicIFS
//======================================================================================================================
