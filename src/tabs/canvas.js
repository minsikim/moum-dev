import { Color } from 'paper';

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const opentype = require('opentype.js')
const p = require('paper');
const path = require('path');
const {ipcRenderer} = require('electron');
const { TEST_FONT, FONT_INFO, FONT_TO_LOG_BAR, TO_LOG_BAR } = require('../constants/event-names')
const autoBind = require('auto-bind');

'use strict';

global.FONT = null;
setTimeout(()=>{
    if(global.FONT == null) global.FONT = new opentype.Font({
        familyName: 'myFont',
        styleName: 'Regular',
        unitsPerEm : 1000,
        ascender: 600,
        descender: -200,
    });
    console.log('test button init: sending arg: ', global.FONT);
    ipcRenderer.send(FONT_INFO, FONT);
},1500)

function log(args){
    var message = '';
    for(var i = 0; i < arguments.length; i++){
        message += arguments[i]
        if(i !== arguments.length-1 || arguments.length !==1) message += ', '
    }
    ipcRenderer.send(TO_LOG_BAR, message);
}

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
        children:[new p.Group({name: 'currentPath'})],
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
        return p.project.layers[name];
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
        if(name == 'glyph') {
            layer.removeChildren(1);
            layer.children[0].removeChildren();
            
        }
        else layer.removeChildren();
    },
    getCurrentPath: function(){
        return manage.getLayerByName('glyph').getFirstChild()
    },
    isSelected: function(){
        for(var key in this.getLayerByName('glyph').children){
            for(var key2 in this.getLayerByName('glyph').children[key].children){
                if(this.getLayerByName('glyph').children[key].children[key2].select===true){
                    return true;
                }
            }
        }
        return false;
    }
}


const draw = {
    basePoint:  (FONT) ? new p.Point(0,FONT.unitsPerEm) : new p.Point(0,1000),
    vLine: function(x, d){
        //change if needed
        var dist = (d == undefined) ? 100 : d; /* distance between line */
        var margin = 5; /* margin between line and text */
        var extension = 2000; /* extended line for window pan/zoom/resize */
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
        var extension = 2000; /* extended line for window pan/zoom/resize */
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
    point: function(x,y){
        // p.project.layers
        x = Math.round(x);
        y = Math.round(y);
        manage.activateLayerByName('glyph');
        var point = new Point(x,y);
        point.pointActivate();
        var index = manage.getCurrentPath().children.length!==0 ? manage.getCurrentPath().children.length-1 : null;
        if(index !== null) {manage.getCurrentPath().children[index].pointDeactivate();}
        manage.getCurrentPath().addChild(point)
        log('New Point: '+x+', '+y)
    },
    selectionBox: function(x1,y1,x2,y2){
        manage.clearLayer('editMode')
        manage.activateLayerByName('editMode');
        var p1 = new p.Point(x1,y1);
        var p2 = new p.Point(x2,y2);
        var box = new p.Path.Rectangle(p1,p2);
        box.strokeColor = '#0098FF';
        box.strokeScaling = false;
        box.fillColor = '#0098FF';
        box.fillColor.alpha = 0.1;
    },
    glyph: function(char, point){
        manage.activateLayerByName('glyph');
        
        var basePoint = (point == undefined) ? this.basePoint : point;
        var glyph = FONT.charToGlyph(char);
        var pathArr = [];
        var pathGroup = new p.CompoundPath({
            fillColor: 'white',
            strokeColor: 'black',
            strokeWidth: 3,
            strokeScaling: false,
        })

        console.log(basePoint)

        var tempLastPoint = 0;
        for(var i = 0; i < glyph.points.length; i++){
            if(glyph.points[i].lastPointOfContour == true){
                pathArr.push(glyph.points.slice(tempLastPoint, i+1));
                tempLastPoint = i+1;
            }
        }

        pathArr.map((pathElement)=>{
            var path = new p.Path({
                closed: true
            });
            pathElement.map((obj)=>{
                path.add(draw.calc(obj.x, obj.y, basePoint))
                this.point(draw.calc(obj.x, obj.y, basePoint)[0],draw.calc(obj.x, obj.y, basePoint)[1])
            })
            var firstPoint = pathElement[0];
            path.add(draw.calc(firstPoint.x, firstPoint.y, basePoint))
            pathGroup.addChild(path);
        })
        pathGroup.glyph = glyph;
        return pathGroup;
    },
    glyphEscape: function(){
        manage.activateLayerByName('glyph')
        manage.getCurrentPath().getLastChild().pointDeactivate();
        manage.getLayerByName('glyph').addChild(new p.Group({children: manage.getCurrentPath().children}))
        manage.getCurrentPath().removeChildren();
    },
    glyphEscapeAll: function(){
            manage.activateLayerByName('glyph')
            manage.getLayerByName('glyph').children.map((obj)=>{obj.children.map((obj)=>{obj.pointDeactivate();})})
    },
    calc(x, y, point){
        var basePoint = (point == undefined) ? draw.basePoint: point;
        var calcX = basePoint.x + x;
        var calcY = basePoint.y - y;
        var calculatedArr = [calcX, calcY];
        return calculatedArr;
    },

    
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
        p.view.center = new p.Point(500,500)
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
    // console.log('setMode() => changing', EDIT_MODE.LAST, 'to', modeName)
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
            // console.log('setting mode to SELECTION_MODE_A')
            setCursorOnCanvas('select_a', 'url');
            break;
        }
        case 'PATH_MODE_P':{
            // console.log('setting mode to PATH_MODE_P')
            setCursorOnCanvas('path', 'url');
            break;
        }
        case 'CUT_MODE_C':{
            // console.log('setting mode to CUT_MODE_C')
            setCursorOnCanvas('cut', 'url');
            break;
        }
        case 'SELECTION_MODE_V':{
            // console.log('setting mode to SELECTION_MODE_V')
            setCursorOnCanvas('default');
            break;
        }
        case 'PAN_MODE_SPACE':{
            // console.log('setting mode to PAN_MODE_SPACE')
            setCursorOnCanvas('move');
            break;
        }
        case 'ZOOM_MODE_CTRL':{
            // console.log('setting mode to PAN_MODE_SPACE')
            setCursorOnCanvas('zoom-in');
            break;
        }
    }
}

canvasTool.onKeyDown = function (event) {
    // console.log('keydown', event.key);
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
        } case 'escape':{
            var currentMode = getEditMode();
            switch(currentMode){
                case 'SELECTION_MODE_A':{
                    break;
                }
                case 'PATH_MODE_P':{
                    draw.glyphEscape();
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
            if(manage.isSelected()) draw.glyphEscapeAll();
            break;
        } case 'delete':{
            manage.getLayerByName('glyph').children.map((group)=>{
                    group.children.map((item)=>{
                        if(item.select===true) item.remove();
                        if(group.children.length == 0) group.remove();
                    })
                })
            break;
        } default : {
            console.log(event)
            break;
        }
    }
    if(EDIT_MODE.LAST == 'PATH_MODE_P'){
        draw.glyphEscape();
    }
}

canvasTool.onKeyUp = function (event) {
    // console.log('keyup', event.key);
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
            manage.clearLayer('editMode');
            break;
        }
        case 'PATH_MODE_P':{
            if(event.downPoint.x === event.point.x && event.downPoint.y === event.point.y){
                draw.point(event.point.x, event.point.y);
            }
            break;
        }
        case 'CUT_MODE_C':{
            break;
        }
        case 'SELECTION_MODE_V':{
            manage.clearLayer('editMode');
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
            var startX = event.downPoint.x;
            var startY = event.downPoint.y;
            var endX = event.point.x;
            var endY = event.point.y;
            draw.selectionBox(startX,startY,endX,endY);
            break;
        }
        case 'PATH_MODE_P':{
            break;
        }
        case 'CUT_MODE_C':{
            break;
        }
        case 'SELECTION_MODE_V':{
            var startX = event.downPoint.x;
            var startY = event.downPoint.y;
            var endX = event.point.x;
            var endY = event.point.y;
            draw.selectionBox(startX,startY,endX,endY);
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

class Point extends p.Group {
    constructor(x, y){
        super();
        this._className = 'PathPoint'
        this.active = true;
        this.select = true;
        this.radius = 4;
        this.x = x;
        this.y = y;
        this.point = new p.Point(x, y);
        this.activeStrokeColor = '#91DFFF';
        this.activeFillColor = 'white';
        this.deactiveStrokeColor = 'grey';
        this.deactiveFillColor = 'white';
        this.selectedFillColor = '#30c2ff'
        var point = new p.Path.Circle(new p.Point(x,y), this.radius);
        point.fillColor = 'white';
        var coordinates = new p.Group({
            children: [
                new p.Path.Rectangle({
                    point: [x+10, y-28],
                    size: [48, 18],
                    fillColor: '#aaa',
                    radius: 3
                }),
                new p.PointText({
                    point: [x+15, y-15],
                    content: x.toString()+', '+y.toString(),
                    fillColor: 'white',
                    fontSize: 10
                })
            ]
        })
        this.addChildren([point, coordinates]);
        autoBind(this);

        this.onMouseEnter = function(event) {
            if(!this.active) this.pointActivate()
        }
        this.onMouseLeave = function(event) {
            if(event.target.select == false) this.pointDeactivate();
        }
        this.onClick = function(event) {
            if(event.target.select === false) {
                this.pointActivate()
                this.Select();
            }else if(event.target.select === true) {
                this.pointDeactivate();
            }
        }
        this.onMouseDrag = function(event) {

        }
    }
    pointActivate(){
        this.children[0].strokeColor = '#30c2ff';
        if(this.children[1].visible == false)this.children[1].visible = true;
        this.active = true;
    }
    pointDeactivate(){
        this.children[0].strokeColor = 'grey';
        this.children[1].visible = false;
        this.active = false;
        this.Deselect();
    }
    Select(){
        this.children[0].fillColor = '#30c2ff';
        this.select = true;
    }
    Deselect(){
        this.children[0].fillColor = 'white';
        this.select = false;
    }
}

class CubicHandle extends Point {
    constructor(x, y){
        super();
        this.className = 'Handle'
        this.active = true;
        this.select = true;
        this.radius = 3;
        this.activeStrokeColor = '#30c2ff';
        this.activeFillColor = 'white';
        this.deactiveStrokeColor = 'grey';
        this.deactiveFillColor = 'white';
        this.selectedFillColor = '#30c2ff'
    }
}

class QuadricHandle extends Point {
    constructor(x, y){
        super();
        this.className = 'Handle'
        this.active = true;
        this.select = true;
        this.radius = 3;
        this.activeStrokeColor = '#30c2ff';
        this.activeFillColor = 'white';
        this.deactiveStrokeColor = 'grey';
        this.deactiveFillColor = 'white';
        this.selectedFillColor = '#30c2ff'
    }
}

/*
    constructor
        Path(Point)
        Path(object) object must be 'slice of opentype.js Glyph commands'
*/ 
class Path extends p.CompoundPath {
    constructor(points){
        super();
        this.className = 'Path'
        this.active = false;
        this.select = false;
        this.fillColor =  'white',
        this.strokeColor = 'black',
        this.strokeWidth = 3,
        this.strokeScaling = false,

        autoBind(this);

        this.onMouseEnter = function(event) {

        }
        this.onMouseLeave = function(event) {

        }
        this.onClick = function(event) {

        }
        this.onMouseDrag = function(event) {

        }
    }
    addPoint(point, onCurve){
        if(onCurve === true){
            new Point(point, parent)
        }else{
            new Point(point, parent)
        }
    }
    pointActivate(){

    }
    pointDeactivate(){

        this.Deselect();
    }
    Select(){

    }
    Deselect(){

    }
}

class Glyph extends p.Group{
    constructor(char, basePoint){
        super();
        this.className = 'Glyph'
        this.active = false;
        this.select = false;
        this.charName = char;
        this.outlinesFormat = FONT.outlinesFormat;
        this.char = FONT.charToGlyph(char);

        this.path = new Path(char, this)
        this.points = [];
        
        this.children = [];

        if(arg) this.addChild(point);

        autoBind(this);

        this.onMouseEnter = function(event) {

        }
        this.onMouseLeave = function(event) {

        }
        this.onClick = function(event) {

        }
        this.onMouseDrag = function(event) {

        }

        init();
        draw();
    }
    init(){

    }

    draw(){
        
    }

    move()

    getPath(){
        return this.path;
    }

    setPath(){
        if(this.char.points){
            
        }else if(this.char.path.commands){
            
        }
    }

    addPoint(point, onCurve){
        if(onCurve === true){
            new Point(point)
        }else{
            new Point(point)
        }
    }
    pointActivate(){

    }
    pointDeactivate(){

        this.Deselect();
    }
    Select(){

    }
    Deselect(){

    }
}


function info(obj){
	for(var key in obj){
		// if(typeof obj[key] == 'object'){
		// 	console.log(key, info(obj[key]))
        // }else{
        // 	console.log(key, obj[key].toString())
        // }
        if(obj[key]!==undefined && typeof obj[key]=='object'){
            var message = key+': ';
            for(var key2 in obj[key]){
                message += obj[key][key2]+' ';
            }
            console.log(message)
            if(obj[key].lastPointOfContour == true){
                console.log('------------------')
            }
        }else{
            console.log(key, obj[key].toString())
        }
    }
}



function infoGlyph(char){
    var glyph = FONT.charToGlyph(char);
    var gPoints = glyph.points;
    info(gPoints);
}


// @param : glyph = FONT.charToGlyph(char)
function testType(glyph){
    if(glyph.points){
        console.log('points')
    }else if(glyph.path.commands){
        console.log('path.commands')
    }
}