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
        scene2:{
            scene2_2: null,
            scene2_3: null,
            scene2_5: null,
            scene2_be: null,
        },
        scene3:{
            scene3_1: null,
            scene3_2: null,
            scene3_be: null,
        },
        scene4:{
            scene4_1: null,
            scene4_2: null,
            scene4_be: null,
        },
        scene5:{
            scene5_1: null,
            scene5_2: null,
            scene5_3: null,
            scene5_be: null,
        },
        scene6:{
            scene6_1: null,
            ge: null,
            scene6_be: null,
        }
    };
    var bgms = {
        scene1:{
            Magica: 'Magica.aac',
        },
        scene2:{
            Magica: 'Magica.aac',
        },
        scene3:{
            Magica: 'Magica.aac',
        },
        scene4:{
            Magica: 'Magica.aac',
        },
        scene5:{
            Magica: 'Magica.aac',
        },
        scene6:{
            Magica: 'Magica.aac',
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
    function detectNewEvent(agreeFn, disagreeFn, cleanBefore = true){
        if(cleanBefore){
            heartA.removeAllListeners(['change']);
            keyboard.removeAllListeners(['press']);
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
    function showDialog(text){
        let margin = 10;
        let size = 0.3;
        let height = p5.windowHeight * size - 2 * margin;
        let width = p5.windowWidth - 2 * margin;
        let radios = 5;

        p5.rect(margin, p5.windowHeight - height - margin, width, height,radios,radios,radios,radios);

    }
    var np = null;
    function changeCut(cut, agreeFn, disagreeFn, bgm = null, dialog = []){
        showNewCut(cut);
        detectNewEvent(agreeFn, disagreeFn);
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
    }

    // ================= Story ==================

    function start(){
        changeCut(images.scene1.scene1_1, scene1cut2, ()=>{}, bgms.scene1.Magica);
        
    }

    function scene2cut1(){
        changeCut(images.scene2.scene2_2, scene2cut2, scene2cut3, );
    }

    function scene2cut2(){
        changeCut(images.scene2.scene2_5, scene3cut1, null);
    }

    function scene2cut3(){
        changeCut(images.scene2.scene2_3, scene2be, null);
    }

    function scene2be(){
        changeCut(images.scene2.scene2_be, null, null);
    }

    function scene3cut1(){
        changeCut(images.scene3.scene3_1, scene3cut2, scene3be);
    }

    function scene3cut2(){
        changeCut(images.scene3.scene3_2, scene4cut1, null);
    }

    function scene3be(){
        changeCut(images.scene3.scene3_be, null, null);
    }

    function scene4cut1(){
        changeCut(images.scene4.scene4_1, scene4be, scene4cut2);
    }

    function scene4cut2(){
        changeCut(images.scene4.scene4_2, scene5cut1, null);
    }

    function scene4be(){
        changeCut(images.scene4.scene4_be, null, null);
    }

    function scene5cut1(){
        changeCut(images.scene5.scene5_1, scene5cut2, scene5cut3);
    }

    function scene5cut2(){
        changeCut(images.scene5.scene5_3, scene6cut1, null);
    }

    function scene5cut3(){
        changeCut(images.scene5.scene5_2, scene5be, null);
    }

    function scene5be(){
        changeCut(images.scene5.scene5_be, null, null);
    }

    function scene6cut1(){
        changeCut(images.scene6.scene6_1, scene6be, goodend);
    }

    function scene6be(){
        changeCut(images.scene6.scene6_be, null, null);
    }

    function goodend(){
        changeCut(images.scene6.ge, null, null);
    }


}
var myp5 = new p5(s,'sketch0'); 