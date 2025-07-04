import { Entity } from "@minecraft/server";
import { min2 } from "./mathUtil";

export function addHP(entity: Entity, hp: number): void {
    if (!entity || !entity.isValid) return;
    const health = entity.getComponent("health")!;
    health.setCurrentValue(min2(health.currentValue + hp, health.effectiveMax));
}
