import { world, system, PlayerLeaveAfterEvent, EntityDamageCause, EntityHurtAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util.js";
const speedData: Map<string, any> = new Map();
const lastSpeedLog: Map<string, any> = new Map();
const lastAttack: Map<string, any> = new Map();
const lastVelocity: Map<string, any> = new Map();
const lastLastLoggedV: Map<string, any> = new Map();
export const lastReset: Map<string, any> = new Map();
let speedLog: any = {};
let speedMaxV: any = {};
/**
 * @author RamiGamerDev
 * @description A strong anti speed for Minecraft Bedrock Edition, this check can detect the player with client movement.
 */
const locationData: Map<string, any> = new Map();

function entityHurt ({ damageSource: { cause }, hurtEntity }: EntityHurtAfterEvent) {
    if (cause == EntityDamageCause.entityAttack || cause == EntityDamageCause.blockExplosion) {
        lastAttack.set(hurtEntity.id, Date.now());
    }
};

async function AntiSpeed() {
    //getting players
    const players = world.getAllPlayers();
    //looping to every player in the server
    for (const player of players) {
        //define cool things
        const { x, z } = player.getVelocity();
        const xz = Math.hypot(x, z);
        const solidBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.isSolid;
        const safePos = speedData.get(player.id);
        //skip the code for some reasons
        if (isAdmin(player) || player.isFlying || player.isGliding || player.hasTag("matrix:riding")) continue;
        const config = c();
        //start complex things
        //changing value when needed to avoid false postives
        if (solidBlock) speedMaxV[player.id] = 1.3;
        if (Date.now() - lastAttack.get(player.id) < 1000) speedMaxV[player.id] = 3;
        if (Date.now() - lastAttack.get(player.id) > 1000 && !solidBlock) speedMaxV[player.id] = 0.7;
        //checking if values are undefined then define them
        if (speedLog[player.id] == undefined || lastSpeedLog.get(player.id) == undefined) {
            speedLog[player.id] = 0;
            player.lastXZLogged = xz;
            lastReset.set(player.id, Date.now());
            speedData.set(player.id, player.location);
            lastSpeedLog.set(player.id, Date.now());
            lastAttack.set(player.id, Date.now());
        }
        //checking if the player didnt got flagged then save location
        if (xz - player.lastXZLogged < speedMaxV[player.id] && Date.now() - lastSpeedLog.get(player.id) > 900 && player.lastXZLogged - xz < speedMaxV[player.id]) {
            speedData.set(player.id, player.location);
        }
        //check for so many things that help to prevent false postives
        if (
            (Date.now() - lastSpeedLog.get(player.id) > 3000 && xz - player.lastXZLogged < speedMaxV[player.id]) ||
            (Date.now() - lastSpeedLog.get(player.id) < 475 && xz - player.lastXZLogged > speedMaxV[player.id]) ||
            (xz - player.lastXZLogged < speedMaxV[player.id] && Math.abs(xz - lastLastLoggedV.get(player.id)) > 0.4) ||
            Date.now() - lastReset.get(player.id) <= 350
        ) {
            speedLog[player.id] = 0;
            if (Math.abs(xz - lastLastLoggedV.get(player.id)) > 0.4) lastReset.set(player.id, Date.now());
        }
        //check if the player flagged for if the difference between now and last velocity more than the maxvalue in one tick
        //dBLNV = difference between last and now velocity
        if (xz - player.lastXZLogged > speedMaxV[player.id] && Date.now() - lastReset.get(player.id) >= 100) {
            speedLog[player.id]++;
            lastSpeedLog.set(player.id, Date.now());
        }
        //lagBack = tp the player back without taking any action or alerting admin
        const lagBack = (((player.lastXZLogged - xz > speedMaxV[player.id] + 0.8 || (solidBlock && player.lastXZLogged - xz > speedMaxV[player.id] + 0.1)) && speedLog[player.id] >= 1) || player.lastXZLogged - x >= 25) && !config.slient;
        //if the player dBLNV bigger than max value + 1 lag back for escape bypasses
        if (lagBack) player.teleport(safePos);
        //check if speedLog reached the max which is 3 flag
        if (!player.hasTag("matrix:riding") && !player.getComponent("riding")?.entityRidingOn && speedLog[player.id] >= 3 && player.lastXZLogged - xz > speedMaxV[player.id] && player.lastXZLogged - xz - lastVelocity.get(player.id) <= 0.3) {
            flag(player, "Speed", "B", config.antiSpeed.maxVL, config.antiSpeed.punishment, ["velocityXZ" + ":" + (player.lastXZLogged - xz).toFixed(2)]);
            if (!config.slient) player.teleport(safePos);
            speedLog[player.id] = 0;
        }
        //saving last high velocity
        if (xz - player.lastXZLogged > speedMaxV[player.id]) lastVelocity.set(player.id, xz - player.lastXZLogged);
        //saving last normal velocity before beeing flagged
        if (player.lastXZLogged - xz < speedMaxV[player.id]) lastLastLoggedV.set(player.id, player.lastXZLogged);
        //finally saving last xz velocity
        player.lastXZLogged = xz;
    }
}
const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    speedData.delete(playerId);
    locationData.delete(playerId);
    lastVelocity.delete(playerId);
    lastLastLoggedV.delete(playerId);
    lastAttack.delete(playerId);
    lastSpeedLog.delete(playerId);
    delete speedLog[playerId];
    delete speedMaxV[playerId];
};

let id: number;

export default {
    enable() {
        id = system.runInterval(AntiSpeed, 1);
        world.afterEvents.playerLeave.subscribe(playerLeave);
        world.afterEvents.entityHurt.subscribe(entityHurt, { entityTypes: ["minecraft:player"] });
    },
    disable() {
        speedData.clear();
        locationData.clear();
        lastVelocity.clear();
        lastLastLoggedV.clear();
        lastAttack.clear();
        lastSpeedLog.clear();
        speedLog = {};
        speedMaxV = {};
        system.clearRun(id);
        world.afterEvents.playerLeave.unsubscribe(playerLeave);
        world.afterEvents.entityHurt.unsubscribe(entityHurt);
    },
};
