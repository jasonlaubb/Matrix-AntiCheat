import { Dimension, EntityHitEntityAfterEvent, EquipmentSlot, GameMode, ItemUseAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import { pythag } from "../util/mathUtil";
import { isRiding } from "../util/util";
import { safeGetBlock } from "../util/vectorUtil";
import type { SpeedData } from "../../../global";
const VELOCITY_DELTA_THRESHOLD = 0.7;
const FLAG_TIMESTAMP_THRESHOLD = 8000;
const TYPE1_MAX_FLAG = 20;
const TYPE2_MAX_FLAG = 6;
function tick(player: Player) {
    const data: SpeedData = player.speedData ?? {
        lastAttackTimestamp: 0,
        lastRidingEndTimestamp: 0,
        flagAmount: 0,
        lastFlagTimestamp: 0,
        lastStopLocation: player.location,
        lastSleep: 0,
        previousSpeed: new Array(20).fill(0),
        timerFlagAmount: 0,
        lastTriggerLocation: player.location,
        lastTimerFlagTimestamp: 0,
        timerMainFlagAmount: 0,
        lastSprint: player.isSprinting,
        lastEnderPeal: 0,
        lastRiding: false,
        lastLocation: player.location,
        lastSpeedXZ: 0,
        lastVelocity: { x: 0, z: 0 },
    };
    const now = Date.now();

    const velocity = player.getVelocity();
    const { x: velocityX, y: velocityY, z: velocityZ } = velocity;

    if (velocityX === 0 && velocityY === 0 && velocityZ === 0) {
        data.lastStopLocation = player.location;
    }

    if (player.isSleeping || player.isFlying || player.isGliding || isRiding(player)) {
        data.lastSleep = now;
    }

    const speedLevel = (player.getEffect("minecraft:speed")?.amplifier ?? -1) + 1;
    const ride = isRiding(player);
    const bypass =
        player.isFlying ||
        now - data.lastFlagTimestamp < 250 ||
        now - data.lastAttackTimestamp < 1000 ||
        now - data.lastRidingEndTimestamp < 500 ||
        now - player.lastKnockback < 1500 ||
        now - player.lastRiptide < 5000 ||
        player.getGameMode() === GameMode.Creative ||
        player.isSleeping ||
        now - data.lastSleep < 1000 ||
        ride ||
        speedLevel > 3 ||
        isPlayerInSolid(player.location, player.getHeadLocation(), player.dimension);

    const lastLocation = data.lastLocation;
    const distance = lastLocation ? pythag(player.location.x - lastLocation.x, player.location.z - lastLocation.z) : 0;

    if (ride !== data.lastRiding) {
        data.lastEnderPeal = now;
    }

    if (!bypass) {
        const lastVelocity = data.lastVelocity ?? { x: 0, z: 0 };
        const velocityDelta = pythag(velocityX - lastVelocity.x, velocityZ - lastVelocity.z);
        if (velocityDelta > VELOCITY_DELTA_THRESHOLD) {
            if (now - data.lastFlagTimestamp > FLAG_TIMESTAMP_THRESHOLD) {
                data.flagAmount = 0;
            }
            data.lastFlagTimestamp = now;
            data.flagAmount++;

            if (data.flagAmount > TYPE1_MAX_FLAG) {
                // Don't work on server with correct movement prediction instead of serverAuth
                player.flag("Speed", "A", "Movement", { velocityDelta });
                data.flagAmount = 0;
            }

            if (velocityDelta >= 3) {
                player.teleport(data.lastStopLocation);
            }
        } else if (distance > 0.2 && !player.isInWater && !player.isSwimming && !data.previousSpeed.includes(distance)) {
            const velocitySpeed = data.lastSpeedXZ ?? 0;
            const normalDistance = distance * 0.5;

            const condition = player.isSprinting && !isSwiftSneak(player) ? normalDistance * 0.7 : normalDistance > velocitySpeed * 1.2 ** speedLevel;

            if (velocitySpeed > 0 && condition && now - data.lastEnderPeal > 1200 && distance > VELOCITY_DELTA_THRESHOLD && data.lastSprint === player.isSprinting) {
                if (data.timerFlagAmount < 1) {
                    data.lastTriggerLocation = player.location;
                }
                data.timerFlagAmount += 1;

                if (data.timerFlagAmount > TYPE1_MAX_FLAG) {
                    player.teleport(data.lastTriggerLocation);
                    data.timerFlagAmount = 0;

                    if (now - data.lastTimerFlagTimestamp > 12000) {
                        data.timerMainFlagAmount = 0;
                    }

                    data.lastTimerFlagTimestamp = now;
                    data.timerMainFlagAmount++;

                    if (data.timerMainFlagAmount > TYPE2_MAX_FLAG) {
                        player.flag("Speed", "B", "Movement (Timer)", { velocitySpeed, distance });
                    }
                }
            } else if (data.timerFlagAmount >= 0.15) {
                data.timerFlagAmount -= 0.15;
            }
        } else if (data.timerFlagAmount >= 0.1) {
            data.timerFlagAmount -= 0.1;
        }
    }

    data.previousSpeed.push(distance);
    data.previousSpeed.shift();
    data.lastSprint = player.isSprinting;
    data.lastRiding = ride;
    data.lastLocation = player.location;
    data.lastVelocity = { x: velocityX, z: velocityZ };
    data.lastSpeedXZ = pythag(velocityX, velocityZ);
    player.speedData = data;
}

function onPlayerAttack({ damagingEntity: player }: EntityHitEntityAfterEvent) {
    if (!(player instanceof Player) || !player.speedData) return;
    player.speedData.lastAttackTimestamp = Date.now();
}

function itemUse({ itemStack, source }: ItemUseAfterEvent) {
    if (!(source instanceof Player)) return;
    if (itemStack.typeId !== "minecraft:ender_peal" || !source.speedData) return;
    source.speedData.lastEnderPeal = Date.now();
}

function isPlayerInSolid(location: Vector3, headLocation: Vector3, dimension: Dimension) {
    try {
        const bodyBlock = safeGetBlock(dimension, location);
        const headBlock = safeGetBlock(dimension, headLocation);
        return bodyBlock?.isSolid || headBlock?.isSolid;
    } catch {
        return false;
    }
}

function isSwiftSneak(player: Player) {
    if (!player.isSneaking) return false;
    const leg = player.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Legs)?.getItem();
    if (!leg) return false;
    const enchantment = leg.getComponent("enchantable");
    return enchantment?.hasEnchantment("minecraft:swift_sneak") ?? false;
}
export default {
    property: "antiSpeedEnable",
    enable: () => {
        world.afterEvents.entityHitEntity.subscribe(onPlayerAttack);
        world.afterEvents.itemUse.subscribe(itemUse);
        addCheckInterval("speed", tick);
    },
    disable: () => {
        world.afterEvents.entityHitEntity.unsubscribe(onPlayerAttack);
        world.afterEvents.itemUse.unsubscribe(itemUse);
        removeCheckInterval("speed");
    },
};
