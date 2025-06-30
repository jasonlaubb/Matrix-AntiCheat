import { Entity, EntityHurtAfterEvent, Player, system, Vector3, world } from "@minecraft/server"
import { calculateRelativeViewAngle, distance, fastAbs, lineDistance } from "../util/mathUtil";
import { addHP } from "../util/util";
export default {
    id: "antikillaura",
    enable: () => {
        world.afterEvents.entityHurt.subscribe(entityHurt, {
            entityTypes: ["minecraft:player", "minecraft:villager", "minecraft:villager_v2"],
        })
    },
    disable: () => {

    }
}
function recordPosition (entity: Entity) {
    entity.antiReachRecords = [];
    const id = system.runInterval(() => {
        if (!entity?.isValid || !entity.antiReachRecordTime || entity.antiReachRecordTime < Date.now()) {
            system.clearRun(id);
            return;
        }
        entity.antiReachRecords!.unshift(bottomLocation(entity.location));
        if (entity.antiReachRecords!.length > 10) entity.antiReachRecords!.pop();
    });;
}
function bottomLocation ({ x, y, z }: Vector3) {
    return { x, y: y + 0.5, z };
}
function recordHeadPosition (entity: Entity) {
    entity.antiReachRecords = [];
    const id = system.runInterval(() => {
        if (!entity?.isValid || !entity.antiReachRecordTime || entity.antiReachRecordTime < Date.now()) {
            system.clearRun(id);
            return;
        }
        entity.antiReachRecords!.unshift(entity.getHeadLocation());
        if (entity.antiReachRecords!.length > 10) entity.antiReachRecords!.pop();
    });;
}
function entityHurt ({ hurtEntity, damageSource: { damagingEntity: attacker, damagingProjectile, cause }, damage }: EntityHurtAfterEvent) {
    if (cause !== "entityAttack" || damagingProjectile || !attacker || !(attacker instanceof Player) || attacker.isOp() || attacker.getGameMode() === "Creative") return;
    const now = Date.now();
    hurtEntity.antiReachRecordTime = now + 12000;
    attacker.antiReachRecordTime = now + 12000;
    if (!attacker?.antiReachRecords) recordHeadPosition(attacker);
    if (!hurtEntity?.antiReachRecords) recordPosition(hurtEntity);
    const { x: pitch, y: yaw } = attacker.getRotation();
    const absPitch = fastAbs(pitch);
    const attackDistance = distance(attacker.location, hurtEntity.location);
    const height = fastAbs(attacker.location.y - hurtEntity.location.y);
    if (attacker?.antiReachRecords && attacker.antiReachRecords.length >= 10 && hurtEntity?.antiReachRecords && hurtEntity.antiReachRecords.length >= 10) {
        const attackerRecords = attacker.antiReachRecords;
        const hurtEntityRecords = hurtEntity.antiReachRecords;
        if (attackDistance > 4.35) {
            system.runTimeout(() => {
                attackerRecords.push(...attacker.antiReachRecords!);
                hurtEntityRecords.push(...hurtEntity.antiReachRecords!);
                const reachDistance = lineDistance(attackerRecords, hurtEntityRecords);
                if (reachDistance > (absPitch < 50 && height >= 2 ? 4.35 : 4.55)) {
                    // Recover health for the hurt entity if reach detected
                    addHP(hurtEntity, damage);
                }
            }, 10);
        }
    }
    if (attackDistance > 2.5 && fastAbs(pitch) > 75) {
        addHP(hurtEntity, damage);
    }
    if (attackDistance > 3.5) {
        const angle = calculateRelativeViewAngle(attacker.getHeadLocation(), hurtEntity.location, yaw);
        if (angle > (attacker.inputInfo.lastInputModeUsed === "Touch" ? 135 : 85)) {
            addHP(hurtEntity, damage);
        }
    }
    // UNFINISGED awa
}