import { Vector3 } from "@minecraft/server";

// Define variables
export const PI = 105414357.0 / 33554432.0 + 1.984187159361080883e-9;
const fastSqrt = Math.sqrt;
// Angle functions
export function calculateAngleFromView(pos1: Vector3, pos2: Vector3, rotationY: number): number {
    const commonAngle = (fastAtan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / PI;
    const rotatedAngle = commonAngle - rotationY - 90;
    const finalAngle = rotatedAngle <= -180 ? rotatedAngle + 360 : rotatedAngle;
    return fastAbs(finalAngle);
}

export function fastAtan2(y: number, x: number) {
    //const absY = fastAbs(y) + 1e-10;
    const angle = fastAtan(y / x);
    if (x >= 0) return angle;
    else return y >= 0 ? angle + PI : angle - PI;
}

export function fastAtan(x: number) {
    const a1 = 0.99997726;
    const a3 = -0.33262347;
    const a5 = 0.19354346;
    const a7 = -0.11643287;
    const a9 = 0.05265332;
    const a11 = -0.01172120;

    const x2 = x * x;
    const x4 = x2 * x2;
    const x6 = x4 * x2;
    const x8 = x6 * x2;
    const x10 = x8 * x2;

    return x * (a1 + a3 * x2 + a5 * x4 + a7 * x6 + a9 * x8 + a11 * x10);
}

// Distance functions
export function calculateDistance(pos1: Vector3, pos2: Vector3): number {
    return fastHypot(pos1.x - pos2.x, pos1.z - pos2.z);
}

// General Maths functions
export function fastRound(x: number) {
    return (x + 0.5) | 0;
}

export function fastAbs(x: number) {
    return x < 0 ? -x : x;
}

export function fastHypot(x: number, y: number) {
    x = fastAbs(x);
    y = fastAbs(y);
    const max = Math.max(x, y);
    const min = Math.min(x, y);
    if (max === 0) return 0;
    const ratio = min / max;
    return max * fastSqrt(1 + ratio * ratio);
}
const DOUBLE_PI = PI * 2;
const HALF_PI = PI * 0.5;
export function fastSin (x: number) {
  if (x < -PI)
        x += DOUBLE_PI;
    else if (x > PI)
        x -= DOUBLE_PI;

    if (x < 0)
        return 1.27323954 * x + 0.405284735 * x * x;
    else
        return 1.27323954 * x - 0.405284735 * x * x;
}
export function fastCos (x: number) {
    return fastSin(x + HALF_PI);
}
