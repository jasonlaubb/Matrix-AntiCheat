import { Entity, EntityHurtAfterEvent, Player, system, Vector3, world } from "@minecraft/server";
import { calculateRelativeViewAngle, distance, fastAbs, lineDistance, detectPeaks } from "../util/mathUtil";
import { addHP } from "../util/util";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
export default {
    id: "antikillaura",
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
        if (entity.antiReachRecords!.length > 20) entity.antiReachRecords!.pop();
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
        if (entity.antiReachRecords!.length > 20) entity.antiReachRecords!.pop();
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
    const height = fastAbs(attacker.location.y - hurtEntity.location.y);
    if (attacker?.antiReachRecords && attacker.antiReachRecords.length >= 10 && hurtEntity?.antiReachRecords && hurtEntity.antiReachRecords.length >= 10) {
        const attackerRecords = attacker.antiReachRecords;
        const hurtEntityRecords = hurtEntity.antiReachRecords;
        if (attackDistance > 4) {
            system.runTimeout(() => {
                attackerRecords.concat(attacker.antiReachRecords!);
                hurtEntityRecords.concat(hurtEntity.antiReachRecords!);
                const reachDistance = lineDistance(attackerRecords, hurtEntityRecords);
                attacker.sendMessage(`Reach distance: ` + attackDistance + "/" + (absPitch < 50 && height >= 2 ? 4.55 : 4.25));
                if (reachDistance > (absPitch < 50 && height >= 2 ? 4.35 : 4.55)) {
                    attacker.killauraFlag++;
                    attacker.killauraLastFlag = now;
                    if (attacker.killauraFlag >= 3)
                        attacker.flag("Killaura", "B", "Combat (Reach)", {
                            attackDistance,
                            reachDistance,
                        });
                    // Recover health for the hurt entity if reach detected
                    addHP(hurtEntity, damage);
                }
            }, 20);
        }
    }
    if (attackDistance > 3 && fastAbs(pitch) > 75) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "C", "Combat", { attackDistance, pitch });
        addHP(hurtEntity, damage);
    }
    if (attackDistance > 3.5) {
        const angle = calculateRelativeViewAngle(attacker.getHeadLocation(), hurtEntity.location, yaw);
        if (angle > (attacker.inputInfo.lastInputModeUsed === "Touch" ? 135 : 85)) {
            attacker.killauraFlag++;
            attacker.killauraLastFlag = now;
            if (attacker.killauraFlag >= 3) attacker.flag("Killaura", "D", "Combat", { attackDistance, angle });
            addHP(hurtEntity, damage);
        }
    }
    if (yaw % 45 === 0) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "E", "Combat", { attackDistance, yaw });
        addHP(hurtEntity, damage);
    }
}
function tickEvent(player: Player) {
    const { x: pitch, y: yaw } = player.getRotation();
    player.killauraPitch ??= [];
    player.killauraYaw ??= [];
    if (player.killauraPitch.length > 80) {
        const peaks = detectPeaks(player.killauraPitch);
        player.onScreenDisplay.setActionBar("+Peak: " + peaks.posPeaks.length + " / -Peak: " + peaks.negPeaks.length);
        player.killauraPitch.pop();
        player.killauraYaw.pop();
    }
    player.killauraPitch.unshift(pitch);
    player.killauraYaw.unshift(yaw);
}
