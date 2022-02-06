//======================================================================================================================
/**
 * @file mem-ifs.ts
 * @author Cameron Matsui (cmatsui22@amherst.edu)
 * @date February 2022.
 */
//======================================================================================================================
//======================================================================================================================
export class IFSWithMemory {
    //==================================================================================================================
    //==================================================================================================================
    constructor(canvas, allowedTransformations, is2D) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.allowedTransformations = allowedTransformations;
        this.numIters = 0;
        this.is2D = is2D;
    } // constructor ()
    //==================================================================================================================
    //==================================================================================================================
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } // clearCanvas ()
    //==================================================================================================================
    //==================================================================================================================
    drawAtAddress(address) {
        var topLeft = { x: 0, y: 0 };
        var bottomRight = { x: this.canvas.height, y: this.canvas.width };
        address.split('').forEach(quadrant => {
            switch (quadrant) {
                case '1':
                    topLeft = { x: (topLeft.x + bottomRight.x) / 2, y: topLeft.y };
                    bottomRight = { x: bottomRight.x, y: (topLeft.y + bottomRight.y) / 2 };
                    break;
                case '2':
                    topLeft = { x: bottomRight.x / 2, y: bottomRight.y / 2 };
                    break;
                case '3':
                    topLeft = { x: topLeft.x, y: (topLeft.y + bottomRight.y) / 2 };
                    bottomRight = { x: (topLeft.x + bottomRight.x) / 2, y: bottomRight.y };
                    break;
                case '4':
                    bottomRight = { x: bottomRight.x / 2, y: bottomRight.y / 2 };
                    break;
                default:
                    break;
            }
        });
        console.log(topLeft, bottomRight);
        this.drawSquare(topLeft, bottomRight);
    } // drawAtAddress ()
    //==================================================================================================================
    //==================================================================================================================
    applyTransform() {
        this.clearCanvas();
        var baseNum = this.is2D ? 2 : 3;
        var addresses = this.getAddresses(baseNum + this.numIters);
        addresses.forEach(address => {
            this.drawAtAddress(address);
        });
        this.numIters++;
    } // applyTransform
    //==================================================================================================================
    //==================================================================================================================
    drawSquare(topLeft, bottomRight) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'orange';
        this.ctx.fillRect(topLeft.y, topLeft.x, bottomRight.y - topLeft.y, bottomRight.x - topLeft.x);
        this.ctx.strokeStyle = 'black';
        this.ctx.rect(topLeft.y, topLeft.x, bottomRight.y - topLeft.y, bottomRight.x - topLeft.x);
        this.ctx.stroke();
    } // drawSquare ();
    //==================================================================================================================
    //==================================================================================================================
    getAddresses(length) {
        var addressesLists = IFSWithMemory.getAddressesHelper(length);
        var addresses = [];
        addressesLists.forEach(addressesList => {
            var stringAddress = addressesList.join("");
            for (var i = 0; i < this.allowedTransformations.length; i++) {
                var allowed = this.allowedTransformations[i];
                if (!stringAddress.includes(allowed))
                    continue;
                addresses.push(stringAddress);
                break;
            }
        });
        return addresses;
    } // getAddresses ()
    //==================================================================================================================
    //==================================================================================================================
    static getAddressesHelper(length) {
        // Base case.
        if (length == 1)
            return [["1"], ["2"], ["3"], ["4"]];
        var prevAddresses = IFSWithMemory.getAddressesHelper(length - 1);
        var nextAddresses = [];
        prevAddresses.forEach(address => {
            ["1", "2", "3", "4"].forEach(quadrant => {
                var clonedAddress = Object.assign([], address);
                clonedAddress.push(quadrant);
                nextAddresses.push(clonedAddress);
            });
        });
        return nextAddresses;
    } // getAddressesHelper ()
} // class IFSWithMemory 
//======================================================================================================================
