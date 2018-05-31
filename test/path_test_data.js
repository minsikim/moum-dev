function initPathTest(){
    // Predicted test results
    // getStroke -> Path([[0,50],[200,50]])
    manage.activateLayerByName('glyph')
    var paths = {
        path1: new p.Path({
            segments: [
                [0,0],
                [200,0],
                [200,100],
                [0,100]
            ],
            closed: true,
            selected: true,
            strokeColor: 'red',
            strokeWidth: 3
        }),
        path2: new p.Path({
            segments: [
                [0,0],
                [100,0],
                [100,200],
                [0,200]
            ],
            closed: true,
            selected: true,
            strokeColor: 'red',
            strokeWidth: 3,
            position: new p.Point(350,100)
        }),
        path3: new p.Path({
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
            selected: true,
            strokeColor: 'red',
            strokeWidth: 3,
            position: new p.Point(600,100)
        }),
        path4: new p.Path({
            closed: true,
            selected: true,
            strokeColor: 'red',
            strokeWidth: 3,
        }),
        path5: new p.Path({
            closed: true,
            selected: true,
            strokeColor: 'red',
            strokeWidth: 3,
        })
    }
    console.log(paths)
    paths.path4.moveTo(0,0)
    paths.path4.lineTo(200,50)
    paths.path4.lineTo(100,100)
    paths.path4.lineTo(0,50)
    paths.path4.setPosition(new p.Point(100,300))

    paths.path5.moveTo(0,0)
    paths.path5.lineTo(20,10)
    paths.path5.lineTo(100,0)
    paths.path5.lineTo(105,-5)
    paths.path5.lineTo(130,10)
    paths.path5.cubicCurveTo([130,60],[50,210],[0,210])
    paths.path5.lineTo(0,200)
    paths.path5.cubicCurveTo([40,200],[100,45],[100,15])
    paths.path5.lineTo(40,20)
    paths.path5.lineTo(30,30)
    paths.path5.lineTo(0,10)
    paths.path5.lineTo(0,0)
    paths.path5.position = [500,500]
    paths.path5.scale(2)

    function addNumberToSegments(path){
        var tempGroup = new p.Group()
        path.segments.forEach((obj,idx)=>{
            tempGroup.addChild(
                new p.PointText({
                    point: new p.Point(obj.point.x+5,obj.point.y-5),
                    content: idx,
                    fillColor: 'black'
                })
            )
        })
    }
    function selectSegments(path){
        path.segments.forEach((obj)=>{
            obj.selected = true
        })
    }

    Object.keys(paths).map(function(key, index) {
        var obj = paths[key];
        addNumberToSegments(obj);
        selectSegments(obj);
    });
}