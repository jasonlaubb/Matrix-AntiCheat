import { EntityDamageCause, EntityHurtAfterEvent, Player, world } from "@minecraft/server";
import { flag } from "../../Assets/Util.js";
import { registerModule, configi } from "../Modules.js";

/**
 * @author RamiGamerDev
 * @description A strong anti speed for Minecraft Bedrock Edition, this check can detect the player with client movement.
 */
interface Speeddata {
    speedData: any;
    lastSpeedLog: any;
    lastAttack: any;
    lastVelocity: any;
    lastLastLoggedV: any;
    lastReset: any;
    speedLog: any;
    speedMaxV: any;
    locationData: any;
}
const speeddata = new Map<string, Speeddata>();

async function AntiSpeed(config: configi, player: Player) {
    const data = speeddata.get(player.id) ?? ({} as Speeddata);
    //define cool things
    const { x, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    const solidBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.isSolid;
    const safePos = data.speedData;
    //skip the code for some reasons
    if (player.isFlying || player.isGliding || player.hasTag("matrix:riding")) return;
    //start complex things
    //changing value when needed to avoid false postives
    if (solidBlock) data.speedMaxV = 1.3;
    if (Date.now() - data.lastAttack < 1000) data.speedMaxV = 3;
    if (Date.now() - data.lastAttack > 1000 && !solidBlock) data.speedMaxV = 0.7;
    //checking if values are undefined then define them
    if (data.speedLog == undefined || data.lastSpeedLog == undefined) {
        data.speedLog = 0;
        player.lastXZLogged = xz;
        data.lastReset = Date.now();
        data.speedData = player.location;
        data.lastSpeedLog = Date.now();
        data.lastAttack = Date.now();
    }
    //checking if the player didnt got flagged then save location
    if (xz - player.lastXZLogged < data.speedMaxV && Date.now() - data.lastSpeedLog > 900 && player.lastXZLogged - xz < data.speedMaxV) {
        data.speedData = player.location;
    }
    //check for so many things that help to prevent false postives
    if (
        (Date.now() - data.lastSpeedLog > 3000 && xz - player.lastXZLogged < data.speedMaxV) ||
        (Date.now() - data.lastSpeedLog < 475 && xz - player.lastXZLogged > data.speedMaxV) ||
        (xz - player.lastXZLogged < data.speedMaxV && Math.abs(xz - data.lastLastLoggedV) > 0.4) ||
        Date.now() - data.lastReset <= 350
    ) {
        data.speedLog = 0;
        if (Math.abs(xz - data.lastLastLoggedV) > 0.4) data.lastReset = Date.now();
    }
    //check if the player flagged for if the difference between now and last velocity more than the maxvalue in one tick
    //dBLNV = difference between last and now velocity
    const dBLNV = xz - player.lastXZLogged;
    if (dBLNV > data.speedMaxV && Date.now() - data.lastReset >= 100) {
        data.speedLog++;
        data.lastSpeedLog = Date.now();
    }
    //lagBack = tp the player back without taking any action or alerting admin
    const lagBack = ((dBLNV > data.speedMaxV + 0.8 || (solidBlock && dBLNV > data.speedMaxV + 0.1)) && data.speedLog >= 1) || (dBLNV >= 25 && !config.slient);
    //if the player dBLNV bigger than max value + 1 lag back for escape bypasses
    if (lagBack) player.teleport(safePos);
    //check if speedLog reached the max which is 3 flag
    if (!player.hasTag("matrix:riding") && !player.getComponent("riding")?.entityRidingOn && data.speedLog >= 3 && dBLNV > data.speedMaxV && dBLNV - data.lastVelocity < 0.3) {
        flag(player, "Speed", "B", config.antiSpeed.maxVL, config.antiSpeed.punishment, ["velocityXZ" + ":" + dBLNV.toFixed(2)]);
        if (!config.slient) player.teleport(safePos);
        data.speedLog = 0;
    }
    //saving last high velocity
    if (dBLNV > data.speedMaxV) data.lastVelocity = dBLNV;
    //saving last normal velocity before beeing flagged
    if (dBLNV < data.speedMaxV) data.lastLastLoggedV = player.lastXZLogged;
    //finally saving last xz velocity
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
