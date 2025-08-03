import type { Vector3 } from "@minecraft/server";

export function max2(a: number, b: number): number {
    return a > b ? a : b;
}
export function min2(a: number, b: number): number {
    return a < b ? a : b;
}
export function hypot(x: number, y: number, z: number) {
    return Math.sqrt(x * x + y * y + z * z);
}
export function pythag(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
}
export function fastAbs(x: number): number {
    return x < 0 ? -x : x;
}

// Simple distance function
export function distance(a: Vector3, b: Vector3): number {
    const dx = a.x - b.x,
        dy = a.y - b.y,
        dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
export function distanceXZ(a: Vector3, b: Vector3): number {
    const dx = a.x - b.x,
        dz = a.z - b.z;
    return Math.sqrt(dx * dx + dz * dz);
}

export function lineDistance(line1: Vector3[], line2: Vector3[]) {
    const segmentDistance = (p1: Vector3, p2: Vector3, q1: Vector3, q2: Vector3) => {
        const u = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z },
            v = { x: q2.x - q1.x, y: q2.y - q1.y, z: q2.z - q1.z },
            w = { x: p1.x - q1.x, y: p1.y - q1.y, z: p1.z - q1.z },
            a = u.x * u.x + u.y * u.y + u.z * u.z,
            b = u.x * v.x + u.y * v.y + u.z * v.z,
            c = v.x * v.x + v.y * v.y + v.z * v.z,
            d = u.x * w.x + u.y * w.y + u.z * w.z,
            e = v.x * w.x + v.y * w.y + v.z * w.z,
            D = a * c - b * b;

        let sc, tc;
        if (D < 1e-6) {
            sc = 0;
            tc = b !== 0 ? d / b : 0;
        } else {
            sc = (b * e - c * d) / D;
            tc = (a * e - b * d) / D;
        }

        sc = Math.max(0, Math.min(1, sc));
        tc = Math.max(0, Math.min(1, tc));

        const closestPoint1 = {
                x: p1.x + sc * u.x,
                y: p1.y + sc * u.y,
                z: p1.z + sc * u.z,
            },
            closestPoint2 = {
                x: q1.x + tc * v.x,
                y: q1.y + tc * v.y,
                z: q1.z + tc * v.z,
            };

        return distance(closestPoint1, closestPoint2);
    };

    let minDistance = Infinity;

    for (let i = 0; i < line1.length - 1; i++) {
        const p1 = line1[i];
        const p2 = line1[i + 1];

        for (let j = 0; j < line2.length - 1; j++) {
            const q1 = line2[j];
            const q2 = line2[j + 1];

            const dist = segmentDistance(p1, p2, q1, q2);
            minDistance = Math.min(minDistance, dist);
        }
    }

    return minDistance;
}
export function detectPeaks(data: number[]) {
    const posPeaks = [];
    const negPeaks = [];

    for (let i = 1; i < data.length - 1; i++) {
        if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
            posPeaks.push(data[i]);
        } else if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
            negPeaks.push(data[i]);
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
export function minDifference(arr: number[]) {
    if (arr.length < 2) return null; // Not enough numbers to compare

    // Sort the array first
    const sorted = arr.slice().sort((a, b) => a - b);

    // Compare adjacent numbers for minimal difference
    let minDiff = Infinity;
    for (let i = 1; i < sorted.length; i++) {
        const diff = sorted[i] - sorted[i - 1];
        if (diff < minDiff) {
            minDiff = diff;
        }
    }

    return minDiff;
}
export function getVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length;
}
