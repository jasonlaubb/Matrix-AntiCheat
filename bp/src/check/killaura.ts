import { Entity, EntityEquippableComponent, EntityHurtAfterEvent, EquipmentSlot, Player, system, Vector3, world } from "@minecraft/server";
import { calculateRelativeViewAngle, distance, fastAbs, lineDistance, distanceXZ } from "../util/mathUtil";
import { addHP, banAttack } from "../util/util";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
export default {
    property: "antiKillauraEnable",
    enable: () => {
        world.afterEvents.entityHurt.subscribe(entityHurt);
        addCheckInterval(aimCheck);
    },
    disable: () => {
        world.afterEvents.entityHurt.unsubscribe(entityHurt);
        removeCheckInterval(aimCheck);
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
function entityHurt({ hurtEntity, damageSource: { damagingEntity: attacker, damagingProjectile, cause }, damage }: EntityHurtAfterEvent) {
    if (cause !== "entityAttack" || damagingProjectile || !attacker || !(attacker instanceof Player) || attacker.isOp() || attacker.getGameMode() === "Creative" || !attacker.getComponent("health")?.currentValue) return;
    const now = Date.now();
    attacker.killauraFlag ??= 0;
    attacker.killauraLastFlag ??= 0;
    attacker.killauraHitList ??= [];
    attacker.killauraLastAttack = now;
    if (!attacker.killauraHitList.map(({ id }) => id).includes(hurtEntity.id) && now - attacker.lastRiptide > 3000) attacker.killauraHitList.push({ id: hurtEntity.id, time: now });
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
    if (!attacker?.killauraHeadRecording) recordHeadPosition(attacker);
    if (!hurtEntity?.antiReachRecording) recordPosition(hurtEntity);
    const { x: pitch, y: yaw } = attacker.getRotation();
    const absPitch = fastAbs(pitch);
    const attackDistance = distance(attacker.location, hurtEntity.location);
    const isPlayer = hurtEntity instanceof Player;
    if (isPlayer || hurtEntity.typeId.includes("villager")) {
        const height = attacker.location.y - hurtEntity.location.y;
        if (attacker?.killauraHeadData && attacker.killauraHeadData.length >= 20 && hurtEntity?.antiReachRecords && hurtEntity.antiReachRecords.length >= 20) {
            const attackerRecords = attacker.killauraHeadData;
            const hurtEntityRecords = hurtEntity.antiReachRecords;
            if (attackDistance > 2) {
                const reachDistance = lineDistance(attackerRecords, hurtEntityRecords);
                attacker.sendMessage(reachDistance.toFixed(7) + "/" + (absPitch < 50 && height >= 1.5 ? 4.5 : 4.2));
                if (reachDistance > (absPitch < 50 && fastAbs(height) >= 2 ? 5 : 4.5)) {
                    attacker.killauraFlag++;
                    attacker.killauraLastFlag = now;
                    if (attacker.killauraFlag >= 3)
                        attacker.flag("Killaura", "B", "Combat (Reach)", {
                            attackDistance: attackDistance.toFixed(2),
                            reachDistance: reachDistance.toFixed(2),
                        });
                    addHP(hurtEntity, damage);
                }
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
            if (angle > (attacker.inputInfo.lastInputModeUsed === "Touch" ? 160 : 50)) {
                attacker.killauraFlag++;
                attacker.killauraLastFlag = now;
                if (attacker.killauraFlag >= 3) attacker.flag("Killaura", "D", "Combat (HitBox)", { angle });
                addHP(hurtEntity, damage);
            }
        }
        if (!hasClearPathBetweenEntities(attacker, hurtEntity)) {
            addHP(hurtEntity, damage);
            attacker.flag("Killaura", "E", "Combat (GhostHand)");
        }
    }
    if (damage > 0 && !(attacker.killauraLastInAir && now - attacker.killauraLastInAir < 200)) {
        const expectedDamage = calculateExpectedBaseDamage(attacker, hurtEntity);
        if (expectedDamage && damage > expectedDamage * 1.4) {
            addHP(hurtEntity, damage);
            attacker.flag("Killaura", "I", "Combat (Criticals)");
        }
    }
    if (yaw % 45 === 0) {
        attacker.killauraFlag++;
        attacker.killauraLastFlag = now;
        if (attacker.killauraFlag >= 2) attacker.flag("Killaura", "F", "Combat", { yaw });
        addHP(hurtEntity, damage);
    }
    if (attacker.itemStartUse && now - attacker.itemStartUse > 150 && now - attacker.lastRiptide > 500) {
        attacker.flag("Killaura", "J", "Combat");
    }
    if (attacker.isSleeping) attacker.flag("Killaura", "K", "Combat");
    if (attacker.id === hurtEntity.id) attacker.flag("Killaura", "L", "Combat");
}
function aimCheck(player: Player) {
    const pitch = player.getRotation().x;
    if (Date.now() - player.killauraLastAttack < 800) {
        if (pitch.toFixed(5) === "0.00000") {
            player.killauraLastAttack = 0;
            banAttack(player, 100);
            player.flag("Killaura", "G", "Combat (Aim)");
        }
    }
    if (player.isFalling) player.killauraLastInAir = Date.now();
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
function calculateExpectedBaseDamage(attacker: Player, target: Entity): number | undefined {
    const weaponBaseDamage: Record<string, number> = {
        // Swords
        "minecraft:wooden_sword": 4,
        "minecraft:stone_sword": 5,
        "minecraft:iron_sword": 6,
        "minecraft:golden_sword": 4,
        "minecraft:diamond_sword": 7,
        "minecraft:netherite_sword": 8,

        // Axes
        "minecraft:wooden_axe": 3,
        "minecraft:stone_axe": 4,
        "minecraft:iron_axe": 5,
        "minecraft:golden_axe": 3,
        "minecraft:diamond_axe": 6,
        "minecraft:netherite_axe": 7,

        // Pickaxes
        "minecraft:wooden_pickaxe": 2,
        "minecraft:stone_pickaxe": 3,
        "minecraft:iron_pickaxe": 4,
        "minecraft:golden_pickaxe": 2,
        "minecraft:diamond_pickaxe": 5,
        "minecraft:netherite_pickaxe": 6,

        // Shovels
        "minecraft:wooden_shovel": 1,
        "minecraft:stone_shovel": 2,
        "minecraft:iron_shovel": 3,
        "minecraft:golden_shovel": 1,
        "minecraft:diamond_shovel": 4,
        "minecraft:netherite_shovel": 5,

        // Hoes
        "minecraft:wooden_hoe": 1,
        "minecraft:stone_hoe": 1,
        "minecraft:iron_hoe": 1,
        "minecraft:golden_hoe": 1,
        "minecraft:diamond_hoe": 1,
        "minecraft:netherite_hoe": 1,

        // Fist
        "minecraft:air": 0,
    };

    const inventory = attacker.getComponent("inventory")?.container;
    const weapon = inventory?.getItem(attacker.selectedSlotIndex);
    const weaponId = weapon?.typeId ?? "minecraft:air";
    if (!weaponId.startsWith("minecraft:") || weaponId === "minecraft:mace") return undefined;
    let baseDamage = (weaponBaseDamage[weaponId] ?? 0) + 1;
    const strength = attacker.getEffect("minecraft:strength")?.amplifier;
    if (strength) {
        const level = strength + 1;
        baseDamage *= 1.3 ** level + (1.3 ** level - 1) / 0.3;
    }
    // 🔍 Check for Sharpness enchantment
    const enchantments = weapon?.getComponent("enchantable");
    const sharpnessLevel = enchantments?.getEnchantment("minecraft:sharpness")?.level ?? 0;

    if (sharpnessLevel > 0) {
        const extraDamage = 1.25 * sharpnessLevel;
        baseDamage += extraDamage;
    }

    const armor = target.getComponent("equippable")!;
    const totalReduction = armor ? armor.totalArmor * 0.04 : 0;
    const protectionLevel = getProtectionLevel(armor);
    let expectedDamage = baseDamage * (1 - totalReduction) * (1 - 0.04 * protectionLevel);
    const resistance = target.getEffect("minecraft:resistance")?.amplifier;
    if (resistance) expectedDamage *= 1 - (resistance + 1) * 0.2;
    return expectedDamage;
}
function getProtectionLevel(component: EntityEquippableComponent) {
    const armor = [component?.getEquipment(EquipmentSlot.Head), component?.getEquipment(EquipmentSlot.Chest), component?.getEquipment(EquipmentSlot.Legs), component?.getEquipment(EquipmentSlot.Feet)];
    let protectionLevel = 0;
    armor.forEach((item) => {
        if (!item) return;
        const enchant = item.getComponent("enchantable");
        if (!enchant) return;
        protectionLevel += enchant.getEnchantment("minecraft:protection")?.level ?? 0;
    });
    return protectionLevel;
}
