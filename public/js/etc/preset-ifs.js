//======================================================================================================================
/**
 * @file preset-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */
// IMPORTS
import { AffineTransform } from "../fractals/affine-transform.js";
//======================================================================================================================
//======================================================================================================================
export const presetIFS = [
    {
        "name": "Sierpinski Gasket",
        "ifs": [
            new AffineTransform(0.5, 0.5, 0, 0, 0, 0),
            new AffineTransform(0.5, 0.5, 0, 0, 0.5, 0),
            new AffineTransform(0.5, 0.5, 0, 0, 0, 0.5)
        ]
    },
    {
        "name": "Koch Curve",
        "ifs": [
            new AffineTransform(0.333333, 0.333333, 0, 0, 0, 0),
            new AffineTransform(0.333333, 0.333333, 60, 60, 0.333333, 0),
            new AffineTransform(0.333333, 0.333333, -60, -60, 0.5, 0.289),
            new AffineTransform(0.333333, 0.333333, 0, 0, 0.666667, 0)
        ]
    },
    {
        "name": "Sierpinski Carpet",
        "ifs": [
            new AffineTransform(0.333334, 0.333334, 0, 0, 0, 0),
            new AffineTransform(0.333334, 0.333334, 0, 0, 0.333333, 0),
            new AffineTransform(0.333334, 0.333334, 0, 0, 0.666667, 0),
            new AffineTransform(0.333334, 0.333334, 0, 0, 0, 0.333333),
            new AffineTransform(0.333334, 0.333334, 0, 0, 0.666667, 0.333333),
            new AffineTransform(0.333334, 0.333334, 0, 0, 0, 0.666667),
            new AffineTransform(0.333334, 0.333334, 0, 0, 0.333333, 0.666667),
            new AffineTransform(0.333334, 0.333334, 0, 0, 0.666667, 0.666667),
        ]
    },
]; // const presetIFS
//======================================================================================================================
