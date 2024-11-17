import { Vector3 } from "@minecraft/server";

export function calculateAngleFromView(pos1: Vector3, pos2: Vector3, rotationY: number): number {
    const commonAngle = (Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / Math.PI;
    const rotatedAngle = commonAngle - rotationY - 90;
    const finalAngle = rotatedAngle <= -180 ? rotatedAngle + 360 : rotatedAngle;
    return Math.abs(finalAngle);
}

export function calculateDistance(pos1: Vector3, pos2: Vector3): number {
    return Math.hypot(pos1.x - pos2.x, pos1.z - pos2.z);
}