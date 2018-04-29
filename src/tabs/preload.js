const electron = require('electron');
const {ipcRenderer} = electron;

console.log('preload.js activated')

ipcRenderer.on('load-on-canvas', (event, props)=>{
    console.log('receiving load-on-canvas in canvas.js'+Date.now())
    console.log(props);
})