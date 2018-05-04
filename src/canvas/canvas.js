// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const opentype = require('opentype.js')
const p = require('paper')

'use strict';

export default class Moum {



// const currentCanvas = document.createElement('canvas');
// currentCanvas.resize = 'true';
// currentCanvas.id = 'myCanvas';
// document.body.appendChild(currentCanvas);

//initial setup
 constructor(currentCanvas){
    this.currentCanvas = currentCanvas;
    stylize();
    resizeCanvas();
    p.setup(currentCanvas);
    initLayers();
    draw.grid(100);
    this.canvasTool = new p.Tool();


    
    this.manage = {
        activateLayerById: function(name){
            p.project.layers[name].activate();
        }
    }


    this.draw = {
        vLine: function(x, d){
            //change if needed
            var dist = (d == undefined) ? 100 : d; /* distance between line */
            var margin = 5; /* margin between line and text */
            var extension = 1000; /* extended line for window pan/zoom/resize */
            var textsize = 8; /* fontsize for pointtext shift */
            //draw a vertical line
            var temp1 = new p.Point(x*dist, 0-extension);
            var temp2 = new p.Point(x*dist, currentCanvas.height+extension);
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
            var temp2 = new p.Point(currentCanvas.width+extension, y*dist);
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
            for(var i = 0, i = Math.round(i-extension/d); i < (currentCanvas.width+extension)/d; i++){
                this.vLine(i, d)
            }
            for(var i = 0, i = Math.round(i-extension/d); i < (currentCanvas.height+extension)/d; i++){
                this.hLine(i, d)
            }
        },
        point: function(){
            // p.project.layers
            if(arguments.length === 0){

            }
        }
    }

    DEFAULT_SCALING = 1

    this.zoom = {
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


    this.events = (function (){
        window.onresize = function(e){
            resizeCanvas();
            p.view.setViewSize(currentCanvas.width, currentCanvas.height);
            for(var i in p.project.layers){
                var tempLayer = p.project.layers[i]
                if(tempLayer.getVisible() == true){
                    tempLayer.setVisible(false);
                    tempLayer.setVisible(true);
                }
            }
        }
    })();
}

 stylize(){
    //docunment.body
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0px';
    //canvas(#myCanvas)
    currentCanvas.style.backgroundColor = 'white';
}

 resizeCanvas (){
    //if canvas is set in the body
    // p.setup(canvas);
    document.body.style.width = window.innerWidth+'px';
    document.body.style.height = window.innerHeight+'px';
    //always
    currentCanvas.style.width = currentCanvas.parentElement.offsetWidth+'px';
    currentCanvas.style.height = currentCanvas.parentElement.offsetHeight+'px';
    currentCanvas.width = currentCanvas.parentElement.offsetWidth;
    currentCanvas.height = currentCanvas.parentElement.offsetHeight;
    //set p.view.viewSize
};

 initLayers(){
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


};