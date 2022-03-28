//======================================================================================================================
/**
 * @file drawing.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */

// IMPORTS
import { Coordinate } from '../../types.js';
//======================================================================================================================


//======================================================================================================================
/**
 * A class representing a canvas which can be drawn on.
 */
export class DrawingCanvas {
//======================================================================================================================
   

    //==================================================================================================================
    // FIELDS

    /* The canvas to draw onto. */
    readonly canvas: HTMLCanvasElement

    /* The context to draw with. */
    readonly ctx: CanvasRenderingContext2D;

    /* Whether we are currently drawing. */ 
    drawing: boolean;

    /* The previous coordinate of the mouse. */ 
    prevCoordinate: Coordinate;

    /* The current coordinate of the mouse. */ 
    currCoordinate: Coordinate;

    /* The default drawing color. */
    readonly defaultColor = 'black';

    /* The default drawing width. */
    readonly defaultWidth = 6;

    //==================================================================================================================
    

    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================


    //==================================================================================================================
    /**
     * The constructor for the DrawingCanvas.
     *
     * @param canvas: The canvas to use as a DrawingCanvas.
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.drawing = false;
        this.prevCoordinate = {x: 0, y: 0};
        this.currCoordinate = {x: 0, y: 0};
        this.initializeCanvas();
        this.setDrawingTools("black", 9);
    } // constructor ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Clear the canvas.
     */
    public clear() {
        this.ctx.putImageData(this.ctx.createImageData(this.canvas.width, this.canvas.height), 0, 0);
        this.prevCoordinate = {x: 0, y: 0};
        this.currCoordinate = {x: 0, y: 0};
    } // clear ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Update the context's color via strokeStyle.
     *
     * @param newColor: The new color to draw with.
     */
    public setColor(newColor: string) {
        this.ctx.strokeStyle = newColor;
        this.ctx.fillStyle = newColor;
    } // setColor ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Update the context's lineWidth and color via strokeStyle.
     *
     * @param newColor: The new color to draw with.
     * @param newWidth: The new pen width to draw with.
     */
    public setDrawingTools(newColor: string, newWidth: number) {
        this.ctx.lineWidth = newWidth;
        this.ctx.strokeStyle = newColor;
    } // setDrawingTools ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Reset the canvas' drawing tools.
     */
    public resetDrawingTools() {
        this.setDrawingTools(this.defaultColor, this.defaultWidth);
    } // resetDrawingTools ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Initialize the DrawingCanvas by adding the appropriate event listeners.
     */
    private initializeCanvas() {
        var drawingCanvas = this;
        function parseAction(s: string, e: MouseEvent) { drawingCanvas.parseAction(s, e); }

        // Set up event listeners for drawing.
        this.canvas.addEventListener("mousemove", function(e) {
            parseAction('move', e);
        }, false);
        this.canvas.addEventListener("mousedown", function(e) {
            parseAction('down', e);
        }, false);
        this.canvas.addEventListener("mouseup", function(e) {
            parseAction('up', e);
        }, false);
        this.canvas.addEventListener("mouseout", function(e) {
            parseAction('out', e);
        }, false);
    } // initializeCanvas ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Parse an action/mouse event.
     *
     * @param action: The type of event to parse.
     * @param event: The event to parse.
     * 
     */
    private parseAction(action: string, event: MouseEvent) {
        if (action == 'down' || (action == 'move' && this.drawing)) {
            var rect = this.canvas.getBoundingClientRect();
            this.prevCoordinate = this.currCoordinate;
            this.currCoordinate = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }
        if (action == 'down') {
            this.drawing = true;
            // Draw a dot.
            this.ctx.beginPath();
            this.ctx.fillRect(this.currCoordinate.x, this.currCoordinate.y, this.ctx.lineWidth, this.ctx.lineWidth);
            this.ctx.closePath();
        } else if (action == 'up' || action == 'out') {
            this.drawing = false;
        }
        if (action == 'move' && this.drawing) {
            this.draw();
        }
    } // parseAction ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Draw a stroke on the canvas based on the mouse coordinates.
     */
    private draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevCoordinate.x, this.prevCoordinate.y);
        this.ctx.lineTo(this.currCoordinate.x, this.currCoordinate.y);
        this.ctx.stroke();
        this.ctx.closePath();
    } // draw ()
    //==================================================================================================================


//======================================================================================================================
} // class DrawingCanvas
//======================================================================================================================