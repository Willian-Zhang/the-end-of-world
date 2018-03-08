import  './libraries/jquery.min.js';
import './libraries/loading-bar.min.js';
import {AnalogReader} from './Devices.js';

var images = {
    scene1:{
        scene1_1: null,
        scene1_2: null,
    }
};
const resourcePath = 'resources';
function preload() {
    // Load all images
    Object.keys(images).forEach(scene=>{
        Object.keys(images[scene]).forEach(cut=>{
            images[scene][cut]  = loadImage(`${resourcePath}/${scene}/${cut}.png`);
        });
    });
}

let heartA = new AnalogReader();
let heartB = new AnalogReader();
function setup() {   
    {// connection
        let board = new Board([heartA , heartB]);
        let port = board.connect({baudrate: 9600});
        console.log(`Connecting on ${port}...`);
        board.on('connected', ()=>{
            console.log('connected');
    
            // Start game here:
    
        });
        board.on('warning', (warning)=>{
            console.warn(warning);
        });
    }
    
    {// 
        createCanvas(windowWidth, windowHeight);
    }
}
function draw() {

}

// let bloodDOM = $('#blood')[0];
var bloodBar = new ldBar("#blood");
function set_blood(value){
    "use strict";
    bloodBar.set(value);
}


