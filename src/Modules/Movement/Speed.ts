import { world, system, PlayerLeaveAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";

const speedData: Map<string, any> = new Map();
const lastSpeedLog: Map<string, any> = new Map();
const lastAttack: Map<string, any> = new Map();
const lastVelocity: Map<string, any> = new Map();
const lastLastLoggedV: Map<string, any> = new Map();
const lastReset: Map<string, any> = new Map();
let speedLog: any = {};
let speedMaxV: any = {};
/**
 * @author RamiGamerDev
 * @description A strong anti speed for Minecraft Bedrock Edition, this check can detect the player with client movement.
 */
const locationData: Map<string, any> = new Map();

world.afterEvents.entityHurt.subscribe((event: any) => {
    //for skip any error msgs we use try  and catch
    try {
        //define attacker and target
        const attacker = event.damageSource.damagingEntity;
        //check if the attacker is a player then save the time
        if (attacker.typeId == "minecraft:player") lastAttack.set(attacker.id, Date.now());
    } catch {}
});

async function AntiSpeed() {
    //getting players
    const players = world.getAllPlayers();
    const now = Date.now();
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
        if (now - lastAttack.get(player.id) < 1000) speedMaxV[player.id] = 3;
        if (player.hasTag("matrix:using_item")) speedMaxV[player.id] = 0.7;
        if (!player.hasTag("matrix:using_item") && now - lastAttack.get(player.id) > 1000 && !solidBlock) speedMaxV[player.id] = 0.5;
        //checking if values are undefined then define them
        if (speedLog[player.id] == undefined || lastSpeedLog.get(player.id) == undefined) {
            speedLog[player.id] = 0;
            player.lastXZLogged = xz;
            lastReset.set(player.id, now);
            speedData.set(player.id, player.location);
            lastSpeedLog.set(player.id, now);
            lastAttack.set(player.id, now);
        }
        //checking if the player didnt got flagged then save location
        if (xz - player.lastXZLogged < speedMaxV[player.id] && now - lastSpeedLog.get(player.id) > 900 && player.lastXZLogged - xz < speedMaxV[player.id]) {
            speedData.set(player.id, player.location);
        }
        //check for so many things that help to prevent false postives
        if (
            (now - lastSpeedLog.get(player.id) > 3000 && xz - player.lastXZLogged < speedMaxV[player.id]) ||
            (now - lastSpeedLog.get(player.id) < 475 && xz - player.lastXZLogged > speedMaxV[player.id]) ||
            (player.lastXZLogged - xz > speedMaxV[player.id] && Math.abs(xz - lastLastLoggedV.get(player.id)) > 0.3) ||
            (now - lastReset.get(player.id) <= 500 && xz - player.lastXZLogged <= lastVelocity.get(player.id) + 3) ||
            (now - lastReset.get(player.id) <= 275 && xz - player.lastXZLogged >= lastVelocity.get(player.id) + 3) ||
            now - player.threwTridentAt <= 1500
        ) {
            speedLog[player.id] = 0;
            if (player.lastXZLogged - xz > speedMaxV[player.id] && Math.abs(xz - lastLastLoggedV.get(player.id)) > 0.3) lastReset.set(player.id, now);
        }
        //check if the player flagged for if the difference between now and last velocity more than the maxvalue in one tick
        //dBLNV = difference between last and now velocity
        if (
            xz - player.lastXZLogged > speedMaxV[player.id] &&
            ((now - lastReset.get(player.id) >= 500 && xz - player.lastXZLogged <= speedMaxV[player.id] + 6) || (now - lastReset.get(player.id) >= 275 && xz - player.lastXZLogged >= speedMaxV[player.id] + 6))
        ) {
            speedLog[player.id]++;
            lastSpeedLog.set(player.id, now);
        }
        //lagBack = tp the player back without taking any action or alerting admin
        const lagBack = ((player.lastXZLogged - xz > speedMaxV[player.id] + 1 || (solidBlock && player.lastXZLogged - xz > speedMaxV[player.id] + 0.1)) && speedLog[player.id] >= 1) || player.lastXZLogged - x >= 25;
        //if the player dBLNV bigger than max value + 1 lag back for escape bypasses
        if (lagBack) player.teleport(safePos);
        //check if speedLog reached the max which is 3 flag
        if (speedLog[player.id] >= config.antiSpeed.minSpeedLog && player.lastXZLogged - xz > speedMaxV[player.id] && player.lastXZLogged - xz - lastVelocity.get(player.id) <= 0.3) {
            flag(player, "Speed", "A", config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">velocityXZ") + ":" + (player.lastXZLogged - xz).toFixed(2)]);
            player.teleport(safePos);
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
        system.runInterval(AntiSpeed, 1);
        world.afterEvents.playerLeave.subscribe(playerLeave);
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
    },
};
