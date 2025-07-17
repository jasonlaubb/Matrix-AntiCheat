import { Entity, EntityHurtAfterEvent, Player, system, Vector3, world } from "@minecraft/server";
import { calculateRelativeViewAngle, distance, fastAbs, lineDistance, distanceXZ } from "../util/mathUtil";
import { addHP } from "../util/util";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
export default {
    property: "antiKillauraEnable",
    enable: () => {
        world.afterEvents.entityHurt.subscribe(entityHurt);
        addCheckInterval(tickEvent);
    },
    disable: () => {
        world.afterEvents.entityHurt.unsubscribe(entityHurt);
        removeCheckInterval(tickEvent);
    },
};
function recordPosition(entity: Entity) {
    entity.antiReachRecords = [];
    entity.antiReachRecording = true;
    const id = system.runInterval(() => {
        if (!entity?.isValid || !entity.antiReachRecordTime || entity.antiReachRecordTime < Date.now()) {
            delete entity.antiReachRecording;
            system.clearRun(id);
            return;
        }
        entity.antiReachRecords!.unshift(bottomLocation(entity.location));
        if (entity.antiReachRecords!.length > 10) entity.antiReachRecords!.pop();
    });
}
function bottomLocation({ x, y, z }: Vector3) {
    return { x, y: y + 0.5, z };
}
function recordHeadPosition(entity: Entity) {
    entity.antiReachRecords = [];
    entity.antiReachRecording = true;
    const id = system.runInterval(() => {
        if (!entity?.isValid || !entity.antiReachRecordTime || entity.antiReachRecordTime < Date.now()) {
            delete entity.antiReachRecording;
            system.clearRun(id);
            return;
        }
        entity.antiReachRecords!.unshift(entity.getHeadLocation());
        if (entity.antiReachRecords!.length > 10) entity.antiReachRecords!.pop();
    });
}
function entityHurt({ hurtEntity, damageSource: { damagingEntity: attacker, damagingProjectile, cause }, damage }: EntityHurtAfterEvent) {
    if (cause !== "entityAttack" || damagingProjectile || !attacker || !(attacker instanceof Player) || attacker.isOp() || attacker.getGameMode() === "Creative") return;
    const now = Date.now();
    attacker.killauraFlag ??= 0;
    attacker.killauraLastFlag ??= 0;
    attacker.killauraHitList ??= [];
    if (!attacker.killauraHitList.map(({ id }) => id).includes(hurtEntity.id)) attacker.killauraHitList.push({ id: hurtEntity.id, time: now });
    attacker.killauraHitList = attacker.killauraHitList.filter(({ time }) => now - time <= 100);
    if (attacker.killauraHitList.length >= 2) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "A", "Combat (Multi-aura)");
        attacker.killauraHitList = [];
        addHP(hurtEntity, damage);
    }
    hurtEntity.antiReachRecordTime = now + 12000;
    attacker.antiReachRecordTime = now + 12000;
    if (attacker.killauraFlag > 0 && now - attacker.killauraLastFlag > 12000) {
        attacker.killauraFlag = 0;
    }
    if (!attacker?.antiReachRecording) {
        recordHeadPosition(attacker);
    }
    if (!hurtEntity?.antiReachRecording) recordPosition(hurtEntity);
    const { x: pitch, y: yaw } = attacker.getRotation();
    const absPitch = fastAbs(pitch);
    const attackDistance = distance(attacker.location, hurtEntity.location);
    if (hurtEntity instanceof Player || hurtEntity.typeId.includes("villager")) {
        const height = attacker.location.y - hurtEntity.location.y;
        if (attacker?.antiReachRecords && attacker.antiReachRecords.length >= 10 && hurtEntity?.antiReachRecords && hurtEntity.antiReachRecords.length >= 10) {
            const attackerRecords = attacker.antiReachRecords;
            const hurtEntityRecords = hurtEntity.antiReachRecords;
            if (attackDistance > 3) {
                system.runTimeout(() => {
                    const newRec1 = attackerRecords.concat(attacker.antiReachRecords!);
                    const newRec2 = hurtEntityRecords.concat(hurtEntity.antiReachRecords!);
                    const reachDistance = lineDistance(newRec1, newRec2);
                    attacker.sendMessage(`${reachDistance} | ${attacker.killauraFlag}`);
                    if (reachDistance > (absPitch < 50 && height >= 2 ? 4.55 : 4.01)) {
                        attacker.killauraFlag++;
                        attacker.killauraLastFlag = now;
                        if (attacker.killauraFlag >= 3)
                            attacker.flag("Killaura", "B", "Combat (Reach)", {
                                attackDistance: attackDistance.toFixed(2),
                                reachDistance: reachDistance.toFixed(2),
                            });
                        addHP(hurtEntity, damage);
                    }
                }, 10);
            }
        }
        const distanceH = distanceXZ(attacker.location, hurtEntity.location);
        if (distanceH > 3 && fastAbs(pitch) > 60) {
            attacker.killauraFlag++;
            attacker.killauraLastFlag = now;
            if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "C", "Combat", { distanceH: distanceH.toFixed(2), pitch });
            addHP(hurtEntity, damage);
        }
        if (distanceH > 3.5) {
            const angle = calculateRelativeViewAngle(attacker.getHeadLocation(), hurtEntity.location, yaw);
            if (angle > (attacker.inputInfo.lastInputModeUsed === "Touch" ? 135 : 85)) {
                attacker.killauraFlag++;
                attacker.killauraLastFlag = now;
                if (attacker.killauraFlag >= 3) attacker.flag("Killaura", "D", "Combat", { angle });
                addHP(hurtEntity, damage);
            }
        }
    }
    if (yaw % 45 === 0) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "E", "Combat", { yaw });
        addHP(hurtEntity, damage);
    }
}
function tickEvent(player: Player) {
    const { x: pitch, y: yaw } = player.getRotation();
    player.killauraPitch ??= [];
    player.killauraYaw ??= [];
    player.killauraXSpeed ??= [];
    const xSpeed = pitch - (player.killauraPitch[0] ?? pitch);
    if (player.killauraPitch.length > 100) {
        const ySpeed = fastAbs(yaw - player.killauraYaw[0]);
        player.killauraSmoothFlag ??= 0;
        if (xSpeed === 0 && ySpeed > 0.0001) {
            player.killauraSmoothFlag++;
            if (player.killauraSmoothFlag > 30) {
                player.flag("Killaura", "F", "Combat (Aim)", { xSpeed: xSpeed.toFixed(2), ySpeed: ySpeed.toFixed(2) });
                player.killauraSmoothFlag = 0;
            }
        } else if (xSpeed > 0) {
            player.killauraSmoothFlag = 0;
        }
        player.killauraPitch.pop();
        player.killauraYaw.pop();
        player.killauraXSpeed.pop();
    }
    player.killauraPitch.unshift(pitch);
    player.killauraYaw.unshift(yaw);
    player.killauraXSpeed.unshift(xSpeed);
}
