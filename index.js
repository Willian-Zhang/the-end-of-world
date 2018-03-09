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
            Somnus_Ultima_2_be: '2_be_Somnus Ultima.mp3',
            What_Lies_Within_2_2: '2_2_What Lies Within.mp3',
            Fantastica_2_5: '2_5_Fantastica.acc',
        },
        scene3:{
            Nier_Copied_City_3_1: '3_1_Nier Copied City.aac',
            You_Say_Run_3_2: '3_2_You Say Run.acc',
            Weight_of_the_World_3_be: '3_be_The Weight of the World.acc',
        },
        scene4:{
            Layer_Cake_4_1 : '4_1 Layer Cake .aac',
            Horizon_4_2: '4_2 Horizon.acc',
            Sadness_4_be: '4_be Sadness.acc',
        },
        scene5:{
            Dark_Colossus_5_1: '5_1 Dark Colossus.aac',
            don_think_twice_5_2: '5_2 dont think twice.acc',
            Pokemon_5_3: '5_3 Pokemon Omega RubyAlpha Sapphire - Battle! Zinnia Music (HQ).acc',
            To_Zanarkand_5_be: '5_be To Zanarkand.acc',
        },
        scene6:{
            song_of_the_Ancients_6_1: '6_1 song of the Ancients - Atonement.aac',
            Little_Busters_6_be: '6_be Little Busters Piano Cover.acc',
            Dearly_Beloved_Kingdom_Hearts_6_ge: '6_ge Dearly Beloved Kingdom Hearts',
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
                detectNewEvent(agreeFn, disagreeFn);
            }else{
                detectSpace(agreeFn);
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
        changeCut(images.scene1.scene1_1, scene1cut2, null, bgms.scene1.Magica);
        
    }

    function scene1cut2(){
        changeCut(images.scene1.scene1_2, scene2cut1, null, bgms.scene1.What_Lies_Within_2_2);
    }

    function scene2cut1(){
        changeCut(images.scene2.scene2_2, scene2cut2, scene2cut3, bgms.scene2.What_Lies_Within_2_2);
    }

    function scene2cut2(){
        changeCut(images.scene2.scene2_5, scene3cut1, null, bgms.scene2.Fantastica_2_5);
    }

    function scene2cut3(){
        changeCut(images.scene2.scene2_3, scene2be, null, bgms.scene2.Somnus_Ultima_2_be);
    }

    function scene2be(){
        changeCut(images.scene2.scene2_be, null, null, null);
    }

    function scene3cut1(){
        changeCut(images.scene3.scene3_1, scene3cut2, scene3be, bgms.scene3.Nier_Copied_City_3_1);
    }

    function scene3cut2(){
        changeCut(images.scene3.scene3_2, scene4cut1, null, bgms.scene3.You_Say_Run_3_2);
    }

    function scene3be(){
        changeCut(images.scene3.scene3_be, null, null, bgms.scene3.Weight_of_the_World_3_be);
    }

    function scene4cut1(){
        changeCut(images.scene4.scene4_1, scene4be, scene4cut2, bgms.scene4.Layer_Cake_4_1);
    }

    function scene4cut2(){
        changeCut(images.scene4.scene4_2, scene5cut1, null, bgms.scene4.Horizon_4_2);
    }

    function scene4be(){
        changeCut(images.scene4.scene4_be, null, null, bgms.scene4.Sadness_4_be);
    }

    function scene5cut1(){
        changeCut(images.scene5.scene5_1, scene5cut2, scene5cut3, bgms.scene5.Dark_Colossus_5_1);
    }

    function scene5cut2(){
        changeCut(images.scene5.scene5_3, scene6cut1, null, bgms.scene5.don_think_twice_5_2);
    }

    function scene5cut3(){
        changeCut(images.scene5.scene5_2, scene5be, null, bgms.scene5.Pokemon_5_3);
    }

    function scene5be(){
        changeCut(images.scene5.scene5_be, null, null, bgms.scene5.To_Zanarkand_5_be);
    }

    function scene6cut1(){
        changeCut(images.scene6.scene6_1, scene6be, goodend, bgms.scene6.song_of_the_Ancients_6_1);
    }

    function scene6be(){
        changeCut(images.scene6.scene6_be, null, null, bgms.scene6.Little_Busters_6_be);
    }

    function goodend(){
        changeCut(images.scene6.ge, null, null, bgms.scene6.Dearly_Beloved_Kingdom_Hearts_6_ge);
    }


}
var myp5 = new p5(s,'sketch0'); 