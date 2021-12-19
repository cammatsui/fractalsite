//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
/**
 * @file detIfs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { Coordinate, ParameterizedAffineTransform } from '../types.js'
//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
/**
 * A class representing a Deterministic Iterated Function System (IFS).
 */
export class DeterministicIFS {
//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    // FIELDS
    
    /* The canvas to draw the fractal onto. */
    readonly ctx: CanvasRenderingContext2D;

    /* The context to draw the fractal with. */
    readonly canvas: HTMLCanvasElement;

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
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    // INSTANCE METHODS
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    
    
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * The constructor for the DeterministicIFS.
     */
    constructor(canvas: HTMLCanvasElement, transformParameters: ParameterizedAffineTransform[]) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.numIters = 0;
        this.affineTransformMatrices = []
        this.maxIters = this.findMaxIters(transformParameters);

        // Convert the parameterized affine transforms into inverted matrices.
        transformParameters.forEach(t => {
            this.affineTransformMatrices.push(
                DeterministicIFS.invertAffineMatrix(this.createAffineMatrix(t.r, t.s, t.thetaD, t.phiD, t.e, t.f))
            );
        })
    } // constructor ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Apply an iteration of the IFS.
     */
    public applyTransform(): void {
        if (this.numIters >= this.maxIters) {
            // warn (implement later)
            console.log("warning");
        }
        var transformedImageData = this.getTransformedImageData();
        this.ctx.putImageData(transformedImageData, 0, 0);
        this.numberIters++;
    } // applyTransform ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    

    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Copy the value of a pixel at Coordinate c1 on ImageData id1 to Coordinate c2 on ImageData id2.
     * 
     * @param iD1   The ImageData to copy from.
     * @param c1    The Coordinate to copy from.
     * @param iD2   The ImageData to copy to.
     * @param c2    The Coordinate teo copy to.
     */
    private copyPixel(iD1: ImageData, c1: Coordinate, iD2: ImageData, c2: Coordinate): void {
        // Convert coordinates of c1 and c2 such that origin is in bottom left.
        for (var i = 0; i < 4; i++)
            iD2.data[(c2.y*this.width + c2.x)*4 + i] = iD1.data[(c1.y*this.width + c1.x)*4 + i];
    } // copyPixel ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    

    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Create a "matrix" representing a parameterized affine transformation.
     * 
     * @params See documentation.
     * @returns A number[]: [a, b, c, d, e, f]
     */
    private createAffineMatrix(r: number, s: number, thetaD: number, phiD: number, e: number, f: number): number[] {
        var theta = DeterministicIFS.toRadians(thetaD);
        var phi = DeterministicIFS.toRadians(phiD);
        return [r*Math.cos(theta), -s*Math.sin(phi), r*Math.sin(theta), s*Math.cos(phi), e*this.width, 
                f*this.height];
    } // createAffineMatrix ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Convert the Coordinate c such that the origin is in the bottom left of the canvas.
     * 
     * @param c The Coordinate to convert.
     */
    private convertCoord(c: Coordinate): void {
        c.y = this.height - c.y;
    } // convertCoord ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
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
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
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
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Get an ImageData object representing the next iteration of the IFS based on the provided affine 
     * transformation. To do this, we look at each pixel in the *output* ImageData, apply each of the inverse 
     * transformations, and see if there is a non-transparent pixel for any of them. If so, we set the output
     * pixel to one of the colors.
     * 
     * @param matrices Affine transform matrices representing the IFS.
     * @returns The ImageData transformed according to the IFS.
     */
    private getTransformedImageData(): ImageData {
        var iD = this.ctx.createImageData(this.width, this.height);
        var oldID = this.ctx.getImageData(0, 0, this.width, this.height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var coordTo: Coordinate = { x: x, y: y };
                this.affineTransformMatrices.forEach(matrix => {
                    var coordFrom = DeterministicIFS.applyAffineMatrix(matrix, coordTo);
                    this.convertCoord(coordTo);
                    this.convertCoord(coordFrom);
                    if (coordFrom.x >= 0 && coordFrom.x < this.width && coordFrom.y >= 0 && coordFrom.y < this.height)  {
                        if (DeterministicIFS.getAlpha(oldID, coordFrom) > 0 || DeterministicIFS.getAlpha(iD, coordTo) == 0)

                            this.copyPixel(oldID, coordFrom, iD, coordTo);
                    }
                });
            }
        }
        return iD;
    } // getTransformedImageData ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    

    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    // STATIC METHODS
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
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
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Get the alpha value of the given PxCoord on the given ImageData.
     * 
     * @param iD The ImageData to look at.
     * @param c The coordiante to look at.
     * @returns The alpha value.
     */
    static getAlpha(iD: ImageData, c: Coordinate) {
        return iD.data[(c.y*iD.width + c.x)*4 + 3];
    } // getAlpha ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Convert an angle in degrees to an angle in radians.
     * 
     * @param angleDegs The degree measurement of the angle.
     * @returns The radian measurement of the angle.
     */
    static toRadians(angleDegs: number): number {
        return angleDegs * (Math.PI / 180);
    } // toRadians ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Invert a matrix which represents an affine transformation.
     * 
     * @param affineMatrix The affine matrix (from createAffineMatrix) to invert.
     * @returns The inverted affine matrix.
     */
    static invertAffineMatrix(affineMatrix: number[]): number[] {
        var det = affineMatrix[0]*affineMatrix[3] - affineMatrix[1]*affineMatrix[2];
        if (det == 0) throw new Error("Attempted to invert noninvertible affine matrix.");
        var invDet = 1/det;
        return [invDet*affineMatrix[3], -invDet*affineMatrix[1], -invDet*affineMatrix[2], invDet*affineMatrix[0], 
                invDet*(affineMatrix[1]*affineMatrix[5] - affineMatrix[3]*affineMatrix[4]),
                invDet*(affineMatrix[2]*affineMatrix[4] - affineMatrix[0]*affineMatrix[5])];
    } // invertAffineMatrix()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
    /**
     * Apply the affine transformation represented by the given matrix to the given coordinate.
     * 
     * @param matrix The matrix representing the affine transformation.
     * @param c A PxCoord representing the coordinate that we would like to transform.
     * @returns A PXCoord of the transformed coordinate c.
     */
    static applyAffineMatrix(matrix: number[], c: Coordinate): Coordinate {
        var c2: Coordinate = {
            x: Math.floor(matrix[0]*c.x + matrix[1]*c.y + matrix[4]),
            y: Math.floor(matrix[2]*c.x + matrix[3]*c.y + matrix[5]),
        };
        return c2;
    } // applyAffineMatrix ()
    //====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================


//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
} // class DeterministicIFS
//========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================