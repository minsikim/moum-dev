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

const util = {
    scale : 1,
    calcX(x, basePoint){
        return basePoint.x + x;
    },
    calcY(y, basePoint){
        return basePoint.y - y;
    },
    calcPoint(x, y, basePoint){
        return [util.calcX(x, basePoint), util.calcY(y, basePoint)];
    },
    calcPath(arr, basePoint){
        arr.forEach((obj)=>{
            var calulatedPoint = util.calcPoint(obj.x, obj.y, basePoint);
            obj.x = calulatedPoint.x;
            obj.y = calulatedPoint.y;
        })
        return arr;
    },
    midPoint(args){
        var x1, y1, x2, y2 = 0;
        if(arguments.length == 2){
            x1 = arguments[0][0], y1 = arguments[0][1], x2 = arguments[1][0], y2 = arguments[1][1];
        }else if(arguments.length == 4){
            x1 = arguments[0], y1 = arguments[1], x2 = arguments[2], y2 = arguments[3];
        }else{
            throw 'Can not get mid-point'
        }
        var retX = (x1 + x2) / 2;
        var retY = (y1 + y2) / 2;
        return new p.Point(retX, retY);
    },
    deleteSelected(){
        for(var i = 0; i < manage.getLayerByName('glyph').children.length; i++){
            manage.getLayerByName('glyph').children[i]
            for(var j = 0; j < manage.getLayerByName('glyph').children[i].children.length; j++){
                if(manage.getLayerByName('glyph').children[i].children[j]._select===true) {
                    manage.getLayerByName('glyph').children[i].children[j].remove();
                    --j;
                }
            }
            if(manage.getLayerByName('glyph').children.length==0){
                manage.getLayerByName('glyph').children[i].remove();
                --i;
            }
        }
    }
}

const draw = {
    basePoint:  (FONT) ? new p.Point(0,FONT.unitsPerEm) : new p.Point(0,1000),
    vLine: function(x, d){
        //change if needed
        var dist = (d == undefined) ? 100 : d; /* distance between line */
        var margin = 5; /* margin between line and text */
        var extension = 10000; /* extended line for window pan/zoom/resize */
        var textsize = 8; /* fontsize for pointtext shift */
        //draw a vertical line
        var temp1 = new p.Point(x*dist, 0-extension);
        var temp2 = new p.Point(x*dist, canvas.height+extension);
        var path = new p.Path.Line(temp1, temp2);
        path.strokeColor = new p.Color(0,0,0,0.5);
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
        var extension = 10000; /* extended line for window pan/zoom/resize */
        var textsize = 8; /* fontsize for pointtext shift */
        //draw a vertical line
        var temp1 = new p.Point(-extension, y*dist);
        var temp2 = new p.Point(canvas.width+extension, y*dist);
        var path = new p.Path.Line(temp1, temp2);
        path.strokeColor = new p.Color(0,0,0,0.5);
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
        var extension = 10000;
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
                path.add(util.calcPoint(obj.x, obj.y, basePoint))
                this.point(util.calcPoint(obj.x, obj.y, basePoint)[0],util.calcPoint(obj.x, obj.y, basePoint)[1])
            })
            var firstPoint = pathElement[0];
            path.add(util.calcPoint(firstPoint.x, firstPoint.y, basePoint))
            pathGroup.addChild(path);
        })
        pathGroup.glyph = glyph;
        return pathGroup;
    },
    glyphEscape: function(){
        manage.activateLayerByName('glyph')
        if(manage.getCurrentPath().getLastChild()) manage.getCurrentPath().getLastChild().pointDeactivate();
        manage.getLayerByName('glyph').addChild(new p.Group({children: manage.getCurrentPath().children}))
        manage.getCurrentPath().removeChildren();
    },
    glyphEscapeAll: function(){
            manage.activateLayerByName('glyph')
            manage.getLayerByName('glyph').children.map((obj)=>{obj.children.map((obj)=>{obj.pointDeactivate();})})
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
            util.deleteSelected();
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
        this._active = false;
        this._select = false;
        this.radius = 4;
        this.x = x;
        this.y = y;
        this.point = new p.Point(x, y);
        this.activeStrokeColor = '#91DFFF';
        this.activeFillColor = 'white';
        this.deactiveStrokeColor = 'grey';
        this.deactiveFillColor = 'white';
        this.selectedFillColor = '#30c2ff'
        this.pointMarker = new p.Path.Circle({
            center: this.point,
            radius: this.radius,
            fillColor: 'white'
        });
        this.coordinates = new p.Group({
            children: [
                new p.Path.Rectangle({
                    point: [x+10, y-28],
                    size: [52, 18],
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
        this.addChildren([this.pointMarker, this.coordinates]);
        autoBind(this);

        this.onMouseEnter = function(event) {
            if(!this._active) this.pointActivate()
        }
        this.onMouseLeave = function(event) {
            if(event.target._select == false) this.pointDeactivate();
        }
        this.onClick = function(event) {
            if(event.target._select === false) {
                this.pointActivate()
                this.select();
            }else if(event.target._select === true) {
                this.pointDeactivate();
            }
        }
        this.onMouseDrag = function(event) {

        }
    }
    pointActivate(){
        this.pointMarker.strokeColor = '#30c2ff';
        if(this.coordinates.visible == false)this.children[1].visible = true;
        this._active = true;
    }
    pointDeactivate(){
        this.children[0].strokeColor = 'grey';
        this.children[1].visible = false;
        this._active = false;
        this.deselect();
    }
    select(){
        this.children[0].fillColor = '#30c2ff';
        this._select = true;
    }
    deselect(){
        this.children[0].fillColor = 'white';
        this._select = false;
    }
}

class CubicHandle extends Point {
    constructor(x, y){
        super();
        this.className = 'Handle'
        this._active = true;
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
        this._active = true;
        this.select = true;
        this.radius = 3;
        this.activeStrokeColor = '#30c2ff';
        this.activeFillColor = 'white';
        this.deactiveStrokeColor = 'grey';
        this.deactiveFillColor = 'white';
        this.selectedFillColor = '#30c2ff'
    }
}

class Path extends p.CompoundPath {
    constructor(char, basePoint){
        manage.activateLayerByName('glyph')

        super();
        this._className = 'Path'
        this._active = false;
        this._select = false;
        this._basePoint = basePoint || new p.Point(0,0);
        // this.parent = parent;
        this.glyph = FONT.charToGlyph(char);
        this.pathArray = [];

        this.charName = char;
        this.outlinesFormat = FONT.outlinesFormat;

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
        this.convertToPathArray();

        this.pathArray.forEach((pathElement, index, pathArr)=>{
            pathElement = this.getMidPointAddedArray(pathElement);
            console.log(pathElement)
            var path = new p.Path({ closed: true });
            var tempOffPoint = null;
            pathElement.forEach((obj, index, arr)=>{
                var objPoint = new p.Point(util.calcPoint(obj.x, obj.y, this._basePoint))
                if(index == 0 && obj.onCurve == true) {
                    path.moveTo(objPoint);
                    console.log(this.parent.points)
                    // this.parent.points.addChild(new Point(objPoint.x,objPoint.y));
                }else if(index == 0 && obj.onCurve !== true) throw 'Path first point is an Off Point';
                else{
                    if(obj.onCurve == true){
                        if(tempOffPoint == null){
                            path.lineTo(objPoint);
                        }else{
                            path.quadraticCurveTo(tempOffPoint, objPoint);
                            // this.parent.points.addChild(new QuadricHandle(tempOffPoint.x,tempOffPoint.y));
                            // this.parent.points.addChild(new Point(objPoint.x,objPoint.y));
                            tempOffPoint = null;
                        }
                    }else if(obj.onCurve == false){
                        if(tempOffPoint == null){
                            tempOffPoint = objPoint;
                        }else{
                            throw 'Can not render two linked off Points yet, enable getMidPointAddedArray function before'
                        }
                    }
                }

            })
            this.addChild(path);
        })
    }

    getMidPointAddedArray(arr){
        var retArr = [];
        arr.forEach((obj, i, arr)=>{
            if(obj.onCurve == true){
                obj.pointType = 'point';
                retArr.push(obj);
            }else{
                if(arr[i-1].onCurve == true){
                    obj.pointType = 'quadricHandle';
                    retArr.push(obj)
                }else{
                    var midPoint = util.midPoint(
                        [arr[i-1].x, arr[i-1].y],
                        [obj.x, obj.y]
                    )
                    retArr.push({
                        lastPointOfContour: false,
                        onCurve: true,
                        x: midPoint.x,
                        y: midPoint.y,
                        pointType: 'quadricMidPoint'
                    })
                    obj.pointType = 'quadricHandle';
                    retArr.push(obj)
                }
            }
        })
        return retArr;
    }

    convertToPathArray(){
        var tempLastPoint = 0;
        for(var i = 0; i < this.glyph.points.length; i++){
            if(this.glyph.points[i].lastPointOfContour == true){
                this.pathArray.push(this.glyph.points.slice(tempLastPoint, i+1));
                tempLastPoint = i+1;
            }
        }
        return this.pathArray;
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
    black(){
        this.fillColor = 'black';
        this.strokeColor = null;
    }
}

class Glyph extends p.Group{
    constructor(char, basePoint){
        super();
        this._className = 'Glyph'
        this._active = false;
        this._select = false;
        this.charName = char;
        this.outlinesFormat = FONT.outlinesFormat;

        //Lower Variables should act as states
        this.glyph = FONT.charToGlyph(char);
        this._basePoint = basePoint;

        //L
        this.path = new Path(char, this._basePoint);
        this.points = new p.Group();
        
        this.children = [];

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
    }
    init(){
        this.glyph.points;
    }

    draw(){
        
    }

    move(){

    }

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