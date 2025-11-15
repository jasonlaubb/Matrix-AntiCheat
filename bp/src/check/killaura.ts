import { Dimension, Entity, EntityDieAfterEvent, EntityHitEntityAfterEvent, EntityHurtAfterEvent, Player, PlayerSpawnAfterEvent, PlayerSwingStartAfterEvent, system, Vector3, world } from "@minecraft/server";
import { calculateRelativeViewAngle, distance, lineDistance, distanceXZ } from "../util/mathUtil";
import { addHP, banAttack, isAlive, isObstructedBetweenLocations } from "../util/util";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import { deltaVector } from "../util/vectorUtil";
export default {
    property: "antiKillauraEnable",
    enable: () => {
        world.afterEvents.entityHurt.subscribe(entityHurt);
        world.afterEvents.entityDie.subscribe(entityDie);
        world.afterEvents.playerSpawn.subscribe(playerSpawn);
        world.afterEvents.entityHitEntity.subscribe(entityHitEntity);
        world.afterEvents.playerSwingStart.subscribe(playerSwing);
        addCheckInterval("killaura", aimCheck);
    },
    disable: () => {
        world.afterEvents.entityHurt.unsubscribe(entityHurt);
        world.afterEvents.entityDie.unsubscribe(entityDie);
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn);
        world.afterEvents.entityHitEntity.unsubscribe(entityHitEntity);
        world.afterEvents.playerSwingStart.unsubscribe(playerSwing);
        removeCheckInterval("killaura");
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
        entity.antiReachRecords!.unshift(deltaVector(entity.location, 0, 0.5, 0));
        if (entity.antiReachRecords!.length > 20) entity.antiReachRecords!.pop();
    });
}
function recordHeadPosition(player: Player) {
    player.killauraHeadData = [];
    player.killauraHeadRecording = true;
    const id = system.runInterval(() => {
        if (!player.isValid || !player.antiReachRecordTime || player.antiReachRecordTime < Date.now()) {
            delete player.killauraHeadRecording;
            system.clearRun(id);
            return;
        }
        player.killauraHeadData.unshift(player.getHeadLocation());
        if (player.killauraHeadData.length > 20) player.killauraHeadData.pop();
    });
}
function entityDie({ deadEntity }: EntityDieAfterEvent) {
    if (!(deadEntity instanceof Player)) return;
    deadEntity.killauraLastReset = Date.now();
    deadEntity.killauraHasChangedPitch = false;
}
function playerSpawn({ player }: PlayerSpawnAfterEvent) {
    player.killauraLastReset = Date.now();
    player.killauraHasChangedPitch = false;
}
function entityHitEntity({ damagingEntity: player }: EntityHitEntityAfterEvent) {
    if (!(player instanceof Player)) return;
    player.killauraHitAt = Date.now();
}
function playerSwing({ player }: PlayerSwingStartAfterEvent) {
    player.killauraSwingAt = Date.now();
}
function entityHurt({ hurtEntity, damageSource: { damagingEntity: attacker, damagingProjectile, cause }, damage }: EntityHurtAfterEvent) {
    if (cause !== "entityAttack" || damagingProjectile || !attacker || !(attacker instanceof Player) || attacker.isOp() || attacker.getGameMode() === "Creative" || !attacker.getComponent("health")?.currentValue) return;
    const now = Date.now();
    attacker.killauraFlag ??= 0;
    attacker.killauraLastFlag ??= 0;
    attacker.killauraHitList ??= [];
    attacker.killauraLastAttack = now;
    if (!attacker.killauraHitList.map(({ id }) => id).includes(hurtEntity.id) && now - attacker.lastRiptide > 3000) attacker.killauraHitList.push({ id: hurtEntity.id, time: now });
    attacker.killauraHitList = attacker.killauraHitList.filter(({ time }) => now - time <= 100);
    // Hit more than 1 entity in a tick
    if (attacker.killauraHitList.length >= 3 || (attacker.killauraHitList.length >= 2 && attacker.killauraHitList.filter(({ time }) => now - time <= 70))) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        // Only flag when player trigger this check twice in 12s to prevent spike lag false positive
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "A", "Combat (Multi-aura)");
        attacker.killauraHitList = [];
        addHP(hurtEntity, damage);
    }
    if (attacker.killauraFlag > 0 && now - attacker.killauraLastFlag > 12000) {
        attacker.killauraFlag = 0;
    }
    if (attacker.isSafeDevice()) return; // No gonna finish other checks if player is safe device
    hurtEntity.antiReachRecordTime = now + 12000;
    attacker.antiReachRecordTime = now + 12000;
    if (!attacker?.killauraHeadRecording) recordHeadPosition(attacker);
    if (!hurtEntity?.antiReachRecording) recordPosition(hurtEntity);
    const { x: pitch, y: yaw } = attacker.getRotation();
    const absPitch = Math.abs(pitch);
    const attackDistance = distance(attacker.location, hurtEntity.location);
    const isPlayer = hurtEntity instanceof Player;
    let recoverDamage = false;
    if (isPlayer || hurtEntity.typeId.includes("villager")) {
        const height = attacker.location.y - hurtEntity.location.y;
        if (attacker?.killauraHeadData && attacker.killauraHeadData.length >= 20 && hurtEntity?.antiReachRecords && hurtEntity.antiReachRecords.length >= 20) {
            const attackerRecords = attacker.killauraHeadData;
            const hurtEntityRecords = hurtEntity.antiReachRecords;
            if (attackDistance > 2) {
                // reachDistance, the min distance between the attacker and hurtEntity (it can be distance between current-pos and 1s-before pos)
                const reachDistance = lineDistance(attackerRecords, hurtEntityRecords);
                if (reachDistance > (absPitch < 50 && Math.abs(height) >= 2 ? 4.6 : 3.6)) {
                    attacker.flag("Killaura", "B", "Combat (Reach)", {
                        attackDistance: attackDistance.toFixed(2),
                        reachDistance: reachDistance.toFixed(2),
                    });
                    recoverDamage = true;
                }
            }
        }
        const distanceH = distanceXZ(attacker.location, hurtEntity.location);
        // Looking down or up while hitting an entity horizontally
        if (distanceH > 3 && Math.abs(pitch) > 60) {
            attacker.killauraFlag++;
            attacker.killauraLastFlag = now;
            if (attacker.killauraFlag >= 3) attacker.flag("Killaura", "C", "Combat", { distanceH: distanceH.toFixed(2), pitch });
            recoverDamage = true;
        }
        // To prevent false positive, only check if the attack is formed horizontally
        if (distanceH > 2.5) {
            const angle = calculateRelativeViewAngle(attacker.getHeadLocation(), hurtEntity.location, yaw);
            // Hit entity out of view
            if (angle > (attacker.inputInfo.lastInputModeUsed === "Touch" && !attacker.inputInfo.touchOnlyAffectsHotbar ? 160 : 50)) {
                attacker.killauraFlag++;
                attacker.killauraLastFlag = now;
                if (attacker.killauraFlag >= 3) attacker.flag("Killaura", "D", "Combat (HitBox)", { angle });
                recoverDamage = true;
            }
        }
        if (
            isAlive(hurtEntity) &&
            !hurtEntity.isSwimming &&
            !attacker.isSwimming &&
            !hurtEntity.isSleeping &&
            !hasClearPathBetweenEntities(attacker.dimension, attacker.location, hurtEntity.location) &&
            !hasClearPathBetweenEntities(hurtEntity.dimension, getTickPos(attacker), getTickPos(hurtEntity))
        ) {
            recoverDamage = true;
            attacker.flag("Killaura", "E", "Combat (GhostHand)");
        }
    }
    if (isAlive(attacker) && (yaw % 1 === 0 || pitch % 1 === 0)) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "F", "Combat", { yaw, pitch });
        recoverDamage = true;
    }
    if (attacker.itemStartUse && now - attacker.itemStartUse > 150 && now - attacker.lastRiptide > 500) {
        attacker.flag("Killaura", "J", "Combat");
        recoverDamage = true;
    }
    // Hitting entity while they were sleeping lol
    if (attacker.isSleeping) {
        attacker.flag("Killaura", "K", "Combat");
        recoverDamage = true;
    }
    // Some bad* client can do this (even horion doesn't do)
    if (attacker.id === hurtEntity.id) {
        attacker.flag("Killaura", "L", "Combat");
        recoverDamage = true;
    }
    if (recoverDamage) addHP(hurtEntity, damage); // Recover the hp
}
function getTickPos(entity: Entity) {
    const { x, y, z } = entity.getVelocity();
    return deltaVector(entity.location, -x, -y, -z);
}
function aimCheck(player: Player) {
    const pitch = player.getRotation().x;
    const now = Date.now();
    const { x, y, z } = player.getVelocity();
    if (x === 0 && z === 0 && Math.abs(y) < 1) {
        player.killauraLastReset = now;
        player.killauraHasChangedPitch = false;
    }
    if (player.killauraHasChangedPitch && now - player.killauraLastAttack < 800 && pitch % 1 === 0) {
        player.killauraLastAttack = 0;
        banAttack(player, 100);
        player.flag("Killaura", "G", "Combat", { pitch });
    }
    if (player.killauraHitAt) {
        player.killauraSwingAt ??= now;
        const difference = Math.abs(player.killauraHitAt - player.killauraSwingAt);
        // No swing detected within 1s of hit
        if (difference > 1000) {
            player.killauraNoSwingFlag ??= 0;
            player.killauraNoSwingFlag++;
            delete player.killauraHitAt;
            if (player.killauraNoSwingFlag >= 3) {
                player.flag("Killaura", "I", "Combat (No Swing)", { difference });
                player.killauraNoSwingFlag = 0;
            }
        } else player.killauraNoSwingFlag = 0;
    }
    // Wait 1.5s before checck for changed pitch
    if (!player.killauraHasChangedPitch && now - player.killauraLastReset > 1500 && pitch !== 0) {
        player.killauraHasChangedPitch = true;
    }
    if (player.isFalling) player.killauraLastInAir = Date.now();
}
function getCollisionPoints(loc: Vector3): Vector3[] {
    const offsets = [
        { x: 0, z: 0 }, // center
        { x: 0.3, z: 0 },
        { x: -0.3, z: 0 },
        { x: 0, z: 0.3 },
        { x: 0, z: -0.3 },
        { x: 0.3, z: 0.3 },
        { x: -0.3, z: -0.3 },
        { x: 0.3, z: -0.3 },
        { x: -0.3, z: 0.3 },
    ];

    const points: Vector3[] = [];
    for (const offset of offsets) {
        points.push({
            x: loc.x + offset.x,
            y: loc.y,
            z: loc.z + offset.z,
        });
        points.push({
            x: loc.x + offset.x,
            y: loc.y + 1,
            z: loc.z + offset.z,
        });
        points.push({
            x: loc.x + offset.x,
            y: loc.y + 1.8,
            z: loc.z + offset.z,
        });
    }

    return points;
}
function hasClearPathBetweenEntities(dimension: Dimension, attacker: Vector3, target: Vector3): boolean {
    const attackerPoints = getCollisionPoints(attacker);
    const targetPoints = getCollisionPoints(target);

    for (const aPoint of attackerPoints) {
        for (const tPoint of targetPoints) {
            if (!isObstructedBetweenLocations(aPoint, tPoint, dimension)) {
                return true; // At least one clear path
            }
        }
    }

    return false; // All paths obstructed
}