const p = require('paper')

//@params path(class paper.Path)
//@return [centerPath(class paper.Path), offset(Number)]
function getStroke(path){
    
}

//@params path(class paper.Path)
//@function WRITES EACH SEGMENTS POINT DATA(POINT, HANDLE POINTS COORDINATES)
function getPathinfo(path){
    var segments = path.segments;
    for(var i = 0; i < segments.length; i++){
        var s = segments[i];
        console.log(s.index+': ',
        'point: '+s.point.x+','+s.point.y, 
        'handle in: '+s.handleIn.x+','+s.handleIn.y,
        'handle out: '+s.handleOut.x+','+s.handleOut.y);
    }
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

// Predicted test results
// getStroke -> Path([[0,50],[200,50]])
var path1 = new p.Path({
    segments: [
        [0,0],
        [200,0],
        [200,100],
        [0,100]
    ],
    closed: true,
    selected: true
})
// Predicted test results
// getStroke -> right upper curve
var path2 = new p.Path({
    segments: [
        new p.Segment({
            point: [0,0],
            handleIn: [0,0],
            handleOut: [200*2/3,0]
        }),
        new p.Segment({
            point: [200,200],
            handleIn: [0,-200*2/3],
            handleOut: [0,0]
        }),
        new p.Segment({
            point: [100,200],
            handleIn: [0,0],
            handleOut: [0,-100*2/3]
        }),
        new p.Segment({
            point: [0,100],
            handleIn: [100*2/3,0],
            handleOut: [0,0]
        })
    ],
    closed: true,
    FullySelected: true
})