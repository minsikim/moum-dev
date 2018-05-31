const p = require('paper')

//@params path(class paper.Path)
//@return [centerPath(class paper.Path), offset(Number)]
function getCenterLine(path){
    var centerLine = null;
    var longestCurve = getLongestCurve(path);
    if(Array.isArray(longestCurve) && longestCurve.length == 2){
        centerLine = getCenterPath(longestCurve);
    }else{
        centerLine = getCenterPath([longestCurve, getOppositeCurve(longestCurve)])
    }
    return centerLine;
}

function getOppositeCurve(curve){
    var retCurve = null;
    var closestAngle = 180;
    var path = curve.path;
    var curveAngle = Math.abs(curve.getWeightedTangentAt(curve.length/2).angle);
    // console.log('curveAngle: '+curveAngle);
    for(var i =0; i < path.curves.length; i++){
        if(i == curve.index) continue;
        var tempAngle = Math.abs(path.curves[i].getWeightedTangentAt(path.curves[i].length/2).angle);
        var tempAngle2 = Math.abs(tempAngle - 180);
        // console.log(i+': tempAngle: '+tempAngle+' or '+tempAngle2);
        if(Math.abs(tempAngle - curveAngle) < closestAngle) {
            // console.log('calculated angle difference: '+Math.abs(tempAngle - curveAngle) )
            retCurve = path.curves[i];
            closestAngle = Math.abs(tempAngle - curveAngle);
        }
        if((Math.abs(tempAngle2 - curveAngle)) < closestAngle) {
            // console.log('calculated angle difference: '+Math.abs(tempAngle2 - curveAngle) )
            retCurve = path.curves[i];
            closestAngle = Math.abs(tempAngle2 - curveAngle);
        }
    }
    return retCurve;
}

//@TODO
//Update to get centerline from spline/spline and spline/line
function getCenterPath(curveArray){
    var curve1 = curveArray[0];
    var curve2 = alignCurveDirection(curve1, curveArray[1]);
    var point1 = midPoint(curve1.point1, getClosestCurvePoint(curve1.point1, curve2));
    var point2 = midPoint(curve1.point2, getClosestCurvePoint(curve1.point2, curve2));
    var point1_handleOut = midPoint(curve1.handle1, curve2.handle1);
    var point2_handleIn = midPoint(curve1.handle2, curve2.handle2);
    console.log(curve1.handle1, curve1.handle2);
    console.log()
    return new p.Path({
        segments:[
            new p.Segment({
                point: point1,
                handleOut: point1_handleOut
            }),
            new p.Segment({
                point: point2,
                handleIn: point2_handleIn
            })
        ],
        selected: true,
        closed: false
    })
}

function isSpline(curve){
    var handle1_check = curve.handle1.x == 0 && curve.handle1.y == 0;
    var handle2_check = curve.handle2.x == 0 && curve.handle2.y == 0;
    if(handle1_check && handle2_check) return false;
    else return true;
}

function isStraightLine(curve){
    var handle1_check = curve.handle1.x == 0 && curve.handle1.y == 0;
    var handle2_check = curve.handle2.x == 0 && curve.handle2.y == 0;
    if(handle1_check && handle2_check) return true;
    else return false;
}

function midPoint(point1, point2){
    return new p.Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2)
}

function getClosestCurvePoint(point, curve){
    var dist_point1 = point.getDistance(curve.point1);
    var dist_point2 = point.getDistance(curve.point2);
    var retPoint = dist_point1 < dist_point2 ? curve.point1 : curve.point2;
    return retPoint;
}

//return aligned curve2
function alignCurveDirection(curve1, curve2){
    if(getClosestCurvePoint(curve1.point1, curve2) == curve2.point1) return curve2;
    else return curve2.reversed();
}

//@params path(class paper.Path)
//@function WRITES EACH SEGMENTS POINT DATA(POINT, HANDLE POINTS COORDINATES)
function getPathinfo(path){
    if(Array.isArray(path)){
        path.forEach((obj, idx, arr)=>{
            getPathinfo(obj);
        })
        return;
    }else{
        switch(path.className){
            case 'Curve':{
                console.log(path.className+': ',
                'point1: '+path.point1.x+','+path.point1.y, 
                'handle 1: '+path.handle1.x+','+path.handle1.y,
                'handle 2: '+path.handle2.x+','+path.handle2.y,
                'point2: '+path.point2.x+','+path.point2.y);
                break;
            }case 'Path':{
                var segments = path.segments;
                for(var i = 0; i < segments.length; i++){
                    var s = segments[i];
                    console.log(s.index+': ',
                    'point: '+s.point.x+','+s.point.y, 
                    'handle in: '+s.handleIn.x+','+s.handleIn.y,
                    'handle out: '+s.handleOut.x+','+s.handleOut.y);
                }
                break;
            }
        }
    }
}

function forceIntPath(path, handleForce){
    var segments = path.segments;
    if(handleForce === true || handleForce === undefined){
        for(var i = 0; i < segments.length; i++){
            var s = segments[i];
            s.point.x = Math.round(s.point.x);
            s.point.y = Math.round(s.point.y);
            s.handleIn.x = Math.round(s.handleIn.x);
            s.handleIn.y = Math.round(s.handleIn.y);
            s.handleOut.x = Math.round(s.handleOut.x);
            s.handleOut.y = Math.round(s.handleOut.y);
        }
    }else if(handleForce === false){
        for(var i = 0; i < segments.length; i++){
            var s = segments[i];
            s.point.x = Math.round(s.point.x);
            s.point.y = Math.round(s.point.y);
        }
    }
    return path;
}

//@params path(class paper.Path)
//@return longest curve or curves(as Array)
function getLongestCurve(path){
    var longestCurve = null;
    var longestCurveArr = null;
    var curves = path.getCurves();
    for(var i = 0; i < curves.length; i++){
        if(longestCurve == null) {
            longestCurve = curves[i];
            continue;
        }
        if(longestCurve.length < curves[i].length) longestCurve = curves[i];
    }
    var longestCurveLength = longestCurve.length;
    var indexes = [];
    for(var i = 0; i < curves.length; i++){
        if(curves[i].length == longestCurveLength) indexes.push(i);
    }
    if(indexes.length > 1) {
        longestCurveArr = [];
            indexes.forEach((obj, idx, arr)=>{
            longestCurveArr.push(curves[obj]);
        })
    }
    return longestCurveArr || longestCurve;
}

function selectSegments(path){
    path.segments.forEach((obj)=>{
        obj.selected = true
    })
}

function addNumberToSegments(path){
    var tempGroup = new p.Group()
    path.segments.forEach((obj,idx)=>{
        tempGroup.addChild(
            new p.PointText({
                point: new p.Point(obj.point.x+20,obj.point.y-20),
                content: idx,
                fillColor: 'black'
            })
        )
    })
}