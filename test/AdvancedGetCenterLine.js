const Path = require('./GlyphPath');
const p = require('paper');

//divideToPointArray: 글리프 읽어서 
//각 그리프를 패스화 하여 다시 획에 따라 쪼갬
//획에 따라 쪼갠 것의 센터라인 잡고
//이어진 획은 extend로 이어버림

/*
    divideToPointArray()
    1. Read Glyph points and divide into seperate paths
    toPathArray() => drawPathFromPoints() => group it into 1 CompoundPath
    2. draw Paths from points Array
    divideToStroke
    2. 
*/
function divideToPointArray(glyph){
    var pointsArray = [];
    var tempLastPoint = 0;
    for(var i = 0; i < this.glyph.points.length; i++){
        if(this.glyph.points[i].lastPointOfContour == true){
            this.pointsArray.push(this.glyph.points.slice(tempLastPoint, i+1));
            tempLastPoint = i+1;
        }
    }
    return this.pointsArray;
}

//Only for truetype encoding for now
function makePathByGlyph(glyph){
    

    return new p.Path({

    })
}

function makeGlyphBounds(glyph, FONT){
    var BoundsPath = new p.Path({selected: true, fillColor: 'white', closed: true})
    BoundsPath.moveTo(0,0);
    BoundsPath.lineTo(0,-FONT.ascender);
    BoundsPath.lineTo(glyph.advanceWidth,-FONT.ascender);
    BoundsPath.lineTo(glyph.advanceWidth, 0);
    BoundsPath.lineTo(glyph.advanceWidth,-FONT.descender);
    BoundsPath.lineTo(0,-FONT.descender);
    return BoundsPath;
}