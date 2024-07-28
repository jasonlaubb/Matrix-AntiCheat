import { EntityDamageCause, EntityHurtAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { flag } from "../../Assets/Util.js";
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
    lastSpeedLog: number;
    lastAttack: number;
    lastVelocity: number;
    lastLastLoggedV: number;
    lastReset: number;
    speedLog: number;
    speedMaxV: number;
    locationData: Vector3;
    flagNumber: number;
    firstTrigger: number;
    currentFlagCombo: number;
}
const speeddata = new Map<string, Speeddata>();

async function AntiSpeed(config: configi, player: Player) {
    const now = Date.now();
    const data = speeddata.get(player.id) ?? ({} as Speeddata);
    // define cool things
    const { x, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    const solidBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.isSolid;
    const safePos = data.speedData;
    // skip the code for some reasons
    if (player.isFlying || player.isGliding || player.hasTag(AnimationControllerTags.riding)) return;
    // start complex things
    // changing value when needed to avoid false postives
    if (solidBlock) data.speedMaxV = 1.3;
    if (now - data.lastAttack < 1000) data.speedMaxV = 3;
    if (now - data.lastAttack > 1000 && !solidBlock) data.speedMaxV = 0.7;
    // checking if values are undefined then define them
    if (data.speedLog == undefined || data.lastSpeedLog == undefined) {
        data.speedLog = 0;
        player.lastXZLogged = xz;
        data.lastReset = now;
        data.speedData = player.location;
        data.lastSpeedLog = now;
        data.lastAttack = now;
        data.flagNumber = 0;
        data.currentFlagCombo = 0;
    }
    // checking if the player didnt got flagged then save location
    if (xz - player.lastXZLogged < data.speedMaxV && now - data.lastSpeedLog > 900 && player.lastXZLogged - xz < data.speedMaxV) {
        data.speedData = player.location;
    }
    // check for so many things that help to prevent false postives
    if (
        (now - data.lastSpeedLog > 6000 && xz - player.lastXZLogged < data.speedMaxV) ||
        (now - data.lastSpeedLog < 300 && xz - player.lastXZLogged > data.speedMaxV) ||
        (xz - player.lastXZLogged < data.speedMaxV && Math.abs(xz - data.lastLastLoggedV) > 0.4) ||
        now - data.lastReset <= 350
    ) {
        data.speedLog = 0;
        if (Math.abs(xz - data.lastLastLoggedV) > 0.4) data.lastReset = now;
    }
    // check if the player flagged for if the difference between now and last velocity more than the maxvalue in one tick
    // velocityDifferent = difference between last and now velocity
    const velocityDifferent = xz - player.lastXZLogged;
    if (velocityDifferent > data.speedMaxV && now - data.lastReset >= 100) {
        data.speedLog++;
        data.lastSpeedLog = now;
    }
    // check if speedLog reached the max which is 3 flag
    if (!player.hasTag(AnimationControllerTags.riding) && !player.getComponent("riding")?.entityRidingOn && data.speedLog == 1 && velocityDifferent > data.speedMaxV && velocityDifferent - data.lastVelocity < 0.3 && !isSpikeLagging(player)) {
        data.firstTrigger ??= now;
        data.currentFlagCombo ??= config.antiSpeed.validFlagDuration - config.antiSpeed.flagDurationIncrase;
        data.flagNumber ??= 0;
        data.flagNumber++;
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
        data.speedLog = 0;
    }
    // saving last high velocity
    if (velocityDifferent > data.speedMaxV) data.lastVelocity = velocityDifferent;
    // saving last normal velocity before beeing flagged
    if (velocityDifferent < data.speedMaxV) data.lastLastLoggedV = player.lastXZLogged;
    // finally saving last xz velocity
    player.lastXZLogged = xz;
    speeddata.set(player.id, data);
}
function entityHurt({ damageSource: { cause }, hurtEntity }: EntityHurtAfterEvent) {
    if (cause == EntityDamageCause.entityAttack || cause == EntityDamageCause.blockExplosion) {
        const data = speeddata.get(hurtEntity.id);
        if (data) data.lastAttack = Date.now();
        speeddata.set(hurtEntity.id, data);
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
