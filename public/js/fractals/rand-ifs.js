//======================================================================================================================
/**
 * @file rand-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date February 2022.
 */
//======================================================================================================================
//======================================================================================================================
/**
 * A class representing a Random Iterated Function System.
 * The class finds a fixed point of one of the affine transforms, and
 * repeatedly applies a random transform to that point.
 */
export class RandomIFS {
    //==================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * The constructor for the RandomIFS.
     */
    constructor(canvas, table, numPoints, a, b) {
        /* The current number of iterations. */
        this.numIters = 0;
        /* The max number of iterations. We allow the random ifs to be iterated infinitely. */
        this.maxIters = Number.MAX_VALUE;
        /* The tolerance on finding a fixed point, in pixels. */
        this.POINT_TOLERANCE = 2;
        /* The cooldown on animation, in ms. */
        this.COOLDOWN = 500;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
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
    calculateCooldown() {
        return this.COOLDOWN;
    } // calculateCooldown ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Randomly find a fixed point of the given affine transform matrix.
     */
    findFixedPointStochastic(matrix) {
        function getRandomInt(max) { return Math.floor(Math.random() * max); }
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
    calibrateAffineTransforms(affineTransforms, a, b) {
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
     * Apply a random matrix to the current point.
     */
    updateCurrentPoint() {
        var rM = this.randomMatrix();
        this.currentPoint = RandomIFS.applyMatrix(rM, this.currentPoint);
    } // updateCurrentPoint ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Get a random (weighted) choice from the matrices.
     */
    randomMatrix() {
        let rand = Math.random();
        for (var i = 0; i < this.matrices.length; i++) {
            let thisProb = this.transformProbs[i];
            let nextProb = this.transformProbs[i + 1];
            if (rand >= thisProb && rand <= nextProb)
                return this.matrices[i];
        }
        return this.matrices[this.matrices.length - 1];
    } // randomMatrix ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Draw the current point onto the canvas.
     */
    drawCurrentPoint() {
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
    static applyMatrix(matrix, c) {
        return {
            x: Math.floor(matrix[0] * c.x + matrix[1] * c.y + matrix[4]),
            y: Math.floor(matrix[2] * c.x + matrix[3] * c.y + matrix[5])
        };
    } // applyMatrix ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Gather the matrices for the affine transform.
     */
    static gatherMatrices(affineTransforms) {
        let matrices = [];
        for (var i = 0; i < affineTransforms.length; i++) {
            matrices.push(affineTransforms[i].createMatrix());
        }
        return matrices;
    } // gatherMatrices ()
} // class RandomIFS 
//======================================================================================================================
