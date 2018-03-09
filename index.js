import  './libraries/jquery.min.js';
import './libraries/loading-bar.min.js';
import {AnalogReader, CatagorialReader} from './Devices.js';
import './libraries/p5.js';
import './libraries/p5.serialport.js';
import {Board} from './Arduino.js';
import './libraries/eventemitter2.js';
import './libraries/howler.js';

class Keybaord extends EventEmitter2{
    constructor(){
        super();
        document.addEventListener('keypress', (event) => {          
            this.emit('press', event);
        });
    }
}

var s = function(p5) {
    "use strict";
    var images = {
        scene1:{
            scene1_1: null,
            scene1_2: null,
        },
        scene2:{}
    };
    var bgms = {
        scene1:{
            song: 'Magica.aac',
        }
    };
    const resourcePath = 'resources';

    p5.preload = function(){   
        // Load all images
        Object.keys(images).forEach(scene=>{
            Object.keys(images[scene]).forEach(cut=>{
                images[scene][cut]  = p5.loadImage(`${resourcePath}/${scene}/${cut}.png`);
            });
        });
        Object.keys(bgms).forEach(scene=>{
            Object.keys(bgms[scene]).forEach(song=>{
                bgms[scene][song]  = new Howl({
                    src: [`${resourcePath}/${scene}/${bgms[scene][song]}`],
                    autoplay: false, html5:true
                  });
            });
        });
    }

    let heartA = new CatagorialReader();
    let heartB = new AnalogReader();
    let keyboard = new Keybaord();
    p5.setup = function(){   
        {// connection
            let board = new Board([heartA , heartB]);
            let port = board.connect({baudrate: 9600});
            console.log(`Connecting on ${port}...`);
            board.on('connected', ()=>{
                console.log('connected');
        
                // Start game here:
                start();
            });
            board.on('warning', (warning)=>{
                console.warn(warning);
            });
        }
        
        {// 
            p5.createCanvas(p5.windowWidth, p5.windowHeight);
        }
        // TODO: remove
        // start();
        
    }
    p5.draw = function(){   

    }

    // let bloodDOM = $('#blood')[0];
    var bloodBar = new ldBar("#blood");
    function set_blood(value){
        "use strict";
        bloodBar.set(value);
    }

    function showNewCut(cut){
        p5.image(cut, 0, 0, p5.windowWidth, p5.windowHeight);
    }
    function clearEventListeners(){
        heartA.removeAllListeners(['change']);
        keyboard.removeAllListeners(['press']);
    }
    function detectNewEvent(agreeFn, disagreeFn, cleanBefore = true){
        if(cleanBefore){
            clearEventListeners();
        }
        heartA.once('change', value=>{
            if(value == 1){
                agreeFn();
            }else if(value == 2){
                disagreeFn();
            }
        });
        keyboard.on('press', event=>{
            switch (event.code) {
                case 'KeyY':
                    agreeFn();
                    break;
                case 'KeyN':
                    disagreeFn();
                    break;
                default:
                    break;
            }
        });
    }
    function detectSpace(onPress, cleanBefore = true){
        if(cleanBefore){
            clearEventListeners();
        }
        keyboard.on('press', event=>{
            switch (event.code) {
                case 'Space':
                    onPress();
                    break;
            }
        });
    }
    function showDialog(text){
        let margin = 10;
        let size = 0.3;
        let height = p5.windowHeight * size - 2 * margin;
        let width = p5.windowWidth - 2 * margin;
        let x = margin;
        let y = p5.windowHeight - height - margin;
        let radios = 5;
        let textMargin = 15;

        p5.push();
        p5.stroke(`rgba(255,255,255, 0.7)`);
        p5.strokeWeight(6);
        p5.fill('rgba(76,176,244,0.5)');
        p5.rect(x, y, width, height,radios,radios,radios,radios);
        p5.pop();
        p5.textSize(32);
        p5.text(text, x + textMargin, y + textMargin , width - textMargin, height - textMargin);
    }
    var np = null;
    function changeCut(cut, agreeFn, disagreeFn=null, bgm = null, dialog = []){
        showNewCut(cut);
        if(bgm){
            if(np){
                let thisNP = np;
                thisNP.fade(1, 0, 1000);
                setTimeout(()=>{
                    thisNP.stop();
                }, 1000);
            }
            setTimeout(()=>{
                np = bgm.play();
            }, 500);
        }
        var lastFunction = function(){
            if(disagreeFn){
                detectSpace(agreeFn);
            }else{
                detectNewEvent(agreeFn, disagreeFn);
            }
        }
        if(dialog.length > 0){
            
            let functionsToCall = dialog.map((sentense) =>{
                showNewCut(cut);
                showDialog(sentense);
            })

            var current = 0;
            
            var loopStep = function(){
                detectSpace(()=>{
                    if(functionsToCall.length > 0){
                        loopStep(functionsToCall.shift());
                    }else{
                        lastFunction()
                    }
                })
            }
            loopStep(functionsToCall.shift());
        }else{
            lastFunction();
        }
    }

    // ================= Story ==================

    function start(){
        changeCut(images.scene1.scene1_1, ()=>{}, ()=>{}, bgms.scene1.song);
        
    }

}
var myp5 = new p5(s,'sketch0'); 