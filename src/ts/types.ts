//======================================================================================================================
/**
 * @file types.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */
//======================================================================================================================



//======================================================================================================================
// TYPES
//======================================================================================================================

// A type representing the color and transparency of a pixel.
export type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
}

// A type representing a 2d coordinate position.
export type Coordinate = {
    x: number;
    y: number;
}

// A type representing the parameters of an affine transform.
export type ParameterizedAffineTransform = {
    r: number;
    s: number;
    theta: number;
    phi: number;
    e: number;
    f: number;
}


// A type representing the parameters of an affine transform.
export type ParameterizedContractionMap = {
    r: number;
    e: number;
    f: number;
}

//======================================================================================================================
// END TYPES
//======================================================================================================================