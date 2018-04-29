const electron = require('electron');
const paper = require('paper');
const opentype = require('opentype.js');
const {ipcRenderer} = electron;

console.log('preload.js activated')

let myFont = null;

ipcRenderer.on('load-on-canvas', (event, props)=>{
    console.log('receiving load-on-canvas in canvas.js'+Date.now())
    console.log(props[1])
    setTimeout(()=>{
        document.body.id = props[1];
    },3000);
})