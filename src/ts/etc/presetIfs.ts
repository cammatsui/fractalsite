//======================================================================================================================
/**
 * @file types.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date December 2021.
 */
//======================================================================================================================


export const presetIfs = [
    {
        "name": "Sierpinski Gasket",
        "ifs": [
            {
                "r": 0.5,
                "s": 0.5,
                "thetaD": 0,
                "phiD": 0,
                "e": 0,
                "f": 0
            },
            {
                "r": 0.5,
                "s": 0.5,
                "thetaD": 0,
                "phiD": 0,
                "e": 0.5,
                "f": 0
            },
            {
                "r": 0.5,
                "s": 0.5,
                "thetaD": 0,
                "phiD": 0,
                "e": 0,
                "f": 0.5
            }
        ]
    },
    {
        "name": "Koch Snowflake",
        "ifs": [
            {
                "r": 0.333333,
                "s": 0.333333,
                "thetaD": 0,
                "phiD": 0,
                "e": 0,
                "f": 0
            },
            {
                "r": 0.333333,
                "s": 0.333333,
                "thetaD": 60,
                "phiD": 60,
                "e": 0.333333,
                "f": 0
            },
            {
                "r": 0.333333,
                "s": 0.333333,
                "thetaD": -60,
                "phiD": -60,
                "e": 0.5,
                "f": .289
            },
            {
                "r": 0.333333,
                "s": 0.333333,
                "thetaD": 0,
                "phiD": 0,
                "e": 0.666667,
                "f": 0
            }
        ]
    }
]