//======================================================================================================================
/**
 * @file rand-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date February 2022.
 */


// IMPORTS
import { AnimatableFractal } from "../etc/animation.js";
import { ProbabilityAffineTable } from "../fractalApps/interfaces/affine-table.js";
import { Coordinate } from "../types.js";
import { AffineTransform } from "./affine-transform";
//======================================================================================================================


//======================================================================================================================
/**
 * A class representing a Random Iterated Function System.
 * The class finds a fixed point of one of the affine transforms, and
 * repeatedly applies a random transform to that point.
 */
export class RandomIFS implements AnimatableFractal {
//======================================================================================================================


    //==================================================================================================================
    // FIELDS

    /* The canvas to draw the fractal onto. */
    readonly canvas: HTMLCanvasElement;

    /* The context to draw the fractal with. */
    readonly ctx: CanvasRenderingContext2D;

    /* The matrices for the affine transforms. */
    matrices: number[][];

    /* A corresponding list of probabilities. */
    readonly transformProbs: number[];

    /* The current point to draw. */
    currentPoint: Coordinate;

    /* The number of points to draw per iteration. */
    numPoints: number;

    /* The current number of iterations. */
    numIters = 0;

    /* The max number of iterations. We allow the random ifs to be iterated infinitely. */
    readonly maxIters = Number.MAX_VALUE;

    /* The tolerance on finding a fixed point, in pixels. */
    readonly POINT_TOLERANCE = 2;

    /* The cooldown on animation, in ms. */
    readonly COOLDOWN = 500;

    //==================================================================================================================


    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================


    //==================================================================================================================
    /**
     * The constructor for the RandomIFS. 
     */
    constructor(canvas: HTMLCanvasElement, table: ProbabilityAffineTable, numPoints: number, a: number, b: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.numPoints = numPoints;

        // Set up
        let affineTransforms = this.calibrateAffineTransforms(table.collectTransforms(), a, b);
        this.transformProbs = table.collectProbabilities();
        this.matrices = RandomIFS.gatherMatrices(affineTransforms);

        this.currentPoint = this.findFixedPointStochastic(this.randomMatrix());
    } // constructor ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Return the animation cooldown. 
     */
    public calculateCooldown(): number {
        return this.COOLDOWN
    } // calculateCooldown ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Randomly find a fixed point of the given affine transform matrix. 
     */
    private findFixedPointStochastic(matrix: number[]): Coordinate {
        function getRandomInt(max: number) { return Math.floor(Math.random() * max) }

        while (true) {
            let randomPoint = { x: getRandomInt(this.canvas.width), y: getRandomInt(this.canvas.height) };
            let transformedPoint = RandomIFS.applyMatrix(matrix, randomPoint);

            let distX = Math.abs(randomPoint.x - transformedPoint.x);
            let distY = Math.abs(randomPoint.y - transformedPoint.y);

            if (distX <= this.POINT_TOLERANCE && distY <= this.POINT_TOLERANCE) {
                return randomPoint;
            }
        }
    } // findFixedPointStochastic ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * "Calibrate" the affine transforms to the canvas size and window [a,b].
     */
    private calibrateAffineTransforms(affineTransforms: AffineTransform[], a: number, b: number) {
        // For now, just assume window is unit square.
        for (var i = 0; i < affineTransforms.length; i++) {
            affineTransforms[i].e = affineTransforms[i].e * this.canvas.width;
            affineTransforms[i].f = affineTransforms[i].f * this.canvas.height;
        }
        return affineTransforms;
    } // calibrateAffineTransforms ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Run an iteration of the Random IFS.
     */
    public iterate() {
        this.numIters++;

        for (var i = 0; i < this.numPoints; i++) {
            this.drawCurrentPoint();
            this.updateCurrentPoint();
        }
    } // iterate ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Apply a random matrix to the current point.
     */
    private updateCurrentPoint() {
        var rM = this.randomMatrix();
        this.currentPoint = RandomIFS.applyMatrix(rM, this.currentPoint);
    } // updateCurrentPoint ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Get a random (weighted) choice from the matrices.
     */
    private randomMatrix() : number[] {
        let rand = Math.random();
        for (var i = 0; i < this.matrices.length; i++) {
            let thisProb = this.transformProbs[i];
            let nextProb = this.transformProbs[i+1];
            if (rand >= thisProb && rand <= nextProb) return this.matrices[i];
        }
        return this.matrices[this.matrices.length-1];
    } // randomMatrix ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Draw the current point onto the canvas.
     */
    private drawCurrentPoint() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.currentPoint.x, this.canvas.height - this.currentPoint.y, 2, 2);
    } // drawCurrentPoint ()
    //==================================================================================================================


    //==================================================================================================================
    // STATIC METHODS
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Apply a matrix to a given coordinate. 
     */
    private static applyMatrix(matrix: number[], c: Coordinate): Coordinate {
        return {
            x: Math.floor(matrix[0]*c.x + matrix[1]*c.y + matrix[4]),
            y: Math.floor(matrix[2]*c.x + matrix[3]*c.y + matrix[5])
        };
    } // applyMatrix ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Gather the matrices for the affine transform. 
     */
    private static gatherMatrices(affineTransforms: AffineTransform[]) {
        let matrices = [];
        for (var i = 0; i < affineTransforms.length; i++) {
            matrices.push(affineTransforms[i].createMatrix());
        }
        return matrices;
    } // gatherMatrices ()
    //==================================================================================================================



//======================================================================================================================
} // class RandomIFS 
//======================================================================================================================