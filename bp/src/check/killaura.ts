import { Entity, EntityHurtAfterEvent, ItemReleaseUseAfterEvent, Player, system, Vector3, world } from "@minecraft/server";
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
function releaseUse({ source: player, itemStack }: ItemReleaseUseAfterEvent) {
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
            attacker.flag("Killaura", "E", "Combat (GhostHand)");
        }
    }
    attacker.sendMessage(damage.toString() + " / " + calculateExpectedBaseDamage(attacker, hurtEntity));
    if (damage === 1.5) {
        attacker.flag("Killaura", "I", "Combat (Critical)");
    }
    if (yaw % 45 === 0) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "F", "Combat", { yaw });
        addHP(hurtEntity, damage);
    }
}
function aimCheck(player: Player) {
    const rot = player.getRotation();
    player.killauraLastDeltaY ??= 0;
    player.killauraLastYaw ??= rot.y;
    const deltaY = fastAbs(rot.y - player.killauraLastYaw);
    if (player.killauraLastAttack && Date.now() - player.killauraLastAttack < 800) {
        if (rot.x.toFixed(5) === "0.00000") {
            player.killauraLastAttack = 0;
            player.flag("Killaura", "G", "Combat (Aim)", { pitch: rot.x });
        }
    }
    if (rot.y < 180 && rot.y > -180 && isSuspiciousAimSnap(player, deltaY)) {
        const isRiding = player.getComponent("riding")?.entityRidingOn;
        if (!isRiding) {
            player.flag("Killaura", "H", "Combat (Aim)", { deltaY });
        }
    }
    player.killauraLastYaw = rot.y;
    player.killauraLastDeltaY = deltaY;
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
        if (block && (block.isSolid || (block.typeId.startsWith("minecraft:") && block.typeId.endsWith("glass")))) {
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
function isSuspiciousAimSnap(player: Player, deltaY: number): boolean {
    const history = player.killauraDeltaYHistory ?? [];
    history.push(deltaY);
    if (history.length > 5) history.shift(); // keep last 5

    player.killauraDeltaYHistory = history;

    const recentAvg = history.slice(0, -1).reduce((a, b) => a + b, 0) / (history.length - 1);
    const last = history[history.length - 1];

    const isSpike = last > 160 && recentAvg < 20;
    const isStableAfter = history.length === 5 && history[4] < 10;

    return isSpike && isStableAfter;
}
function calculateExpectedBaseDamage(attacker: Player, target: Entity): number {
  const weaponBaseDamage: Record<string, number> = {
    "minecraft:wooden_sword": 4,
    "minecraft:stone_sword": 5,
    "minecraft:iron_sword": 6,
    "minecraft:diamond_sword": 7,
    "minecraft:netherite_sword": 8,
    "minecraft:wooden_axe": 7,
    "minecraft:stone_axe": 9,
    "minecraft:iron_axe": 9,
    "minecraft:diamond_axe": 9,
    "minecraft:netherite_axe": 10,
    "minecraft:air": 0,
  };

  const inventory = attacker.getComponent("inventory")?.container;
  const weapon = inventory?.getItem(attacker.selectedSlotIndex);
  const weaponId = weapon?.typeId ?? "minecraft:air";
  let baseDamage = (weaponBaseDamage[weaponId] ?? 0) + 1;

  // 🔍 Check for Sharpness enchantment
  const enchantments = weapon?.getComponent("enchantable");
  const sharpnessLevel = enchantments?.getEnchantment("minecraft:sharpness")?.level ?? 0;

  if (sharpnessLevel > 0) {
    const extraDamage = 1.25 * sharpnessLevel;
    baseDamage += extraDamage;
  }

  const armorReduction: Record<string, number> = {
    "minecraft:leather_helmet": 0.04,
    "minecraft:leather_chestplate": 0.12,
    "minecraft:leather_leggings": 0.08,
    "minecraft:leather_boots": 0.04,
    "minecraft:golden_helmet": 0.08,
    "minecraft:golden_chestplate": 0.20,
    "minecraft:golden_leggings": 0.12,
    "minecraft:golden_boots": 0.04,
    "minecraft:chainmail_helmet": 0.08,
    "minecraft:chainmail_chestplate": 0.20,
    "minecraft:chainmail_leggings": 0.12,
    "minecraft:chainmail_boots": 0.04,
    "minecraft:iron_helmet": 0.08,
    "minecraft:iron_chestplate": 0.24,
    "minecraft:iron_leggings": 0.20,
    "minecraft:iron_boots": 0.08,
    "minecraft:diamond_helmet": 0.12,
    "minecraft:diamond_chestplate": 0.32,
    "minecraft:diamond_leggings": 0.24,
    "minecraft:diamond_boots": 0.12,
    "minecraft:netherite_helmet": 0.12,
    "minecraft:netherite_chestplate": 0.32,
    "minecraft:netherite_leggings": 0.24,
    "minecraft:netherite_boots": 0.12,
  };

  const targetInventory = target.getComponent("inventory")?.container;
  let totalReduction = 0;

  if (targetInventory) {
    for (let slot = 0; slot < targetInventory.size; slot++) {
      const item = targetInventory.getItem(slot);
      if (!item) continue;

      const reduction = armorReduction[item.typeId] ?? 0;
      totalReduction += reduction;
    }
  }

  totalReduction = Math.min(totalReduction, 0.8);
  const expectedDamage = baseDamage * (1 - totalReduction);
  return expectedDamage;
}