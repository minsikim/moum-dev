// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';

console.log('renderer.js init');
const p = require('paper');
console.log(p);

const canvas = document.createElement('canvas');
canvas.resize = 'true';
canvas.id = 'myCanvas';
document.body.appendChild(canvas);

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
    // p.setup(canvas);
    document.body.style.width = window.innerWidth+'px';
    document.body.style.height = window.innerHeight+'px';
    //always
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
}

const manage = {
    activateLayerById: function(name){
        p.project.layers[name].activate();
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
        manage.activateLayerById('grid')
        var extension = 1000;
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
    }
};
let KEY_SPACE = false;
let KEY_CONTROL = false;
let KEY_V = false;
canvasTool.onKeyDown = function (event) {
    switch(event.key){
        case 'space':{
            KEY_SPACE = true;
            canvas.style.cursor = 'move';
            return;
        } case 'v':{
            KEY_V = true;
            return;
        } case 'control':{
            KEY_CONTROL = true;
            canvas.style.cursor = 'zoom-in';
        } default : {
            console.log(event)
        }
    }
}
canvasTool.onKeyUp = function (event) {
    switch(event.key){
        case 'space':{
            KEY_SPACE = false;
            canvas.style.cursor = 'default';
            return;
        } case 'control':{
            KEY_CONTROL = false;
            canvas.style.cursor = 'default';
        }
    }
}

var testE;
canvasTool.onMouseDown = function (event) {
    if(event.event.which == 2 && KEY_CONTROL==true){
        zoom.extent();
    }
    switch(KEY_SPACE){
        case true :{
            // canvas.style.cursor = 'grabbing';
            return;
        }case false:{
            return;
        }
    }
}
canvasTool.onMouseUp = function (event) {
    switch(KEY_SPACE){
        case true :{
            // canvas.style.cursor = 'grab';
            return;
        }case false:{
            return;
        }
    }
}

canvas.addEventListener('mousewheel', function(event){
    var tempPoint = new p.Point(event.x, event.y);
    if(KEY_CONTROL == false) return;
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