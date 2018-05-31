function offsetPath(path, offset, result) {
    var outerPath = new p.Path({ selected: true }),
        epsilon = p.Numerical.GEOMETRIC_EPSILON,
        enforeArcs = false;
    for (var i = 0; i < path.curves.length; i++) {
        var curve = path.curves[i];
        if (curve.hasLength(epsilon)) {
            var segments = getOffsetSegments(curve, offset),
                start = segments[0];
            if (outerPath.isEmpty()) {
                outerPath.addSegments(segments);
            } else {
                var lastCurve = outerPath.lastCurve;
                if (!lastCurve.point2.isClose(start.point, epsilon)) {
                    if (enforeArcs || lastCurve.getTangentAtTime(1).dot(start.point.subtract(curve.point1)) >= 0) {
                        // addRoundJoin(outerPath, start.point, curve.point1, Math.abs(offset));
                        addRoundJoin(outerPath, start.point, curve.point1, 0);
                    } else {
                        // Connect points with a line
                        outerPath.lineTo(start.point);
                    }
                }
                outerPath.lastSegment.handleOut = start.handleOut;
                outerPath.addSegments(segments.slice(1));
            }
        }
    }
    if (path.isClosed()) {
        if (!outerPath.lastSegment.point.isClose(outerPath.firstSegment.point, epsilon) && (enforeArcs ||
                outerPath.lastCurve.getTangentAtTime(1).dot(outerPath.firstSegment.point.subtract(path.firstSegment.point)) >= 0)) {
            // addRoundJoin(outerPath, outerPath.firstSegment.point, path.firstSegment.point, Math.abs(offset));
            addRoundJoin(outerPath, outerPath.firstSegment.point, path.firstSegment.point,0);
        }
        outerPath.closePath();
    }
    return outerPath;
}
    /**
     * adds and 
     * 
     */
function addRoundJoin(path, dest, center, radius) {
    // return path.lineTo(dest);
    var middle = path.lastSegment.point.add(dest).divide(2),
        through = center.add(middle.subtract(center).normalize(radius));
    path.arcTo(through, dest);
}

function getOffsetSegments(curve, offset) {
    if (curve.isStraight()) {
        var n = curve.getNormalAtTime(0.5).multiply(offset),
            p1 = curve.point1.add(n),
            p2 = curve.point2.add(n);
        return [new p.Segment(p1), new p.Segment(p2)];
    } else {
        var curves = splitCurveForOffseting(curve),
            segments = [];
        for (var i = 0, l = curves.length; i < l; i++) {
            var offsetCurves = getOffsetCurves(curves[i], offset, 0),
                prevSegment;
            for (var j = 0, m = offsetCurves.length; j < m; j++) {
                var curve = offsetCurves[j],
                    segment = curve.segment1;
                if (prevSegment) {
                    prevSegment.handleOut = segment.handleOut;
                } else {
                    segments.push(segment);
                }
                segments.push(prevSegment = curve.segment2);
            }
        }
        return segments;
    }
}

function splitCurveForOffseting(curve) {
    var curves = [curve.clone()], // Clone so path is not modified.
        that = this;
    if (curve.isStraight())
        return curves;

    function splitAtRoots(index, roots) {
        for (var i = 0, prevT, l = roots && roots.length; i < l; i++) {
            var t = roots[i],
                curve = curves[index].divideAtTime(
                        // Renormalize curve-time for multiple roots:
                        i ? (t - prevT) / (1 - prevT) : t);
            prevT = t;
            if (curve)
                curves.splice(++index, 0, curve);
        }
    }

    // Recursively splits the specified curve if the angle between the two
    // handles is too large (we use 60° as a threshold).
    function splitLargeAngles(index, recursion) {
        var curve = curves[index],
            v = curve.getValues(),
            n1 = Curve.getNormal(v, 0),
            n2 = Curve.getNormal(v, 1).negate(),
            cos = n1.dot(n2);
        if (cos > -0.5 && ++recursion < 4) {
            curves.splice(index + 1, 0,
                    curve.divideAtTime(that.getAverageTangentTime(v)));
            splitLargeAngles(index + 1, recursion);
            splitLargeAngles(index, recursion);
        }
    }

    // Split curves at cusps and inflection points.
    var info = curve.classify();
    if (info.roots && info.type !== 'loop') {
        splitAtRoots(0, info.roots);
    }

    // Split sub-curves at peaks.
    for (var i = curves.length - 1; i >= 0; i--) {
        splitAtRoots(i, p.Curve.getPeaks(curves[i].getValues()));
    }

    // Split sub-curves with too large angle between handles.
    for (var i = curves.length - 1; i >= 0; i--) {
        //splitLargeAngles(i, 0);
    }
    return curves;
}

function getOffsetCurves(curve, offset, method) {
    var errorThreshold = 0.01,
        radius = Math.abs(offset),
        // offsetMethod = this['offsetCurve_' + (method || 'middle')],
        offsetMethod = offsetCurve_middle,
        that = this;

    function offsetCurce(curve, curves, recursion) {
        var offsetCurve = offsetMethod.call(that, curve, offset),
            cv = curve.getValues(),
            ov = offsetCurve.getValues(),
            count = 16,
            error = 0;
        for (var i = 1; i < count; i++) {
            var t = i / count,
                pt = p.Curve.getPoint(cv, t),
                n = p.Curve.getNormal(cv, t),
                roots = p.Curve.getCurveLineIntersections(ov, pt.x, pt.y, n.x, n.y),
                dist = 2 * radius;
            for (var j = 0, l = roots.length; j < l; j++) {
                var d = p.Curve.getPoint(ov, roots[j]).getDistance(pt);
                if (d < dist)
                    dist = d;
            }
            var err = Math.abs(radius - dist);
            if (err > error)
                error = err;
        }
        if (error > errorThreshold && recursion++ < 8) {
            if (error === radius) {
                // console.log(cv);
            }
            var curve2 = curve.divideAtTime(that.getAverageTangentTime(cv));
            offsetCurce(curve, curves, recursion);
            offsetCurce(curve2, curves, recursion);
        } else {
            curves.push(offsetCurve);
        }
        return curves;
    }

    return offsetCurce(curve, [], 0);
}

function offsetCurve_middle(curve, offset) {
    var v = curve.getValues(),
        p1 = curve.point1.add(p.Curve.getNormal(v, 0).multiply(offset)),
        p2 = curve.point2.add(p.Curve.getNormal(v, 1).multiply(offset)),
        pt = p.Curve.getPoint(v, 0.5).add(
                p.Curve.getNormal(v, 0.5).multiply(offset)),
        t1 = p.Curve.getTangent(v, 0),
        t2 = p.Curve.getTangent(v, 1),
        div = t1.cross(t2) * 3 / 4,
        d = pt.multiply(2).subtract(p1.add(p2)),
        a = d.cross(t2) / div,
        b = d.cross(t1) / div;
    return new p.Curve(p1, t1.multiply(a), t2.multiply(-b), p2);
}

function getAverageTangentTime(v) {
    var tan = p.Curve.getTangent(v, 0).add(p.Curve.getTangent(v, 1)),
        tx = tan.x,
        ty = tan.y,
        abs = Math.abs,
        flip = abs(ty) < abs(tx),
        s = flip ? ty / tx : tx / ty,
        ia = flip ? 1 : 0, // the abscissa index
        io = ia ^ 1,       // the ordinate index
        a0 = v[ia + 0], o0 = v[io + 0],
        a1 = v[ia + 2], o1 = v[io + 2],
        a2 = v[ia + 4], o2 = v[io + 4],
        a3 = v[ia + 6], o3 = v[io + 6],
        aA =     -a0 + 3 * a1 - 3 * a2 + a3,
        aB =  3 * a0 - 6 * a1 + 3 * a2,
        aC = -3 * a0 + 3 * a1,
        oA =     -o0 + 3 * o1 - 3 * o2 + o3,
        oB =  3 * o0 - 6 * o1 + 3 * o2,
        oC = -3 * o0 + 3 * o1,
        roots = [],
        epsilon = p.Numerical.CURVETIME_EPSILON,
        count = p.Numerical.solveQuadratic(
                3 * (aA - s * oA),
                2 * (aB - s * oB),
                aC - s * oC, roots,
                epsilon, 1 - epsilon);
    // Fall back to 0.5, so we always have a place to split...
    return count > 0 ? roots[0] : 0.5;
}