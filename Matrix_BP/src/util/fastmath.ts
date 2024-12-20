import { Block, Dimension, Vector3 } from "@minecraft/server";

// Define variables
export const PI = 105414357.0 / 33554432.0 + 1.984187159361080883e-9;
// Angle functions
export function calculateAngleFromView(pos1: Vector3, pos2: Vector3, rotationY: number): number {
    const commonAngle = (Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / PI;
    const rotatedAngle = commonAngle - rotationY - 90;
    const finalAngle = rotatedAngle <= -180 ? rotatedAngle + 360 : rotatedAngle;
    return fastAbs(finalAngle);
}

// Distance functions
export function calculateDistance(pos1: Vector3, pos2: Vector3): number {
    return fastHypot(pos1.x - pos2.x, pos1.z - pos2.z);
}

// General Maths functions
export function fastRound(x: number) {
    return (x + 0.5) | 0;
}

export function fastTrunc(x: number) {
    if (x < 0) return (x - 0.5) | 0;
    return x | 0;
}
export function fastFloor(x: number) {
    return x | 0;
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
export function fastSin(x: number) {
    if (x < -PI) x += DOUBLE_PI;
    else if (x > PI) x -= DOUBLE_PI;

    if (x < 0) return 1.27323954 * x + 0.405284735 * x * x;
    else return 1.27323954 * x - 0.405284735 * x * x;
}
export function fastCos(x: number) {
    return fastSin(x + HALF_PI);
}
export function fastTotalDelta(...x: number[]): number {
    return x.slice(1).reduce((acc, val, i) => acc + (val - x[i]), 0);
}
export function fastSqrt(x: number) {
    if (Number.isNaN(x)) {
        return NaN;
    }
    if (x < 0) x = -x;
    let t;
    let squareRoot = x / 2;

    if (x !== 0) {
        while (t !== squareRoot) {
            t = squareRoot;
            squareRoot = (t + x / t) / 2;
        }
    }

    return squareRoot;
}

/**
 * @description Most efficient way to get all the blocks around a block.
 */
export function fastSurround (centerLocation: Vector3, dimension: Dimension): (Block | undefined )[] | undefined {
    try {
        const block = dimension.getBlock(centerLocation);
        // directions
        const d = block!.below();
        const u = block!.above();
        const w = block!.west();
        const e = block!.east();
        const s = block!.south();
        const n = block!.north();
        const nw = n!.west();
        const ne = n!.east();
        const sw = s!.west();
        const se = s!.east();
        const uw = u!.west();
        const ue = u!.east();
        const us = u!.south();
        const un = u!.north();
        const dw = d!.west();
        const de = d!.east();
        const ds = d!.south();
        const dn = d!.north();
        const unw = un!.west();
        const une = un!.east();
        const usw = us!.west();
        const use = us!.east();
        const dsw = ds!.west();
        const dse = ds!.east();
        const dnw = dn!.west();
        const dne = dn!.east();
        return [d, u, w, e, s, n, nw, ne, sw, se, uw, ue, us, un, dw, de, ds, dn, unw, une, usw, use, dsw, dse, dnw, dne];
    } catch {
        return undefined;
    }
}
export function fastBelow (centerLocation: Vector3, dimension: Dimension): (Block | undefined )[] | undefined {
    const block = dimension.getBlock(centerLocation);
    // directions
    const blockBelow = block?.below();
    if (!blockBelow) return undefined;
    const blockBelowNorth = blockBelow.north();
    const blockBelowSouth = blockBelow.south();
    return [block, blockBelowNorth, blockBelow.east(), blockBelowSouth, blockBelow.west(), blockBelowNorth?.east(), blockBelowNorth?.west(), blockBelowSouth?.east(), blockBelowSouth?.west()];
}