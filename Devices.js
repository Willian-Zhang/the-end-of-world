'use strict';

class Button extends EventEmitter2{
    constructor(initialValue = 1, offValue = 1){
        super();
        this.lastValue = initialValue;
        this.offValue = offValue;
    }
    tick(value){
        /**
         * detect new changes for value
         * @param  value  new value
         */
        if(this.lastValue != value){
            if(value == this.offValue){
                this.emit("release");
            }else{
                this.emit("press");
            }
            this.lastValue = value;
        }
    }
}
class CapasitiveSensor extends EventEmitter2{
    constructor(threshold = 100){
        super();
        this.threshold = threshold;
        this.value = 1;
        this.mean = 1;
        this.state = false;
    }
    tick(value){
        
        let over  = value > this.threshold;
        
        if(this.state != over){
            if(over == true){
                this.emit("activate");
            }else{
                this.emit("release");
            }
            this.state = over;
        }
        let relativeValue = value/this.mean;
        this.value = relativeValue;
    }
    reset(values){
        // debugger
        let avg = mean(values);
        let vari = variance(values);
        let threshold = avg + 10*vari;
        this.threshold = threshold;
        this.mean = avg;
    }
}
