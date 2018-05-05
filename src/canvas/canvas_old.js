// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log(document.parentElement)

const currentCanvas = document.createElement('canvas');
currentCanvas.resize = 'true';
currentCanvas.id = 'myCanvas';
document.body.appendChild(currentCanvas);

//initial setup
(function (){
    stylize();
    resizeCanvas();
    paper.setup(currentCanvas);
    initLayers();
})();

function stylize(){
    //docunment.body
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0px';
    //canvas(#myCanvas)
    currentCanvas.style.backgroundColor = 'white';
}

function resizeCanvas (){
    //if canvas is set in the body
    // paper.setup(canvas);
    document.body.style.width = window.innerWidth+'px';
    document.body.style.height = window.innerHeight+'px';
    //always
    currentCanvas.style.width = currentCanvas.parentElement.offsetWidth+'px';
    currentCanvas.style.height = currentCanvas.parentElement.offsetHeight+'px';
    currentCanvas.width = currentCanvas.parentElement.offsetWidth;
    currentCanvas.height = currentCanvas.parentElement.offsetHeight;
    //set paper.view.viewSize
};

function initLayers(){
    //remove All Layers
    if(paper.project.layers.length != 0){
        for(var i = 0; 0 < paper.project.layers.length; i++){
            paper.project.layers[0].remove()
        }
    }

    //add gridLayer
    paper.project.addLayer(new paper.Layer({
        children:[],
        name: "grid"
    }))
    //add baseline Layer
    paper.project.addLayer(new paper.Layer({
        children:[],
        name: "baseline"
    }))
    //add Glyph Layer
    paper.project.addLayer(new paper.Layer({
        children:[],
        name: "glyph"
    }))
    //add smart Glyph Layer
    paper.project.addLayer(new paper.Layer({
        children:[],
        name: "smartGlyph"
    }))
}

const manage = {
    activateLayerById: function(name){
        paper.project.layers[name].activate();
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
        var temp1 = new paper.Point(x*dist, 0-extension);
        var temp2 = new paper.Point(x*dist, currentCanvas.height+extension);
        var path = new paper.Path.Line(temp1, temp2);
        path.strokeColor = 'black';
        path.strokeWidth = 0.3;
        //draw text alinged with vertical line
        var text = new paper.PointText({
            point: [x*dist+margin, margin+textsize],
            content: x*dist,
            fillColor: 'darkgrey',
            // fontFamily: 'Courier New',
            // fontWeight: 'bold',
            fontSize: textsize
        })
        //group line and text
        new paper.Group([path, text])
    },
    hLine: function(y, d){
        //change if needed
        var dist = (d == undefined) ? 100 : d; /* distance between line */
        var margin = 5; /* margin between line and text */
        var extension = 1000; /* extended line for window pan/zoom/resize */
        var textsize = 8; /* fontsize for pointtext shift */
        //draw a vertical line
        var temp1 = new paper.Point(-extension, y*dist);
        var temp2 = new paper.Point(currentCanvas.width+extension, y*dist);
        var path = new paper.Path.Line(temp1, temp2);
        path.strokeColor = 'black';
        path.strokeWidth = 0.3;
        //draw text alinged with vertical line
        var text = new paper.PointText({
            point: [margin, y*dist-margin],
            content: y*dist,
            fillColor: 'darkgrey',
            // fontFamily: 'Courier New',
            // fontWeight: 'bold',
            fontSize: textsize
        })
        //group line and text
        new paper.Group([path, text])
    },
    grid: function(d){
        // paper.project.layers
        manage.activateLayerById('grid')
        var extension = 1000;
        for(var i = 0, i = Math.round(i-extension/d); i < (currentCanvas.width+extension)/d; i++){
            this.vLine(i, d)
        }
        for(var i = 0, i = Math.round(i-extension/d); i < (currentCanvas.height+extension)/d; i++){
            this.hLine(i, d)
        }
    },
    point: function(){
        // paper.project.layers
        if(arguments.length === 0){

        }
    }
}

const DEFAULT_SCALING = 1

const zoom = {
    in: function(point){
        if(point==undefined) point = paper.view.center;
        paper.view.scale(5/4, point)
    },
    out: function(point){
        if(point==undefined) point = paper.view.center;
        paper.view.scale(4/5, point)
    },
    extent: function(){
        paper.view.scaling = DEFAULT_SCALING;
    }
}


const events = (function (){
    window.onresize = function(e){
        resizeCanvas();
        paper.view.setViewSize(currentCanvas.width, currentCanvas.height);
        for(var i in paper.project.layers){
            var tempLayer = paper.project.layers[i]
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

var canvasTool = new paper.Tool();
canvasTool.onMouseDrag = function (event) {
    if(KEY_SPACE){
        offsetPoint = event.downPoint.subtract(event.point);
        paper.view.setCenter(paper.view.center.add(offsetPoint));
    }
};
let KEY_SPACE = false;
let KEY_CONTROL = false;
let KEY_V = false;
canvasTool.onKeyDown = function (event) {
    switch(event.key){
        case 'space':{
            KEY_SPACE = true;
            currentCanvas.style.cursor = 'move';
            return;
        } case 'v':{
            KEY_V = true;
            return;
        } case 'control':{
            KEY_CONTROL = true;
            currentCanvas.style.cursor = 'zoom-in';
        } default : {
            console.log(event)
        }
    }
}
canvasTool.onKeyUp = function (event) {
    switch(event.key){
        case 'space':{
            KEY_SPACE = false;
            currentCanvas.style.cursor = 'default';
            return;
        } case 'control':{
            KEY_CONTROL = false;
            currentCanvas.style.cursor = 'default';
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

currentCanvas.addEventListener('mousewheel', function(event){
    var tempPoint = new paper.Point(event.x, event.y);
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
        downPoint = new paper.Point(event.clientX, event.clientY)
    };
    canvas.onmouseup   = function() { isMouseDown = false };
    canvas.onmousemove = function(event) {
        if(isMouseDown) {
        var currentPoint = new paper.Point(event.clientX, event.clientY)
        console.log(event)
        console.log(downPoint);
        offsetPoint = downPoint.subtract(currentPoint);
        paper.view.setCenter(paper.view.center.add(offsetPoint));
        }
    };
*/

// const mPath = {
//     this = Object.assign({


//     }, paper.Path)
// }