//======================================================================================================================
// TYPES
//======================================================================================================================
//==================================================================================================================
var DrawingCanvas = /** @class */ (function () {
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
    function DrawingCanvas(canvas, w, h) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = w;
        this.height = h;
        this.prevCoord = { x: 0, y: 0 };
        this.currCoord = { x: 0, y: 0 };
        this.drawing = false;
        this.initCanvas();
    } // constructor ()
    //==============================================================================================================
    //==============================================================================================================
    DrawingCanvas.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevCoord.x, this.prevCoord.y);
        this.ctx.lineTo(this.currCoord.x, this.currCoord.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }; // draw ()
    //==============================================================================================================
    //==============================================================================================================
    DrawingCanvas.prototype.parseAction = function (action, mouseEvent) {
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
        }
        else if (action == 'up' || action == 'out') {
            this.drawing = false;
        }
        else if (action == 'move') {
            this.draw();
        }
    }; // parseAction ()
    //==============================================================================================================
    //==============================================================================================================
    DrawingCanvas.prototype.initCanvas = function () {
        var dc = this;
        function pa(s, e) { dc.parseAction(s, e); }
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
    }; // initCanvas ()
    return DrawingCanvas;
}()); // class DrawingCanvas
//==================================================================================================================
//======================================================================================================================
// END TYPES
//======================================================================================================================
//======================================================================================================================
var maxDimension2 = Math.floor(Math.min(window.innerWidth * .5, window.innerHeight * .9));
var height2 = maxDimension2;
var width2 = maxDimension2;
// INITIALIZATION
var drawingCanvas = document.getElementById('drawing-canvas');
drawingCanvas.height = height2;
drawingCanvas.width = width2;
var dc = new DrawingCanvas(drawingCanvas, width2, height2);
//======================================================================================================================
