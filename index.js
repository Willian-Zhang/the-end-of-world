'use strict';

var images = {
    scene1:{
        scene1_1: null,
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

function setup() {   

}
function draw() {

}

var bloodDOM = $('#blood')[0];
function set_blood(value){
    bloodDOM.ldBar.set(value);
}