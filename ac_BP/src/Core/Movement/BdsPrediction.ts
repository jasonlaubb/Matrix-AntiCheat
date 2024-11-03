import { EntityDamageCause, EntityHurtAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { bypassMovementCheck } from "../../Assets/Util.js";
import { registerModule, configi } from "../Modules.js";
import { AnimationControllerTags } from "../../Data/EnumData.js";
import { getMsPerTick, isSpikeLagging } from "../../Assets/Public.js";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import flag from "../../Assets/flag.js";

/**
 * @author RamiGamerDev (type A) & jasonlaubb (type B)
 * @description A strong movement check for Minecraft Bedrock Edition, this check can detect the player with client movement.
 */
interface PredictionData {
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
    lastFreezeLocation: Vector3;
}
const speeddata = new Map<string, PredictionData>();

async function BdsPrediction(config: configi, player: Player) {
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
            velocityDiffList: [],
            lastFreezeLocation: player.location,
        } as PredictionData);
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
    if (solidBlock) data.speedMaxV = config.bdsPrediction.inSolidThreshold;
    if (now - data.lastAttack < 1000) data.speedMaxV = config.bdsPrediction.damageThreshold;
    if (now - data.lastAttack > 1000 && !solidBlock) data.speedMaxV = config.bdsPrediction.commonThreshold;
    // checking if the player didnt got flagged then save location
    if (xz - player.lastXZLogged < data.speedMaxV && now - data.lastOutOfRange > 900 && player.lastXZLogged - xz < data.speedMaxV) {
        data.speedData = player.location;
    }
    // check if player is not moving
    if (xz == 0) {
        data.lastFreezeLocation = player.location;
    }
    if ((xz - player.lastXZLogged < data.speedMaxV && Math.abs(xz - data.lastLastLoggedV) > 0.6) || Date.now() - data.lastReset <= 350) {
        if (!(Date.now() - data.lastReset <= 350)) data.lastReset = Date.now();
        delete data.flagNumber;
    }
    // check if the player flagged for if the difference between now and last velocity more than the maxvalue in one tick
    // velocityDifferent = difference between last and now velocity
    const velocityDifferent = xz - player.lastXZLogged;
    const velDiffOutOfRange = velocityDifferent > data.speedMaxV;
    if (velDiffOutOfRange && now - data.lastReset >= 350) {
        data.flagNumber ??= 0;
        data.flagNumber++;
        data.lastOutOfRange = now;
        data.firstTrigger ??= now;
        data.currentFlagCombo ??= config.bdsPrediction.validFlagDuration - config.bdsPrediction.flagDurationIncrase;
    }
    const notSpikeLagging = !isSpikeLagging(player);
    const lagOnlyCondition = getMsPerTick() < 44.5;
    // Speed/A - Checks if the player has high velocity different.
    if (
        !bypassMovementCheck(player) &&
        !player.hasTag(AnimationControllerTags.riding) &&
        !player.getComponent("riding")?.entityRidingOn &&
        player.lastXZLogged - xz > data.speedMaxV &&
        now - data.lastReset >= 350 &&
        now - data.lastRiding >= 1000 &&
        (player.getEffect(MinecraftEffectTypes.Speed)?.amplifier ?? 0) <= 2 &&
        !(player.lastExplosionTime && now - player.lastExplosionTime < 1500) &&
        notSpikeLagging
    ) {
        if (lagOnlyCondition) {
            player.teleport(safePos);
        } else {
            // Teleport the player to last position
            // Minimum time given to flag
            if (now - data.firstTrigger! < data.currentFlagCombo!) {
                if (player.lastXZLogged - xz - data.lastVelocity < 0.3 && data.flagNumber! > config.bdsPrediction.maxFlagInDuration) {
                    player.teleport(safePos);
                    data.currentFlagCombo! += config.bdsPrediction.flagDurationIncrase;
                    flag(player, config.bdsPrediction.modules, "A");
                } else if (((player.lastXZLogged - xz > data.speedMaxV + 1 || (solidBlock && player.lastXZLogged - xz > data.speedMaxV + 0.2)) && data.flagNumber! >= 1) || player.lastXZLogged - x >= 25) {
                    player.teleport(safePos);
                }
            } else {
                delete data.currentFlagCombo;
                delete data.firstTrigger;
                delete data.flagNumber;
            }
        }
    }
    // saving last high velocity
    if (velocityDifferent > data.speedMaxV) data.lastVelocity = velocityDifferent;
    // saving last normal velocity before beeing flagged
    if (velocityDifferent > data.speedMaxV) data.lastLastLoggedV = player.lastXZLogged;
    const { x: x1, z: z1 } = player.location;
    const { x: x2, z: z2 } = data.lastLocation;
    const moveDistance = Math.hypot(x1 - x2, z1 - z2);
    const state = moveDistance == 0 ? -1 : moveDistance > config.bdsPrediction.absThreshould ? 1 : 0;
    data.blockMovementLoop.push(state);
    let loopLength = data.blockMovementLoop.length;
    if (loopLength > 180) {
        loopLength--;
        data.blockMovementLoop.shift();
        const truePositives = data.blockMovementLoop.filter((x) => x == 1).length / loopLength;
        const falsePositives = data.blockMovementLoop.filter((x) => x == -1).length / loopLength;
        const trueNegatives = data.blockMovementLoop.filter((x) => x == 0).length / loopLength;
        // player.onScreenDisplay.setActionBar(`++${truePositives.toFixed(5)} | -+${falsePositives.toFixed(5)} | +-${trueNegatives.toFixed(5)}`);
        const highMotionFlag = truePositives > 0.16 && truePositives <= 0.2 && falsePositives < 0.6 && trueNegatives > 0.78; // Test from Prax client (speed)
        const flyMotionFlag = truePositives > 0.13 && truePositives < 0.16 && falsePositives < 0.34 && trueNegatives > 0.7; // Test from Prax client (flying)
        // Speed/B - Check if player has illegal motion frequency
        const flagCondition = highMotionFlag || flyMotionFlag;
        if (!bypassMovementCheck(player) && notSpikeLagging && now - data.lastRiding > 3500 && flagCondition && (!data?.lastAttack || now - data.lastAttack > 3000) && (!player?.lastExplosionTime || now - player.lastExplosionTime > 3000)) {
            const lastflag = data.lastFlag;
            data.lastFlag = now;
            if (now - lastflag < 10000) {
                player.teleport(safePos);
                flag(player, config.bdsPrediction.modules, "B");
            }
            data.blockMovementLoop = [];
        }
    }
    // finally saving last xz velocity
    player.lastXZLogged = xz;
    data.lastLocation = player.location;
    speeddata.set(player.id, data);
}
function entityHurt({ damageSource: { cause, damagingEntity } }: EntityHurtAfterEvent) {
    if (cause == EntityDamageCause.entityAttack || cause == EntityDamageCause.blockExplosion) {
        if (!damagingEntity || !(damagingEntity instanceof Player)) return;
        const data = speeddata.get(damagingEntity.id);
        if (data) data.lastAttack = Date.now();
        speeddata.set(damagingEntity.id, data!);
    }
}

registerModule(
    "bdsPrediction",
    false,
    [speeddata],
    {
        intick: async (config, player) => BdsPrediction(config, player),
        tickInterval: 1,
    },
    {
        worldSignal: world.afterEvents.entityHurt,
        playerOption: { entityTypes: ["player"] },
        then: async (_config, event) => entityHurt(event),
    }
);
