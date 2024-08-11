import { EntityDamageCause, EntityHurtAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { bypassMovementCheck, c, flag } from "../../Assets/Util.js";
import { registerModule, configi } from "../Modules.js";
import { AnimationControllerTags } from "../../Data/EnumData.js";
import { isSpikeLagging } from "../../Assets/Public.js";
import { freezeTeleport } from "./NoClip.js";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

/**
 * @author RamiGamerDev (type A) & jasonlaubb (type B)
 * @description A strong anti speed for Minecraft Bedrock Edition, this check can detect the player with client movement.
 */
interface Speeddata {
    speedData: Vector3;
    lastAttack: number;
    lastVelocity: number;
    lastLastLoggedV: number;
    lastReset: number;
    lastOutOfRange: number;
    speedMaxV: number;
    flagNumber?: number;
    firstTrigger?: number;
    currentFlagCombo?: number;
    blockMovementLoop: number[];
    lastLocation: Vector3;
    lastRiding: number;
    lastFlag: number;
}
const speeddata = new Map<string, Speeddata>();

async function AntiSpeed(config: configi, player: Player) {
    const now = Date.now();
    const data =
        speeddata.get(player.id) ??
        ({
            speedData: player.location,
            lastAttack: 0,
            lastVelocity: 0,
            lastLastLoggedV: 0,
            lastReset: 0,
            lastOutOfRange: 0,
            speedMaxV: 0,
            flagNumber: 0,
            firstTrigger: 0,
            currentFlagCombo: 0,
            blockMovementLoop: [],
            lastLocation: player.location,
            lastRiding: 0,
            lastFlag: 0,
        } as Speeddata);
    // define cool things
    const { x, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    const solidBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.isSolid;
    const safePos = data.speedData;
    if (player.hasTag(AnimationControllerTags.riding)) {
        data.lastRiding = now;
        speeddata.set(player.id, data);
        return;
    }
    // skip the code for some reasons
    if (player.isFlying || player.isGliding) return;
    // start complex things
    // changing value when needed to avoid false postives
    if (solidBlock) data.speedMaxV = config.antiSpeed.inSolidThreshold;
    if (now - data.lastAttack < 1000) data.speedMaxV = config.antiSpeed.damageThreshold;
    if (now - data.lastAttack > 1000 && !solidBlock) data.speedMaxV = config.antiSpeed.commonThreshold;
    // checking if the player didnt got flagged then save location
    if (xz - player.lastXZLogged < data.speedMaxV && now - data.lastOutOfRange > 900 && player.lastXZLogged - xz < data.speedMaxV) {
        data.speedData = player.location;
    }
    // check if the player flagged for if the difference between now and last velocity more than the maxvalue in one tick
    // velocityDifferent = difference between last and now velocity
    const velocityDifferent = xz - player.lastXZLogged;
    const velDiffOutOfRange = velocityDifferent > data.speedMaxV;
    if (velDiffOutOfRange && now - data.lastReset >= 100) {
        data.lastOutOfRange = now;
    }
    const speedEffect = player.getEffect(MinecraftEffectTypes.Speed)?.amplifier;
    const illegalEffect = speedEffect && hasIllegalSpeedEffect(player, speedEffect);
    const notSpikeLagging = !isSpikeLagging(player);
    // Speed/A - Checks if the player has high velocity different.
    if (
        !bypassMovementCheck(player) &&
        !illegalEffect &&
        !player.hasTag(AnimationControllerTags.riding) &&
        !player.getComponent("riding")?.entityRidingOn &&
        velocityDifferent > data.speedMaxV &&
        now - data.lastReset >= 100 &&
        velocityDifferent - data.lastVelocity < 0.3 &&
        notSpikeLagging
    ) {
        data.firstTrigger ??= now;
        data.currentFlagCombo ??= config.antiSpeed.validFlagDuration - config.antiSpeed.flagDurationIncrase;
        data.flagNumber ??= 0;
        data.flagNumber++;
        data.lastReset = now;
        // Teleport the player to last position
        // Minimum time given to flag
        if (now - data.firstTrigger < data.currentFlagCombo) {
            if (data.flagNumber > config.antiSpeed.maxFlagInDuration) {
                freezeTeleport(player, safePos);
                data.currentFlagCombo += config.antiSpeed.flagDurationIncrase;
                flag(player, "Speed", "A", config.antiSpeed.maxVL, config.antiSpeed.punishment, ["velocityXZ" + ":" + velocityDifferent.toFixed(2)]);
            } else {
                player.teleport(safePos);
            }
        } else {
            delete data.currentFlagCombo;
            delete data.firstTrigger;
            delete data.flagNumber;
        }
    }
    // saving last high velocity
    if (velocityDifferent > data.speedMaxV) data.lastVelocity = velocityDifferent;
    // saving last normal velocity before beeing flagged
    if (velocityDifferent < data.speedMaxV) data.lastLastLoggedV = player.lastXZLogged;
    const { x: x1, z: z1 } = player.location;
    const { x: x2, z: z2 } = data.lastLocation;
    const moveDistance = Math.hypot(x1 - x2, z1 - z2);
    const state = moveDistance == 0 ? -1 : moveDistance > config.antiSpeed.absThreshould ? 1 : 0;
    data.blockMovementLoop.push(state);
    // Statistic if the player is doing horizontal client-side only movement.
    let loopLength = data.blockMovementLoop.length;
    if (loopLength > 180) {
        loopLength--;
        data.blockMovementLoop.shift();
        const truePositives = data.blockMovementLoop.filter((x) => x == 1).length / loopLength;
        const falsePositives = data.blockMovementLoop.filter((x) => x == -1).length / loopLength;
        const trueNegatives = data.blockMovementLoop.filter((x) => x == 0).length / loopLength;
        // player.onScreenDisplay.setActionBar(`++${truePositives.toFixed(5)} | -+${falsePositives.toFixed(5)} | +-${trueNegatives.toFixed(5)}`);
        const normalMotionFlag = truePositives > 0.05 && truePositives <= 0.1 && falsePositives < 0.19 && trueNegatives > 0.8 && trueNegatives < 0.96; // Common motion
        const highMotionFlag = truePositives > 0.16 && truePositives <= 0.2 && falsePositives < 0.6 && trueNegatives > 0.78; // Test from Prax client (speed)
        const flyMotionFlag = truePositives > 0.13 && truePositives < 0.16 && falsePositives < 0.34 && trueNegatives > 0.7; // Test from Prax client (flying)
        // Speed/B - Check if player has illegal motion frequency
        const flagCondition = normalMotionFlag || highMotionFlag || flyMotionFlag;
        const isNearlyReset = data.lastReset && now - data.lastReset < 6000;
        if (
            !bypassMovementCheck(player) &&
            !isNearlyReset &&
            !illegalEffect &&
            notSpikeLagging &&
            now - data.lastRiding > 3500 &&
            flagCondition &&
            (!data?.lastAttack || now - data.lastAttack > 3000) &&
            (!player?.lastExplosionTime || now - player.lastExplosionTime > 3000)
        ) {
            const lastflag = data.lastFlag;
            data.lastFlag = now;
            if (now - lastflag < 10000) {
                freezeTeleport(player, safePos);
                flag(player, "Speed", "B", config.antiSpeed.maxVL, config.antiSpeed.punishment, ["TruePositives" + ":" + truePositives.toFixed(3), "FalsePositives" + ":" + falsePositives.toFixed(3), "TrueNegatives" + ":" + trueNegatives.toFixed(3)]);
            } else {
                player.teleport(safePos);
            }
            data.blockMovementLoop = [];
        }
    }
    // finally saving last xz velocity
    player.lastXZLogged = xz;
    data.lastLocation = player.location;
    speeddata.set(player.id, data);
}
function entityHurt({ damageSource: { cause }, hurtEntity }: EntityHurtAfterEvent) {
    if (cause == EntityDamageCause.entityAttack || cause == EntityDamageCause.blockExplosion) {
        const data = speeddata.get(hurtEntity.id);
        if (data) data.lastAttack = Date.now();
        speeddata.set(hurtEntity.id, data!);
    }
}

function hasIllegalSpeedEffect(player: Player, effectLevel: number) {
    const allowLevels = c().antiSpeed.allowSpeedLevels;
    if (player.hasTag(AnimationControllerTags.usingItem) && effectLevel > allowLevels.usingItem) return true;
    if (player.isSprinting && effectLevel > allowLevels.sprinting) return true;
    if (effectLevel > allowLevels.moving) return true;
    return false;
}

registerModule(
    "antiSpeed",
    false,
    [speeddata],
    {
        intick: async (config, player) => AntiSpeed(config, player),
        tickInterval: 1,
    },
    {
        worldSignal: world.afterEvents.entityHurt,
        playerOption: { entityTypes: ["player"] },
        then: async (_config, event) => entityHurt(event),
    }
);
