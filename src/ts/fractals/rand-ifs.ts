//======================================================================================================================
/**
 * @file rand-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date February 2022.
 */


// IMPORTS
import { ParameterizedContractionMap, Coordinate } from "../types";
//======================================================================================================================


//======================================================================================================================
/**
 * A class representing a Random Iterated Function System.
 * The class finds a fixed point of one of the IFS contraction maps, and
 * repeatedly applies a random IFS contraction map to that point.
 */
export class RandomIFS {
//======================================================================================================================


    //==================================================================================================================
    // FIELDS

    /* The canvas to draw the fractal onto. */
    readonly canvas: HTMLCanvasElement;

    /* The context to draw the fractal with. */
    readonly ctx: CanvasRenderingContext2D;

    /* A list of the contraction maps for the IFS. */
    readonly contractionMaps: ParameterizedContractionMap[];

    /* The current point to draw. */
    currentPoint: Coordinate;

    /* The number of points to draw per iteration. */
    numPoints: number;

    /* The number of points to draw per iteration. */
    numIters: number;
    //==================================================================================================================


    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================


    //==================================================================================================================
    /**
     * The constructor for the RandomIFS. 
     */
    constructor(canvas: HTMLCanvasElement, contractionMaps: ParameterizedContractionMap[]) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.numPoints = 100;
        this.contractionMaps = contractionMaps;
        this.numIters = 0;
        this.currentPoint = this.findFixedPoint();
    } // constructor ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Run an iteration of the Random IFS.
     */
    iterate() {
        this.numIters++;
        for (var i = 0; i < this.numPoints; i++) {
            this.drawCurrentPoint();
            this.updateCurrentPoint();
        }
    } // iterate ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Apply a random contraction map to the current point.
     */
    updateCurrentPoint() {
        var rT = this.randomTransform();
        var transformed : Coordinate = {
            x : rT.r*this.currentPoint.x + rT.e,
            y : rT.r*this.currentPoint.y + rT.f
        };
        this.currentPoint = transformed;
    } // updateCurrentPoint ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Find a fixed point of a random contraction map.
     * 
     * @returns The fixed point.
     */
    findFixedPoint() : Coordinate {
        var randTransform = this.randomTransform();
        return {
            x : Math.floor(randTransform.e / (1-randTransform.r)),
            y : Math.floor(randTransform.f / (1-randTransform.r))
        };
    } // findFixedPoint ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Get a random choice from the contraction maps.
     * 
     * @returns The random contraction map.
     */
    randomTransform() : ParameterizedContractionMap {
        return this.contractionMaps[Math.floor(Math.random() * this.contractionMaps.length)];
    } // randomTransform ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Draw the current point onto the canvas.
     */
    drawCurrentPoint() {
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(
            Math.floor(this.currentPoint.x * this.canvas.width),
            Math.floor(this.canvas.height - (this.currentPoint.y * this.canvas.height)), 2,2);
    } // drawCurrentPoint ()
    //==================================================================================================================



//======================================================================================================================
} // class RandomIFS 
//======================================================================================================================