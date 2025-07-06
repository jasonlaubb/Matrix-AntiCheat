import { Entity, Vector3 } from "@minecraft/server";
import { min2 } from "./mathUtil";

export function addHP(entity: Entity, hp: number): void {
    if (!entity || !entity.isValid) return;
    const health = entity.getComponent("health")!;
    health.setCurrentValue(min2(health.currentValue + hp, health.effectiveMax));
}

export function locEqual(loc1: Vector3, loc2: Vector3): boolean {
    return loc1.x === loc2.x && loc1.y === loc2.y && loc1.z === loc2.z;
}