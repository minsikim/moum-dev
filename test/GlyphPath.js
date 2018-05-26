const p = require('paper');
// const path = require('path');
// const opentype = require('opentype.js');

// let FONT = opentype.loadSync(path.join(__dirname, '../assets/fonts/en/Lato-Regular.ttf'));

export default class Path extends p.CompoundPath {
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

        this.fillColor =  'black',
        this.strokeColor = '#96E4FF',
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