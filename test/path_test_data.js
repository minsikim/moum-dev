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

var path2 = new p.Path({
    segments: [
        [0,0],
        [100,0],
        [100,200],
        [0,200]
    ],
    closed: true,
    selected: true
})

// Predicted test results
// getStroke -> right upper curve
var path3 = new p.Path({
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
    selected: true
})

var path4 = new p.Path({
    closed: true,
    selected: true
})

