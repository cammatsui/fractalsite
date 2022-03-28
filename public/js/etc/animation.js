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
    //==================================================================================================================
    //==================================================================================================================
    // INSTANCE METHODS
    //==================================================================================================================
    //==================================================================================================================
    /**
     * The constructor for an animator.
     */
    constructor(toAnimate, animateButton, warning, iterationTag) {
        /* The interval ID for the animation. */
        this.intervalID = 0;
        /* Whether iteration is enabled at this time. */
        this.iterationEnabled = true;
        /* Whether or not the user has received the above warning. */
        this.warned = false;
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
    runIterationWithWarning() {
        if (this.toAnimate.numIters >= this.toAnimate.maxIters && !this.warned) {
            if (this.isAnimating())
                this.toggleAnimation();
            alert(this.warning);
            this.warned = true;
        }
        else {
            this.toAnimate.iterate();
            this.iterationTag.innerHTML = "Iterations: " + this.toAnimate.numIters;
        }
    } // runIterationWithWarning ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Turn the animation on/off depending on its state.
     */
    toggleAnimation() {
        if (this.isAnimating()) {
            this.stopAnimation();
        }
        else {
            this.startAnimation();
        }
    } // toggleAnimation ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Run an iteration such that another one can only be run after the cooldown has elasped.
     */
    runIterationWithCooldown() {
        if (!this.iterationEnabled || this.isAnimating())
            return;
        this.runIterationWithWarning();
        this.iterationEnabled = false;
        setTimeout(() => { this.iterationEnabled = true; }, this.cooldown);
    } // runIterationWithCooldown ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Start the animation.
     */
    startAnimation() {
        this.animateButton.innerHTML = "Stop Animation";
        this.intervalID = setInterval(() => { this.runIterationWithWarning(); }, this.cooldown);
        this.iterationEnabled = false;
    } // startAnimation ()
    //==================================================================================================================
    //==================================================================================================================
    /**
     * Stop the animation.
     */
    stopAnimation() {
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
    isAnimating() {
        return this.intervalID != 0;
    } // isAnimating ()
} // class Animator
//======================================================================================================================
