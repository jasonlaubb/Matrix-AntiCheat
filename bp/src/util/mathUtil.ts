import type { Vector3 } from "@minecraft/server";

export function max2(a: number, b: number): number {
    return a > b ? a : b;
}
export function min2(a: number, b: number): number {
    return a < b ? a : b;
}
interface BoundingBox {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
}
export function distance(pos1: Vector3, pos2: Vector3): number {
    return hypot(pos1.x - pos2.x, pos1.y - pos2.y, pos1.z - pos2.z);
}
export function hypot(x: number, y: number, z: number) {
    return Math.sqrt(x * x + y * y + z * z);
}
export function fastAbs(x: number): number {
    return x < 0 ? -x : x;
}
export function lineDistance(line1: Vector3[], line2: Vector3[]) {
    const computeBoundingBox = (p1: Vector3, p2: Vector3) =>
        ({
            minX: min2(p1.x, p2.x),
            maxX: max2(p1.x, p2.x),
            minY: min2(p1.y, p2.y),
            maxY: max2(p1.y, p2.y),
            minZ: min2(p1.z, p2.z),
            maxZ: max2(p1.z, p2.z),
        }) as BoundingBox;
    const boxesOverlap = (box1: BoundingBox, box2: BoundingBox) => box1.maxX >= box2.minX && box1.minX <= box2.maxX && box1.maxY >= box2.minY && box1.minY <= box2.maxY && box1.maxZ >= box2.minZ && box1.minZ <= box2.maxZ;

    // Compute the shortest distance between two segments
    const segmentDistance = (p1: Vector3, p2: Vector3, q1: Vector3, q2: Vector3) => {
        const u = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z }; // Vector from p1 to p2
        const v = { x: q2.x - q1.x, y: q2.y - q1.y, z: q2.z - q1.z }; // Vector from q1 to q2
        const w = { x: p1.x - q1.x, y: p1.y - q1.y, z: p1.z - q1.z }; // Vector from q1 to p1

        const a = u.x * u.x + u.y * u.y + u.z * u.z; // u · u
        const b = u.x * v.x + u.y * v.y + u.z * v.z; // u · v
        const c = v.x * v.x + v.y * v.y + v.z * v.z; // v · v
        const d = u.x * w.x + u.y * w.y + u.z * w.z; // u · w
        const e = v.x * w.x + v.y * w.y + v.z * w.z; // v · w

        const D = a * c - b * b; // Determinant

        let sc, tc;

        if (D < 1e-6) {
            sc = 0;
            tc = d / b;
        } else {
            sc = (b * e - c * d) / D;
            tc = (a * e - b * d) / D;
        }

        sc = max2(0, min2(1, sc));
        tc = max2(0, min2(1, tc));

        const closestPoint1 = {
            x: p1.x + sc * u.x,
            y: p1.y + sc * u.y,
            z: p1.z + sc * u.z,
        };
        const closestPoint2 = {
            x: q1.x + tc * v.x,
            y: q1.y + tc * v.y,
            z: q1.z + tc * v.z,
        };

        return distance(closestPoint1, closestPoint2);
    };

    let minDistance = Infinity;

    // Iterate over all segments of line1 and line2
    for (let i = 0; i < line1.length - 1; i++) {
        const p1 = line1[i];
        const p2 = line1[i + 1];
        const box1 = computeBoundingBox(p1, p2);

        for (let j = 0; j < line2.length - 1; j++) {
            const q1 = line2[j];
            const q2 = line2[j + 1];
            const box2 = computeBoundingBox(q1, q2);

            // Skip segments if their bounding boxes do not overlap
            if (!boxesOverlap(box1, box2)) continue;

            // Calculate distance between segments and update minDistance
            const distance = segmentDistance(p1, p2, q1, q2);
            minDistance = min2(minDistance, distance);
        }
    }

    return minDistance;
}
export function detectPeaks(data: number[]) {
    const posPeaks = [];
    const negPeaks = [];

    for (let i = 1; i < data.length - 1; i++) {
        if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
            posPeaks.push({ index: i, value: data[i] });
        } else if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
            negPeaks.push({ index: i, value: data[i] });
        }
    }

    return { posPeaks, negPeaks };
}
export function calculateRelativeViewAngle(pos1: Vector3, pos2: Vector3, rotationY: number): number {
    const a = Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 57.29577951308232;
    const b = a - rotationY - 90;
    const c = b <= -180 ? b + 360 : b;
    return fastAbs(c);
}
