//======================================================================================================================
// TYPES
//======================================================================================================================


    //==================================================================================================================
    class DrawingCanvas {
    //==================================================================================================================
        
        //==============================================================================================================
        // FIELDS

        /* The context to draw with. */
        readonly canvas: HTMLCanvasElement;

        /* The context to draw with. */
        readonly ctx: CanvasRenderingContext2D;

        /* The width of the canvas in pixels. */
        readonly width: number;

        /* The height of the canvas in pixels. */
        readonly height: number;

        /* The previous coordinate of the mouse. */
        prevCoord: PxCoord;

        /* The current coordinate of the mouse. */
        currCoord: PxCoord;

        /* Whether we are currently drawing. */
        drawing: boolean;
        //==============================================================================================================


        //==============================================================================================================
        // INSTANCE METHODS
        //==============================================================================================================


        //==============================================================================================================
        /**
         * 
         * 
         * @param canvas
         * @param w 
         * @param h 
         */
        constructor(canvas: HTMLCanvasElement, w: number, h: number) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d')!;
            this.width = w;
            this.height = h;
            this.prevCoord = {x: 0, y: 0};
            this.currCoord = {x: 0, y: 0};
            this.drawing = false;
            this.initCanvas();
        } // constructor ()
        //==============================================================================================================


        //==============================================================================================================
        private draw() {
            this.ctx.beginPath();
            this.ctx.moveTo(this.prevCoord.x, this.prevCoord.y);
            this.ctx.lineTo(this.currCoord.x, this.currCoord.y);
            this.ctx.stroke();
            this.ctx.closePath();
        }  // draw ()
        //==============================================================================================================


        //==============================================================================================================
        private parseAction(action: string, mouseEvent: MouseEvent) {
            if (action == 'down' || (action == 'move' && this.drawing)) {
                this.prevCoord = this.currCoord;
                this.currCoord = {
                    x: mouseEvent.clientX - this.canvas.offsetLeft, 
                    y: mouseEvent.clientY - this.canvas.offsetTop
                };
            }

            if (action == 'down') {
                this.drawing = true;
                // Draw a dot.
                this.ctx.beginPath();
                this.ctx.fillRect(this.currCoord.x, this.currCoord.y, 2, 2);
                this.ctx.closePath();
            } else if (action == 'up' || action == 'out') {
                this.drawing = false;
            } else if (action == 'move') {
                this.draw();
            }
        } // parseAction ()
        //==============================================================================================================


        //==============================================================================================================
        private initCanvas() {
            var dc = this;
            function pa(s: string, e: MouseEvent) { dc.parseAction(s, e); } 

            this.canvas.addEventListener("mousemove", function (e) {
                pa('move', e);
            }, false);
            this.canvas.addEventListener("mousedown", function (e) {
                pa('down', e);
            }, false);
            this.canvas.addEventListener("mouseup", function (e) {
                pa('up', e);
            }, false);
            this.canvas.addEventListener("mouseout", function (e) {
                pa('out', e);
            }, false);
        } // initCanvas ()
        //==============================================================================================================


        //==============================================================================================================
        // END INSTANCE METHODS
        //==============================================================================================================


    //==================================================================================================================
    } // class DrawingCanvas
    //==================================================================================================================


//======================================================================================================================
// END TYPES
//======================================================================================================================


//======================================================================================================================
const maxDimension2 = Math.floor(Math.min(window.innerWidth*.5, window.innerHeight*.9));
const height2 = maxDimension2;
const width2 = maxDimension2;

// INITIALIZATION
var drawingCanvas = <HTMLCanvasElement>document.getElementById('drawing-canvas')!;
drawingCanvas.height = height2;
drawingCanvas.width = width2;

var dc = new DrawingCanvas(drawingCanvas, width2, height2);
//======================================================================================================================