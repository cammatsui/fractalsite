//======================================================================================================================
/**
 * @file affine-transform.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @data March 2022.
 */
//======================================================================================================================
//======================================================================================================================
/**
 * A class representing an affine transform.
 */
export class AffineTransform {
    //==================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * The constructor for the AffineTransform.
     */
    constructor(r, s, theta, phi, e, f) {
        this.r = r;
        this.s = s;
        this.theta = theta;
        this.phi = phi;
        this.e = e;
        this.f = f;
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Create the matrix representing this affine transformation.
     */
    createMatrix() {
        var phiRad = this.phi * (Math.PI / 180);
        var thetaRad = this.phi * (Math.PI / 180);
        return [
            this.r * Math.cos(thetaRad), -this.s * Math.sin(phiRad),
            this.r * Math.sin(thetaRad), this.s * Math.cos(phiRad),
            this.e, this.f
        ];
    } // createMatrix ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Create the matrix representing the inverse of this affine transform.
     */
    getInverse() {
        let matrix = this.createMatrix();
        var det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
        if (det == 0)
            throw new Error("Affine matrix not invertible.");
        var invDet = 1 / det;
        return [
            invDet * matrix[3],
            -invDet * matrix[1],
            -invDet * matrix[2],
            invDet * matrix[0],
            invDet * (matrix[1] * matrix[5] - matrix[3] * matrix[4]),
            invDet * (matrix[2] * matrix[4] - matrix[0] * matrix[5])
        ];
    } // createInverseMatrix ()
} // class AffineTransform
//======================================================================================================================
