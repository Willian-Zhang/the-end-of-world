import './libraries/eventemitter2.js';
export class Keybaord extends EventEmitter2{
    constructor(){
        super();
        document.addEventListener('keypress', (event) => {          
            this.emit('press', event);
        });
    }
}

export class GameState extends EventEmitter2{
    constructor(drop_rate = 3.0, update_rate = 6.0, not_touching_threshold = 50.0, report_rate = 0.05){
        super();
        this.state = this.initial_states;
        this.drop_rate = drop_rate;
        this.interval = null;
        this.report_interval = null;
        this.delta  = -not_touching_threshold;
        this.update_rate = update_rate;
        this.report_rate = report_rate;
        
    }
    get initial_states(){
        return {
            blood : 80
        }
    }
    set not_touching_threshold(not_touching_threshold){
        this.delta  = -not_touching_threshold;
    }
    reset(){
        this.state = this.initial_states;
    }
    start_counting(){
        if(this.interval){
            clearInterval(this.interval);
            clearInterval(this.report_interval);
        }
        this.interval  = 
            setInterval(()=>{
                this.state.blood -= this.drop_rate;
            }, 500);
        this.report_interval = 
            setInterval(()=>{
                this.emit("report", this.state.blood);
            }, this.report_rate * 1000);
    }
    add(value){
        this.state.blood += this.update_rate * value;
    }
}