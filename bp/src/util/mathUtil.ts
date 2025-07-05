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
export function fastAbs(x: number): number {
    return x < 0 ? -x : x;
}

// Simple distance function
export function distance(a: Vector3, b: Vector3): number {
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Simplify using a threshold
function simplifyLine(line: Vector3[], epsilon: number): Vector3[] {
    if (line.length < 3) return line;

    const result: Vector3[] = [line[0]];
    let prev = line[0];

    for (let i = 1; i < line.length - 1; i++) {
        const point = line[i];
        const dist = distance(prev, point);
        if (dist >= epsilon) {
            result.push(point);
            prev = point;
        }
    }

    result.push(line[line.length - 1]);
    return result;
}

// Segment-to-segment approximate distance
function segmentDistance(p1: Vector3, p2: Vector3, q1: Vector3, q2: Vector3): number {
    const u = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const v = { x: q2.x - q1.x, y: q2.y - q1.y, z: q2.z - q1.z };
    const w = { x: p1.x - q1.x, y: p1.y - q1.y, z: p1.z - q1.z };

    const a = u.x * u.x + u.y * u.y + u.z * u.z;
    const b = u.x * v.x + u.y * v.y + u.z * v.z;
    const c = v.x * v.x + v.y * v.y + v.z * v.z;
    const d = u.x * w.x + u.y * w.y + u.z * w.z;
    const e = v.x * w.x + v.y * w.y + v.z * w.z;
    const D = a * c - b * b;

    let sc = 0, tc = 0;
    if (D > 1e-6) {
        sc = Math.max(0, Math.min(1, (b * e - c * d) / D));
        tc = Math.max(0, Math.min(1, (a * e - b * d) / D));
    }

    const cp1 = {
        x: p1.x + sc * u.x,
        y: p1.y + sc * u.y,
        z: p1.z + sc * u.z
    };
    const cp2 = {
        x: q1.x + tc * v.x,
        y: q1.y + tc * v.y,
        z: q1.z + tc * v.z
    };

    return distance(cp1, cp2);
}

// Combined approximation function
export function lineDistanceApprox(line1: Vector3[], line2: Vector3[], epsilon = 0.01, sampleRate = 2): number {
    const simp1 = simplifyLine(line1, epsilon);
    const simp2 = simplifyLine(line2, epsilon);

    let minDist = Infinity;

    for (let i = 0; i < simp1.length - 1; i += sampleRate) {
        const p1 = simp1[i];
        const p2 = simp1[Math.min(i + 1, simp1.length - 1)];

        for (let j = 0; j < simp2.length - 1; j += sampleRate) {
            const q1 = simp2[j];
            const q2 = simp2[Math.min(j + 1, simp2.length - 1)];

            const dist = segmentDistance(p1, p2, q1, q2);
            if (dist < minDist) {
                minDist = dist;
                if (dist === 0) return 0;
            }
        }
    }

    return minDist;
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
