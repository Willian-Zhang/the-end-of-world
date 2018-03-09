import './libraries/eventemitter2.js';
export class Keybaord extends EventEmitter2{
    constructor(){
        super();
        document.addEventListener('keydown', (event) => {          
            this.emit('press', event);
        });
    }
}

export class GameState extends EventEmitter2{
    constructor(drop_rate = 3.0, update_rate = 0.2, not_touching_threshold = 50.0, report_rate = 0.05){
        super();
        this.state = {};
        this.reset();
        this.drop_rate = drop_rate;
        this.interval = null;
        this.delta  = -not_touching_threshold;
        this.update_rate = update_rate;
        this.report_rate = report_rate;
        this.report_interval = setInterval(()=>{
            this.emit("report", this.state.blood);
        }, this.report_rate * 1000);
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
        this.clear_inetrvals();
        this.state.blood = this.initial_states.blood;
    }
    clear_inetrvals(){
        if(this.interval){
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    start_counting(){
        this.clear_inetrvals();
        this.interval  = 
            setInterval(()=>{
                this.state.blood -= this.drop_rate;
            }, 500);            
    }
    add(value){
        this.state.blood += this.update_rate * (value + this.delta - 0.01);
    }
}