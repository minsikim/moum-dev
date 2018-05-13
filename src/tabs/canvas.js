// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const opentype = require('opentype.js')
const p = require('paper');
const path = require('path');

'use strict';

console.log('renderer.js init');
console.log(p);
global.FONT = null;
// let FONT = null;
setTimeout(()=>{
    console.log('loading FONT')
    global.FONT = opentype.loadSync(document.body.id);
},1000)


const canvas = document.createElement('canvas');
canvas.resize = 'true';
canvas.id = 'myCanvas';
const myCanvasDiv = document.getElementById('myCanvasDiv')
myCanvasDiv.appendChild(canvas);

//initial setup
(function (){
    stylize();
    resizeCanvas();
    p.setup(canvas);
    initLayers();
})();

function stylize(){
    //docunment.body
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0px';
    //canvas(#myCanvas)
    canvas.style.backgroundColor = 'white';
}

function resizeCanvas (){
    //if canvas is set in the body
    // // p.setup(canvas);
    // document.body.style.width = window.innerWidth+'px';
    // document.body.style.height = window.innerHeight+'px';
    // //always
    canvas.style.width = canvas.parentElement.offsetWidth+'px';
    canvas.style.height = canvas.parentElement.offsetHeight+'px';
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    //set p.view.viewSize
};

function initLayers(){
    //remove All Layers
    if(p.project.layers.length != 0){
        for(var i = 0; 0 < p.project.layers.length; i++){
            p.project.layers[0].remove()
        }
    }

    //add gridLayer
    p.project.addLayer(new p.Layer({
        children:[],
        name: "grid"
    }))
    //add baseline Layer
    p.project.addLayer(new p.Layer({
        children:[],
        name: "baseline"
    }))
    //add Glyph Layer
    p.project.addLayer(new p.Layer({
        children:[],
        name: "glyph"
    }))
    //add smart Glyph Layer
    p.project.addLayer(new p.Layer({
        children:[],
        name: "smartGlyph"
    }))
    //add smart Glyph Layer
    p.project.addLayer(new p.Layer({
        children:[],
        name: "editMode"
    }))
    p.project.getLayerByName = (name)=>{
        for(var i = 0; i < p.project.layers.length; i++){
            if(p.project.layers[i].name === name){
                return p.project.layers[i];
            } 
        }
    }
}

const manage = {
    activateLayerByName: function(name){
        p.project.layers[name].activate();
    },
    getLayerByName: function(name){
        for(var i = 0; i < p.project.layers.length; i++){
            if(p.project.layers[i].name === name){
                return p.project.layers[i];
            } 
        }
    },
    clearLayer: function(name){
        var layer = this.getLayerByName(name);
        layer.removeChildren();
    }

}


const draw = {
    vLine: function(x, d){
        //change if needed
        var dist = (d == undefined) ? 100 : d; /* distance between line */
        var margin = 5; /* margin between line and text */
        var extension = 1000; /* extended line for window pan/zoom/resize */
        var textsize = 8; /* fontsize for pointtext shift */
        //draw a vertical line
        var temp1 = new p.Point(x*dist, 0-extension);
        var temp2 = new p.Point(x*dist, canvas.height+extension);
        var path = new p.Path.Line(temp1, temp2);
        path.strokeColor = 'black';
        path.strokeWidth = 0.3;
        path.strokeScaling = false;
        //draw text alinged with vertical line
        var text = new p.PointText({
            point: [x*dist+margin, margin+textsize],
            content: x*dist,
            fillColor: 'darkgrey',
            // fontFamily: 'Courier New',
            // fontWeight: 'bold',
            fontSize: textsize
        })
        //group line and text
        new p.Group([path, text])
    },
    hLine: function(y, d){
        //change if needed
        var dist = (d == undefined) ? 100 : d; /* distance between line */
        var margin = 5; /* margin between line and text */
        var extension = 1000; /* extended line for window pan/zoom/resize */
        var textsize = 8; /* fontsize for pointtext shift */
        //draw a vertical line
        var temp1 = new p.Point(-extension, y*dist);
        var temp2 = new p.Point(canvas.width+extension, y*dist);
        var path = new p.Path.Line(temp1, temp2);
        path.strokeColor = 'black';
        path.strokeWidth = 0.3;
        path.strokeScaling = false;
        //draw text alinged with vertical line
        var text = new p.PointText({
            point: [margin, y*dist-margin],
            content: y*dist,
            fillColor: 'darkgrey',
            // fontFamily: 'Courier New',
            // fontWeight: 'bold',
            fontSize: textsize
        })
        //group line and text
        new p.Group([path, text])
    },
    grid: function(d){
        // p.project.layers
        manage.activateLayerByName('grid')
        var extension = 2000;
        for(var i = 0, i = Math.round(i-extension/d); i < (canvas.width+extension)/d; i++){
            this.vLine(i, d)
        }
        for(var i = 0, i = Math.round(i-extension/d); i < (canvas.height+extension)/d; i++){
            this.hLine(i, d)
        }
    },
    point: function(){
        // p.project.layers
        if(arguments.length === 0){

        }
    },
    selectionBox: function(x1,y1,x2,y2){
        var p1 = new p.Point(x1,y1);
        var p2 = new p.Point(x2,y2);
        var box = new p.Rectangle(p1,p2);
        box.
    }
}

const DEFAULT_SCALING = 1

const zoom = {
    in: function(point){
        if(point==undefined) point = p.view.center;
        p.view.scale(5/4, point)
    },
    out: function(point){
        if(point==undefined) point = p.view.center;
        p.view.scale(4/5, point)
    },
    extent: function(){
        p.view.scaling = DEFAULT_SCALING;
    }
}


const events = (function (){
    window.onresize = function(e){
        resizeCanvas();
        p.view.setViewSize(canvas.width, canvas.height);
        for(var i in p.project.layers){
            var tempLayer = p.project.layers[i]
            if(tempLayer.getVisible() == true){
                tempLayer.setVisible(false);
                tempLayer.setVisible(true);
            }
        }
    }
})();

draw.grid(100);

//CURSOR EVENTS

var isMouseDown = false;
var offsetPoint;
var downPoint;

var canvasTool = new p.Tool();
canvasTool.onMouseDrag = function (event) {
    if(KEY_SPACE){
        offsetPoint = event.downPoint.subtract(event.point);
        p.view.setCenter(p.view.center.add(offsetPoint));
    }else{
        
    }
};

const EDIT_MODE = {
    CURRENT: 'SELECTION_MODE_V',
    LAST: 'SELECTION_MODE_V',
    SELECTION_MODE_V : true,
    SELECTION_MODE_A : false,
    PATH_MODE_P : false,
    CUT_MODE_C : false,
    PAN_MODE_SPACE : false,
    ZOOM_MODE_CTRL : false
}
const LAYER_VISIBLE = {
    GRID : true,
    RULER : true,
    COCORDINATES : true
}

function setMode(modeName){
    var count = 0;
    if(getEditMode() !== modeName ) EDIT_MODE.LAST = getEditMode();
    console.log('setMode() => changing', EDIT_MODE.LAST, 'to', modeName)
    for(var key in EDIT_MODE){
        if(modeName === key){
            EDIT_MODE[key] = true;
            count += 1;
        }else if(modeName !== key && typeof EDIT_MODE[key] !== 'string'){
            EDIT_MODE[key] = false;
        }
    }
    if(count != 1){
        setMode('SELECTION_MODE_V');
    }
    EDIT_MODE.CURRENT = getEditMode();
    updateCursor();
}

function getEditMode(){
    for(var key in EDIT_MODE){
        if(EDIT_MODE[key] === true){
            return key;
        }
    }
}

function setCursorOnCanvas(name, type){
    if(type == 'url'){
        canvas.style.cursor = 'url("../../assets/cursor/'+name+'.png"),auto'
    }else{
        canvas.style.cursor = name;
    }
}

function updateCursor(){
    var currentMode = getEditMode();
    switch(currentMode){
        case 'SELECTION_MODE_A':{
            console.log('setting mode to SELECTION_MODE_A')
            setCursorOnCanvas('select_a', 'url');
            break;
        }
        case 'PATH_MODE_P':{
            console.log('setting mode to PATH_MODE_P')
            setCursorOnCanvas('path', 'url');
            break;
        }
        case 'CUT_MODE_C':{
            console.log('setting mode to CUT_MODE_C')
            setCursorOnCanvas('cut', 'url');
            break;
        }
        case 'SELECTION_MODE_V':{
            console.log('setting mode to SELECTION_MODE_V')
            setCursorOnCanvas('default');
            break;
        }
        case 'PAN_MODE_SPACE':{
            console.log('setting mode to PAN_MODE_SPACE')
            setCursorOnCanvas('move');
            break;
        }
        case 'ZOOM_MODE_CTRL':{
            console.log('setting mode to PAN_MODE_SPACE')
            setCursorOnCanvas('zoom-in');
            break;
        }
    }
}

canvasTool.onKeyDown = function (event) {
    console.log('keydown', event.key);
    switch(event.key){
        case 'space':{
            setMode('PAN_MODE_SPACE')
            break;
        } case 'v':{
            setMode('SELECTION_MODE_V')
            break;
        } case 'a':{
            setMode('SELECTION_MODE_A')
            break;
        } case 'c':{
            setMode('CUT_MODE_C')
            break;
        } case 'p':{
            setMode('PATH_MODE_P')
            break;
        } case 'control':{
            setMode('ZOOM_MODE_CTRL')
            break;
        } default : {
            console.log(event)
            break;
        }
    }
}
canvasTool.onKeyUp = function (event) {
    console.log('keyup', event.key);
    switch(event.key){
        case 'space':{
            setMode(EDIT_MODE.LAST);
            break;
        } case 'control':{
            setMode(EDIT_MODE.LAST);
            break;
        }
    }
}

var testE;
canvasTool.onMouseDown = function (event) {
    var currentMode = getEditMode();
    switch(currentMode){
        case 'SELECTION_MODE_A':{
            break;
        }
        case 'PATH_MODE_P':{
            break;
        }
        case 'CUT_MODE_C':{
            break;
        }
        case 'SELECTION_MODE_V':{
            break;
        }
        case 'PAN_MODE_SPACE':{
            break;
        }
        case 'ZOOM_MODE_CTRL':{
            if(event.event.which == 2){
                zoom.extent();
            }
            break;
        }
    }
}
canvasTool.onMouseUp = function (event) {
    var currentMode = getEditMode();
    switch(currentMode){
        case 'SELECTION_MODE_A':{
            break;
        }
        case 'PATH_MODE_P':{
            break;
        }
        case 'CUT_MODE_C':{
            break;
        }
        case 'SELECTION_MODE_V':{
            break;
        }
        case 'PAN_MODE_SPACE':{
            break;
        }
        case 'ZOOM_MODE_CTRL':{
            break;
        }
    }
}

canvasTool.onMouseDrag = function (event) {
    var currentMode = getEditMode();
    switch(currentMode){
        case 'SELECTION_MODE_A':{
            break;
        }
        case 'PATH_MODE_P':{
            break;
        }
        case 'CUT_MODE_C':{
            break;
        }
        case 'SELECTION_MODE_V':{
            manage.activateLayerByName('editMode');
            var startX = event.downPoint.x;
            var startY = event.downPoint.y;
            var endX = event.point.x;
            var endY = event.point.y;
            
            console.log(event)
            break;
        }
        case 'PAN_MODE_SPACE':{
            offsetPoint = event.downPoint.subtract(event.point);
            p.view.setCenter(p.view.center.add(offsetPoint));
            break;
        }
        case 'ZOOM_MODE_CTRL':{
            break;
        }
    }
}

canvas.addEventListener('mousewheel', function(event){
    var tempPoint = new p.Point(event.x, event.y);
    if(getEditMode() !== 'ZOOM_MODE_CTRL') return;
    if(0 < event.wheelDeltaY){
        zoom.in(tempPoint);
    } else if(0 > event.wheelDeltaY){
        zoom.out(tempPoint);
    }
}, false)

/* 
    canvas.onmousedown = function(event) {
        isMouseDown = true
        downPoint = new p.Point(event.clientX, event.clientY)
    };
    canvas.onmouseup   = function() { isMouseDown = false };
    canvas.onmousemove = function(event) {
        if(isMouseDown) {
        var currentPoint = new p.Point(event.clientX, event.clientY)
        console.log(event)
        console.log(downPoint);
        offsetPoint = downPoint.subtract(currentPoint);
        p.view.setCenter(p.view.center.add(offsetPoint));
        }
    };
*/

// const mPath = {
//     this = Object.assign({


//     }, p.Path)
// }