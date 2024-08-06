import { EntityDamageCause, EntityHurtAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { bypassMovementCheck, flag } from "../../Assets/Util.js";
import { registerModule, configi } from "../Modules.js";
import { AnimationControllerTags } from "../../Data/EnumData.js";
import { isSpikeLagging } from "../../Assets/Public.js";
import { freezeTeleport } from "./NoClip.js";

/**
 * @author RamiGamerDev
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
}
const speeddata = new Map<string, Speeddata>();

async function AntiSpeed(config: configi, player: Player) {
    const now = Date.now();
    const data = speeddata.get(player.id) ?? {
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
    } as Speeddata;
    // define cool things
    const { x, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    const solidBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.isSolid;
    const safePos = data.speedData;
    // skip the code for some reasons
    if (player.isFlying || player.isGliding || player.hasTag(AnimationControllerTags.riding)) return;
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
    // check if speedLog reached the max which is 3 flag
    if (!bypassMovementCheck(player) && !player.hasTag(AnimationControllerTags.riding) && !player.getComponent("riding")?.entityRidingOn && velocityDifferent > data.speedMaxV && now - data.lastReset >= 100 && velocityDifferent - data.lastVelocity < 0.3 && !isSpikeLagging(player)) {
        data.firstTrigger ??= now;
        data.currentFlagCombo ??= config.antiSpeed.validFlagDuration - config.antiSpeed.flagDurationIncrase;
        data.flagNumber ??= 0;
        data.flagNumber++;
        data.lastReset = now;
        // Teleport the player to last position
        freezeTeleport(player, safePos);
        // Minimum time given to flag
        if (now - data.firstTrigger < data.currentFlagCombo) {
            if (data.flagNumber > config.antiSpeed.maxFlagInDuration) {
                data.currentFlagCombo += config.antiSpeed.flagDurationIncrase;
                flag(player, "Speed", "A", config.antiSpeed.maxVL, config.antiSpeed.punishment, ["velocityXZ" + ":" + velocityDifferent.toFixed(2)]);
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
    data.blockMovementLoop.push(xz);
    const { x: x1, z: z1 } = player.location;
    const { x: x2, z: z2 } = data.lastLocation;
    const moveDistance = Math.hypot(x1 - x2, z1 - z2);
    const state = moveDistance == 0 ? -1 :moveDistance > config.antiSpeed.absThreshould ? 1 : 0;
    data.blockMovementLoop.push(state);
    // Motion with statistics?
    if (data.blockMovementLoop.length > 40) {
        data.blockMovementLoop.shift();
        const truePositives = data.blockMovementLoop.filter((x) => x == 1).length;
        const falsePositives = data.blockMovementLoop.filter((x) => x == -1).length;
        const trueNegatives = data.blockMovementLoop.filter((x) => x == 0).length;
        player.onScreenDisplay.setActionBar(`++${truePositives} | -+${falsePositives} | +-${trueNegatives}`);
        // No awa
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
