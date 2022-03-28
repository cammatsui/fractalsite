
//======================================================================================================================
/**
 * @file animation.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @data March 2022.
 */
//======================================================================================================================


//======================================================================================================================
/**
 * A class which assists with animating iterated function systems, etc.
 */
export class Animator {
//======================================================================================================================


    //==================================================================================================================
    // FIELDS

    /* The object (IFS or otherwise) to animate. */
    toAnimate: AnimatableFractal; 

    /* The cooldown (how long animation takes, in ms). */
    cooldown: number;

    /* The interval ID for the animation. */
    intervalID = 0;

    /* The button which toggles animation. */
    animateButton: HTMLButtonElement;

    /* Whether iteration is enabled at this time. */
    iterationEnabled = true;

    /* A warning to display if the maximum number of iterations have been reached. */
    warning: string;

    /* Whether or not the user has received the above warning. */
    warned = false;

    /* The HTML tag displaying the number of iterations. */
    iterationTag: HTMLElement;

    //==================================================================================================================


    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================


    //==================================================================================================================
    /**
     * The constructor for an animator. 
     */
    constructor(toAnimate: AnimatableFractal, animateButton: HTMLButtonElement, warning: string, 
            iterationTag: HTMLElement) {
        this.toAnimate = toAnimate;
        this.animateButton = animateButton;
        this.warning = warning;
        this.iterationTag = iterationTag;
        this.cooldown = toAnimate.calculateCooldown();
    } // constructor ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Run an iteration, but first check whether we have exceeded the AnimatableFractal's max
     * iterations. If so, provide a warning.
     */
    private runIterationWithWarning() {
        if (this.toAnimate.numIters >= this.toAnimate.maxIters && !this.warned) {
            if (this.isAnimating()) this.toggleAnimation();
            alert(this.warning);
            this.warned = true;
        } else {
            this.toAnimate.iterate();
            this.iterationTag.innerHTML = "Iterations: " + this.toAnimate.numIters;
        }
    } // runIterationWithWarning ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Turn the animation on/off depending on its state.
     */
    public toggleAnimation() {
        if (this.isAnimating()) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    } // toggleAnimation ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Run an iteration such that another one can only be run after the cooldown has elasped. 
     */
    public runIterationWithCooldown() {
        if (!this.iterationEnabled || this.isAnimating()) return;
        this.runIterationWithWarning();
        this.iterationEnabled = false;
        setTimeout( () => { this.iterationEnabled = true }, this.cooldown);
    } // runIterationWithCooldown ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Start the animation.
     */
    private startAnimation() {
        this.animateButton.innerHTML = "Stop Animation";
        this.intervalID = setInterval( () => { this.runIterationWithWarning() }, this.cooldown );
        this.iterationEnabled = false;
    } // startAnimation ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Stop the animation.
     */
    private stopAnimation() {
        this.animateButton.innerHTML = "Start Animation";
        clearInterval(this.intervalID);
        this.intervalID = 0;
        this.iterationEnabled = true;
    } // stopAnimation ()
    //==================================================================================================================


    //==================================================================================================================
    /**
     * Determine if the animation is currently in progress. 
     */
    public isAnimating() {
        return this.intervalID != 0;
    } // isAnimating ()
    //==================================================================================================================


//======================================================================================================================
} // class Animator
//======================================================================================================================


//======================================================================================================================
/**
 * An interface for fractals which are iteratable and thus animatable.
 */
export interface AnimatableFractal {
//======================================================================================================================


    //==================================================================================================================
    // INTERFACE METHODS

    /* Iterate the animatable object. */
    iterate: () => void;

    /* Calculate the cooldown (how long animation takes, in ms) for the animatable object. */
    calculateCooldown: () => number;

    /* The maximum number of allowed iterations */
    maxIters: number;

    /* The current number of iterations. */
    numIters: number;
    //==================================================================================================================


//======================================================================================================================
} // interface Animatable
//======================================================================================================================