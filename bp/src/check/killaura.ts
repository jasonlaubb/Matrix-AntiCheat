import { Entity, EntityHurtAfterEvent, ItemReleaseUseAfterEvent, Player, system, Vector2, Vector3, world } from "@minecraft/server";
import { calculateRelativeViewAngle, distance, fastAbs, lineDistance, distanceXZ } from "../util/mathUtil";
import { addHP } from "../util/util";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
export default {
    property: "antiKillauraEnable",
    enable: () => {
        world.afterEvents.entityHurt.subscribe(entityHurt);
        world.afterEvents.itemReleaseUse.subscribe(releaseUse);
        addCheckInterval(aimCheck);
    },
    disable: () => {
        world.afterEvents.entityHurt.unsubscribe(entityHurt);
        world.afterEvents.itemReleaseUse.unsubscribe(releaseUse);
        removeCheckInterval(aimCheck);
    },
};
function releaseUse ({ source: player, itemStack }: ItemReleaseUseAfterEvent) {
    if (!itemStack || itemStack.typeId !== "minecraft:trident" || player.isOp() || !itemStack.getComponent("enchantable")?.hasEnchantment("minecraft:riptide")) return;
    player.killauraLastRiptide = Date.now();
}
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
    attacker.killauraLastAttack = now;
    if (!attacker.killauraHitList.map(({ id }) => id).includes(hurtEntity.id) && !(attacker.killauraLastRiptide && now - attacker.killauraLastRiptide < 3000)) attacker.killauraHitList.push({ id: hurtEntity.id, time: now });
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
            if (angle > (attacker.inputInfo.lastInputModeUsed === "Touch" ? 135 : 45)) {
                attacker.killauraFlag++;
                attacker.killauraLastFlag = now;
                if (attacker.killauraFlag >= 3) attacker.flag("Killaura", "D", "Combat (HitBox)", { angle });
                addHP(hurtEntity, damage);
            }
        }
        if (!hasClearPathBetweenEntities(attacker, hurtEntity)) {
            attacker.flag("Killaura", "J", "Combat (GhostHand)");
        }
    }
    if (yaw % 45 === 0) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "E", "Combat", { yaw });
        addHP(hurtEntity, damage);
    }
}
function aimCheck (player: Player) {
    const rot = player.getRotation();
    player.killauraLastDeltaY ??= 0;
    player.killauraLastYaw ??= rot.y;
    player.killauraRotHistory ??= [];
    player.killauraRotHistory.unshift(rot);
    const deltaY = fastAbs(rot.y - player.killauraLastYaw);
    if (player.killauraLastAttack && Date.now() - player.killauraLastAttack < 800) {
        if (rot.x.toFixed(5) === "0.00000") {
            player.killauraLastAttack = 0;
            player.flag("Killaura", "F", "Combat (Aim)", { pitch: rot.x });
        }
        const rotHistory = player.killauraRotHistory;
        const duplicateCount = countNonContinuousDuplicates(rotHistory);

        if (rotHistory.length > 20 && duplicateCount >= 3) {
            player.killauraRotHistory = [];
            player.flag("Killaura", "G", `Combat (Aim) - ${duplicateCount} non-continuous repeats`);
        }
    }
    if (rot.y < 180 && rot.y > -180 && deltaY > 320 && player.killauraLastDeltaY < 30) {
        const isRiding = player.getComponent("riding")?.entityRidingOn;
        if (!isRiding) {
            player.flag("Killaura", "I", "Combat (Aim)", { deltaY });
        }
    }
    if (player.killauraRotHistory.length > 10) player.killauraRotHistory.pop();
    player.killauraLastYaw = rot.y;
    player.killauraLastDeltaY = deltaY;
}
function countNonContinuousDuplicates(vectors: Vector2[]): number {
  const positions = new Map<string, number[]>();
  const key = (v: Vector2) => `${v.x},${v.y}`;

  for (let i = 0; i < vectors.length; i++) {
    const k = key(vectors[i]);
    if (!positions.has(k)) positions.set(k, []);
    positions.get(k)!.push(i);
  }

  let count = 0;
  for (const indices of positions.values()) {
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] - indices[i - 1] > 1) {
        count++;
      }
    }
  }

  return count;
}

function isObstructedBetweenLocations(start: Vector3, end: Vector3, stepSize: number = 0.5): boolean {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dz = end.z - start.z;

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const steps = Math.floor(distance / stepSize);

  const stepX = dx / steps;
  const stepY = dy / steps;
  const stepZ = dz / steps;

  const dimension = world.getDimension("overworld");

  for (let i = 0; i <= steps; i++) {
    const x = start.x + stepX * i;
    const y = start.y + stepY * i;
    const z = start.z + stepZ * i;

    const blockX = Math.floor(x);
    const blockY = Math.floor(y);
    const blockZ = Math.floor(z);

    const block = dimension.getBlock({ x: blockX, y: blockY, z: blockZ });
    if (block && block.isSolid) {
      return true;
    }
  }

  return false;
}
function getCollisionPoints(entity: Entity): Vector3[] {
  const loc = entity.location;
  const head = entity.getHeadLocation();

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
      y: loc.y + 1.0, // shoulder height
      z: loc.z + offset.z,
    });
    points.push({
      x: head.x + offset.x,
      y: head.y,
      z: head.z + offset.z,
    });
  }

  return points;
}
function hasClearPathBetweenEntities(attacker: Entity, target: Entity): boolean {
  const attackerPoints = getCollisionPoints(attacker);
  const targetPoints = getCollisionPoints(target);

  for (const aPoint of attackerPoints) {
    for (const tPoint of targetPoints) {
      if (!isObstructedBetweenLocations(aPoint, tPoint)) {
        return true; // At least one clear path
      }
    }
  }

  return false; // All paths obstructed
}