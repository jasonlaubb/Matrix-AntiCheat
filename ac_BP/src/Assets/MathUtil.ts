import { Vector3, VectorXZ } from "@minecraft/server";

export default class {
    static readonly ms = {
        second: 1000,
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        month: 2592000000,
        year: 31536000000,
    };
    /**
     * @description Calculate the angle with rotation Y of pos1 (horiozontal) between two points
     */
    public static caulateAngle(pos1: VectorXZ, pos2: VectorXZ, rotationY: number): number {
        const commonAngle = (Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / Math.PI;
        const rotatedAngle = commonAngle - rotationY - 90;
        const finalAngle = rotatedAngle <= -180 ? rotatedAngle + 360 : rotatedAngle;
        return Math.abs(finalAngle);
    }
    public static distanceXZ(pos1: VectorXZ, pos2: VectorXZ): number {
        return Math.hypot(pos1.x - pos2.x, pos1.z - pos2.z);
    }
    public static distanceXYZ(pos1: Vector3, pos2: Vector3): number {
        return Math.hypot(pos1.x - pos2.x, pos1.y - pos2.y, pos1.z - pos2.z);
    }
    public static calculateDifferentSum(numberArray: number[]): number {
        return numberArray.slice(1).reduce((sum, current, index) => sum + (current - numberArray[index]), 0) / (numberArray.length - 1);
    }
    public static trackIncreasing (numberArray: number[], min: number, max: number): boolean {
        let increasing = false;
        let combo = 0;
        let maxCombo = 0;
        for (let i = 0; i < numberArray.length - 1; i++) {
            if (numberArray[i] < numberArray[i + 1]) {
                combo = 0;
            } else {
                combo++;
            }
            if (combo >= min) {
                if (combo > maxCombo) {
                    maxCombo = combo;
                }
            }
        }
        if (maxCombo >= min && maxCombo <= max) {
            increasing = true;
        }
        return increasing;
    }
    public static comparing (a: number, b: number) {
        return Math.min(a / b, b / a);
    }
    public static randomOffset (min: number, max: number): VectorXZ {
        return { x: Math.random() * (max - min) + min, z: Math.random() * (max - min) + min };
    }
}
