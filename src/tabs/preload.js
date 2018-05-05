const electron = require('electron');
const paper = require('paper');
const opentype = require('opentype.js');
const {ipcRenderer} = electron;
const { TEST_FONT, FONT_INFO } = require('../constants/event-names')

console.log('preload.js activated')

let myFont = null;

ipcRenderer.on('load-on-canvas', (event, props)=>{
    console.log('receiving load-on-canvas in canvas.js'+Date.now())
    console.log(props[1])
    setTimeout(()=>{
        document.body.id = props[1];
        document.props = props;
    },1000);
})

ipcRenderer.on(TEST_FONT, (event, props)=>{
    console.log('test button init');
    ipcRenderer.send(FONT_INFO, global.FONT);
})