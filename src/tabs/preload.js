const electron = require('electron');
const paper = require('paper');
const opentype = require('opentype.js');
const {ipcRenderer} = electron;

console.log('preload.js activated')

let myFont = null;

ipcRenderer.on('load-on-canvas', (event, props)=>{
    console.log('receiving load-on-canvas in canvas.js'+Date.now())
    myFont = opentype.loadSync(props[0]);
})