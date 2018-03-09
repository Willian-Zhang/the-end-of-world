import  './libraries/jquery.min.js';
import './libraries/loading-bar.min.js';
import {AnalogReader, CatagorialReader} from './Devices.js';
import './libraries/p5.js';
import './libraries/p5.serialport.js';
import {Board} from './Arduino.js';
import './libraries/howler.js';
import {Keybaord, GameState} from './GameEntity.js';

var np = null;
var s = function(p5) {
    "use strict";
    let reward = 25;
    let panelty  = 35;
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
            Somnus_Ultima_2_be: '2_be_SomnusUltima.mp3',
            What_Lies_Within_2_2: '2_2_WhatLiesWithin.mp3',
            Fantastica_2_5: '2_5_Fantastica.aac',
        },
        scene3:{
            Nier_Copied_City_3_1: '3_1_NierCopiedCity.aac',
            You_Say_Run_3_2: '3_2_YouSayRun.aac',
            Weight_of_the_World_3_be: '3_be_TheWeightoftheWorld.aac',
        },
        scene4:{
            Layer_Cake_4_1 : '4_1LayerCake.aac',
            Horizon_4_2: '4_2Horizon.aac',
            Sadness_4_be: '4_beSadness.aac',
        },
        scene5:{
            Dark_Colossus_5_1: '5_1DarkColossus.aac',
            don_think_twice_5_2: '5_2dontthinktwice.aac',
            Pokemon_5_3: '5_3PokemonOmegaRubyAlphaSapphire.aac',
            To_Zanarkand_5_be: '5_beToZanarkand.aac',
        },
        scene6:{
            song_of_the_Ancients_6_1: '6_1songoftheAncients.aac',
            Little_Busters_6_be: '6_beLittleBustersPianoCover.aac',
            Dearly_Beloved_Kingdom_Hearts_6_ge: '6_geDearlyBelovedKingdomHearts.aac',
        },
        all:{
            Weight_of_the_World:"TheWeightoftheWorld_jp.m4a"
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
        
    }
    p5.draw = function(){   

    }
    var gameState = new GameState();
    heartB.on('tick', (value)=>{
        if(gameState.state.blood < 120){
            gameState.add(value/255);
        }
    })
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
        keyboard.on('press', async event=>{
            if(event.code === "Backquote"){
                let input = await swal("Cheatcode:", {
                    content: "input",
                  });
                if(input.includes('scene')){
                    s[input]();
                }
                else{
                    gameState.state.blood = +input;
                }
            }
            
        });
    }
    function detectNewEvent(agreeFn, disagreeFn, cleanBefore = true){
        if(cleanBefore){
            clearEventListeners();
        }
        heartA.once('change', value=>{
            console.log(value);
            if(value == 1){
                gameState.add(reward);
                agreeFn();
            }else if(value == 2){
                gameState.add(-panelty);
                disagreeFn();
            }
        });
        keyboard.on('press', event=>{
            switch (event.code) {
                case 'KeyA':
                    gameState.add(reward);
                    agreeFn();
                    break;
                case 'KeyD':
                    gameState.add(-panelty);
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
                case 'ArrowDown':
                case 'ArrowRight':
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
        p5.push();
        p5.textSize(32);
        p5.text(text, x + textMargin, y + textMargin , width - 2*textMargin, height - 2*textMargin);
        p5.pop();
    }
    function showDoAction(){
        let margin = 10;
        let size = 0.3;
        let textMargin = 15;
        let textSize = 24;
        p5.push();
        p5.fill(128);
        p5.textFont('Helvetica');
        p5.textSize(textSize);
        p5.textStyle(p5.BOLD);
        p5.textAlign(p5.CENTER);
        p5.text('<action>', p5.windowWidth/2, p5.windowHeight - textMargin - margin);
        p5.pop();
    }
    function showSpaceAction(){
        let margin = 10;
        let size = 0.3;
        let textMargin = 15;
        let textSize = 24;
        p5.push();
        p5.fill(128);
        p5.textFont('Helvetica');
        p5.textSize(textSize);
        p5.textStyle(p5.BOLD);
        p5.textAlign(p5.CENTER);
        p5.text('⇓', p5.windowWidth/2, p5.windowHeight - textMargin - margin);
        p5.pop();
    }
    
    function changeCut(cut, agreeFn, disagreeFn=null, bgm = null, dialog = []){
        showNewCut(cut);
        if(bgm){
            if(np){
                let thisNP = np;
                thisNP.once('fade', ()=>{
                    thisNP.stop();
                    thisNP.volume(1);
                });
                thisNP.fade(1, 0, 1000);
            }
            setTimeout(()=>{
                bgm.play();
                np = bgm;
            }, 500);
        }
        var lastFunction = function(){
            if(disagreeFn){
                showDoAction();
                detectNewEvent(agreeFn, disagreeFn);
            }else{
                showSpaceAction();
                detectSpace(agreeFn);
            }
        }
        if(dialog.length > 0){
            console.log(dialog)
            let functionsToCall = dialog.map(sentense => function(){
                showNewCut(cut);
                showDialog(sentense);
            });

            
            var loopStep = function(func){
                showSpaceAction();
                detectSpace(()=>{
                    func();
                    if(functionsToCall.length > 0){
                        loopStep(functionsToCall.shift());
                    }else{
                        lastFunction();
                    }
                });
            };
            loopStep(functionsToCall.shift());
        }else{
            lastFunction();
        }
    }
    
    // ================= Story ==================

    async function popGameEnd(){
        gameState.removeAllListeners('report');
        let value = await swal({
            title: "Do you want to restart the game?",
            icon: "info",
            button: "restart",
            dangerMode: true,
          });
        start();
    }
    function blood_report(blood){
        if(blood < 0){
            gameState.removeAllListeners('report');
            changeCut(images.scene3.scene3_be, popGameEnd, null, bgms.all.Weight_of_the_World, 
                ["Oh no... //TODO:"]);
            set_blood(0);
        }else{
            set_blood(blood);
        }
    }
    function start(){
        gameState.not_touching_threshold = heartB.value/255;
        gameState.reset();
        gameState.on('report', blood_report);
        changeCut(images.scene1.scene1_1, scene1cut2, null, bgms.scene1.Magica, 
            ["Welcome to the chaotic end of the world. The only people remaining appear to be you and your partner."]);
    }

    function scene1cut2(){
        gameState.start_counting();
        changeCut(images.scene1.scene1_2, scene2cut1, null, null,
            ["You have to make decisions, and you have to make them fast."]);
    }

    function scene2cut1(){
        changeCut(images.scene2.scene2_2, scene2cut2, scene2cut3, bgms.scene2.What_Lies_Within_2_2,
            ["Quick, you must decide if you should leave the building and seek resources or remain inside so that you can be sheltered."]);
    }

    function scene2cut2(){
        changeCut(images.scene2.scene2_5, scene3cut1, null, bgms.scene2.Fantastica_2_5,
            ["Wow, you made it out of the building just in time!"]);
    }

    function scene2cut3(){
        changeCut(images.scene2.scene2_3, scene2be, null, bgms.scene2.Somnus_Ultima_2_be,
            ["OH NO! You should’ve left the building. It’s falling! Do something!!!!"]);
    }

    function scene2be(){
        changeCut(images.scene2.scene2_be, popGameEnd, null, null,["...game over"]);
    }

    function scene3cut1(){
        changeCut(images.scene3.scene3_1, scene3cut2, scene3be, bgms.scene3.Nier_Copied_City_3_1, 
            ["It looks like the only way to stay alive is to find a panic room and get access to protection and resources.", " Do you take a chance and run to the panic room or do you try to find the closest shelter?"]);
    }

    function scene3cut2(){
        changeCut(images.scene3.scene3_2, scene4cut1, null, bgms.scene3.You_Say_Run_3_2),
        ["You guys are great at sticking together.", " You are just now realizing that your bond is so special that you cannot be separated"];
    }

    function scene3be(){
        changeCut(images.scene3.scene3_be, popGameEnd, null, bgms.scene3.Weight_of_the_World_3_be, 
            ["Oh no...this life or death situation has caused you two to split up and proceed alone.", " Unfortunately you must end your relationship."]);
    }

    function scene4cut1(){
        changeCut(images.scene4.scene4_1, scene4be, scene4cut2, bgms.scene4.Layer_Cake_4_1, 
            ["It’s been a long day and you haven’t found shelter or food or water. You are desperate.", " You need energy, and you know that you will need to stock up...", "you encounter a stranger. He has a gallon of water and so much food.", " It’s so tempting, and he’s so weak...do you take her food and water?"]);
    }

    function scene4cut2(){
        changeCut(images.scene4.scene4_2, scene5cut1, null, bgms.scene4.Horizon_4_2, 
            ["That extra gallon of water was just enough for you and your partner to push forward and continue your journey.", " It’s survival of the fittest out here!"]);
    }

    function scene4be(){
        changeCut(images.scene4.scene4_be, popGameEnd, null, bgms.scene4.Sadness_4_be, 
            ["Your both become exhausted and pass out. This is the end. You have both died."]);
    }

    function scene5cut1(){
        changeCut(images.scene5.scene5_1, scene5cut2, scene5cut3, bgms.scene5.Dark_Colossus_5_1, 
            ["What are those wild dogs doing? What’s that they’re eating?", " Oh no, it’s a baby It is being eaten?", " Do you decide to save yourself and your partner instead?"]);
    }

    function scene5cut2(){
        changeCut(images.scene5.scene5_3, scene6cut1, null, bgms.scene5.don_think_twice_5_2,
            ["Oh my gosh! You almost died. That baby was going to die anyway.", " At least you made it out alive and your partner is there to keep you company"]);
    }

    function scene5cut3(){
        changeCut(images.scene5.scene5_2, scene5be, null, bgms.scene6.song_of_the_Ancients_6_1,
            ["Oh no! Not your partner!Run!!!"]);
    }

    function scene5be(){
        changeCut(images.scene5.scene5_be, popGameEnd, null, bgms.scene5.To_Zanarkand_5_be,
            ["While you manage to get away with the baby, your partner is eaten by wolves.", " You are left alone with a baby in this scary world."]);
    }

    function scene6cut1(){
        changeCut(images.scene6.scene6_1, scene6be, goodend, bgms.scene5.Pokemon_5_3, 
            ["THE WOLVES ARE EATING OUR CAT. OH NO, THEY’RE EATING YOU TOO.", " WHAT DO I DO?!? Do I save my cat?"]);
    }

    function scene6be(){
        changeCut(images.scene6.scene6_be, popGameEnd, null, bgms.scene6.Little_Busters_6_be,
            ["The truth is, you just saved a cat instead of saving your partner…", " Your partner is now dead and you are stuck with your cat."]);
    }

    function goodend(){
        changeCut(images.scene6.ge, popGameEnd, null, bgms.scene6.Dearly_Beloved_Kingdom_Hearts_6_ge,
            ["Woh, I can’t believe that was a nightmare.", " None of it is real. The love of your life is right next to you."]);
    }


}
var myp5 = new p5(s,'sketch0'); 