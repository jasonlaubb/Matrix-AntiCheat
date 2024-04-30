import { world, system } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";

const speedData: Map<string, any> = new Map();
const lastSpeedLog: Map<string, any> = new Map();
const lastAttack: Map<string, any> = new Map();
const lastVelocity: Map<string, any> = new Map();
const lastLastLoggedV: Map<string, any> = new Map();
const safeZone: Map<string, any> = new Map();
const lastFlag: Map<string, any> = new Map();
let iSL: any = {};
let maxDBVD: any = {};
let xzLog: any = {};
let disLog: any = {};
let speedLog: any = {};
let speedMaxV: any = {};
let timerLog: any = {};
let yLog: any = {};
let yDisLog: any = {};
/**
 * @author Rami
 * @description The best antiSpeed check for mcpe, based on detect unnatural velocitys or unnatural moved distance with low velocity
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

async function AntiSpeedA2(player: any, now: number) {
    //loading data
    //const data = locationData.get(player.id);
    //skip the code for some reasons
    if (isAdmin(player) || player.isGliding || player.hasTag("matrix:riding"))
        return;
    //define some cool things
    const config = c();
    //dBVD == difference between velocity and moved distance
    const dBVD = Math.abs(xzLog[player.id] - disLog[player.id])
    const dBVD2 = yDisLog[player.id] - yLog[player.id];
    //setting max value of dBVD
    //iSL = is spike lagging
    maxDBVD[player.id] = 1
    //check if dBVD lower than 1 and higher than 0.5 add one to timerLog and when timerLog reach 3 flag (check for low timer)
    if (dBVD < maxDBVD[player.id] && dBVD > 0.5 || dBVD2 < maxDBVD[player.id] && dBVD2 > 0.5)
        timerLog[player.id]++;
    else timerLog[player.id] = 0;
    //flag time if dBVD is greater than 1 blocks or timerLog reach 3 (low timer will flag in 3 secs probably but maybe i will downgrade the max from 1 to 1 after make sure no falses)
    if (dBVD > maxDBVD[player.id] || dBVD2 > maxDBVD[player.id] || timerLog[player.id] >= 3) {
        //dBLFN = difference between last flag time and now
        const dBLFN = now - lastFlag.get(player.id);
        //if the dBLFN is lower than the given value flag
        if (!iSL[player.id] && ((dBLFN < 5000 && timerLog[player.id] >= 3) || (dBLFN < 2000 && dBVD > maxDBVD[player.id])))
           flag(player, "Speed", "A", config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">BlockPerSecond") + ":" + disLog[player.id].toFixed(2) * 2]);
        //lag back the player
        player.teleport(safeZone.get(player.id));
        //setting new lastFlag
        lastFlag.set(player.id, Date.now());
    }
    //saving new location if the player didnt got flagged
    if (dBVD < 0.5)
        safeZone.set(player.id, player.location);
    //reseting logs to 0
    xzLog[player.id] = 0;
    yLog[player.id] = 0;
    disLog[player.id] = 0;
    yDisLog[player.id] = 0;
    iSL[player.id] = false;
}
async function AntiSpeedA(player: any, now: number) {
    //getting data
    const data = locationData.get(player.id);
    //skip the code for for some reasons
    if (isAdmin(player) || player.isGliding || player.hasTag("matrix:riding"))
        return;
    locationData.set(player.id, { location: player.location, recordTime: now });
    //just defineing everything we need
    const { x: x1, y: y1, z: z1 } = player.location;
    const { x: x2, y: y2, z: z2 } = data.location;
    const { x, y, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    const dBVD = Math.abs(xz - Math.hypot(x1 - x2, z1 - z2));
    //define everything if everything is undefined
    if (timerLog[player.id] == undefined || Number.isNaN(timerLog[player.id])) {
        xzLog[player.id] = 0;
        timerLog[player.id] = 0;
        disLog[player.id] = 0;
        maxDBVD[player.id] = 0;
        yLog[player.id] = 0;
        yDisLog[player.id] = 0;
        iSL[player.id] = null;
        safeZone.set(player.id, player.location);
        lastFlag.set(player.id, Date.now());
    }
    //just logging every velocity or moved distance in 20 ticks
    xzLog[player.id] = xzLog[player.id] + xz;
    yLog[player.id] = yLog[player.id] + Math.abs(y);
    yDisLog[player.id] = yDisLog[player.id] + Math.abs(y1 - y2);
    disLog[player.id] = disLog[player.id] + Math.hypot(x1 - x2, z1 - z2);
    //reset velocity xz log and distance log if player used /tp or using high y velocity 
    if (xz == 0 && Math.hypot(x1 - x2, z1 - z2) > 0.5 || y > 0.5) {
        xzLog[player.id] = 0;
        disLog[player.id] = 0;
    } 
    //reset anti y timer if player used /tp or using high velocity 
    if(y == 0 && Math.abs(y1 - y2) > 0.1 || y > 0.5) yDisLog[player.id] = 0;
    //check if the player is spike lagging
    if (dBVD > 0.5)
        iSL[player.id]++;
    if (dBVD < 0.5 && iSL[player.id] <= 4 && iSL[player.id] > 0)
        iSL[player.id] = true;
}
async function AntiSpeedB() {
    //getting players
    const players = world.getAllPlayers();
    //looping to every player in the server
    for (const player of players) {
        //define cool things
        const { x, z } = player.getVelocity();
        const xz = Math.hypot(x, z);
        const solidBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.isSolid
        const safePos = speedData.get(player.id);
        //skip the code for some reasons
        if (isAdmin(player) || player.isFlying || player.isGliding || player.hasTag("matrix:riding"))
            continue;
        const config = c();
        //start complex things
        //changing value when needed to avoid false postives
        if(solidBlock) speedMaxV[player.id] = 1.3
        if (Date.now() - lastAttack.get(player.id) < 1000)
            speedMaxV[player.id] = 3;
        if (player.hasTag("matrix:using_item"))
            speedMaxV[player.id] = 0.7;
        if (!player.hasTag("matrix:using_item") && Date.now() - lastAttack.get(player.id) > 1000 && !solidBlock)
            speedMaxV[player.id] = 0.5;
        //checking if values are undefined then define them
        if (speedLog[player.id] == undefined || lastSpeedLog.get(player.id) == undefined) {
            speedLog[player.id] = 0;
            player.lastXZLogged = xz;
            lastReset.set(player.id, Date.now()) 
            speedData.set(player.id, player.location);
            lastSpeedLog.set(player.id, Date.now());
            lastAttack.set(player.id, Date.now());
        }
        //checking if the player didnt got flagged then save location
        if (xz - player.lastXZLogged < speedMaxV[player.id] && Date.now() - lastSpeedLog.get(player.id) > 900 && player.lastXZLogged - xz < speedMaxV[player.id]) {
            speedData.set(player.id, player.location);
        }
        //check for so many things that help to prevent false postives
        if ((Date.now() - lastSpeedLog.get(player.id) > 3000 && xz - player.lastXZLogged < speedMaxV[player.id]) || (Date.now() - lastSpeedLog.get(player.id) < 475 && xz - player.lastXZLogged > speedMaxV[player.id]) || (player.lastXZLogged - xz > speedMaxV[player.id] && Math.abs(xz - lastLastLoggedV.get(player.id)) > 0.3) || (Date.now() - lastReset.get(player.id) <= 500 && xz - player.lastXZLogged <= lastVelocity.get(player.id)+3 || Date.now() - lastReset.get(player.id) <= 275 && xz - player.lastXZLogged >= lastVelocity.get(player.id)+3) || Date.now() - player.threwTridentAt <= 1500) {
            speedLog[player.id] = 0;
            if((player.lastXZLogged - xz > speedMaxV[player.id] && Math.abs(xz - lastLastLoggedV.get(player.id)) > 0.3)) lastReset.set(player.id, Date.now())
        }
        //check if the player flagged for if the difference between now and last velocity more than the maxvalue in one tick
        //dBLNV = difference between last and now velocity
        if ( xz - player.lastXZLogged > speedMaxV[player.id] &&  (Date.now() - lastReset.get(player.id) >= 500 && xz - player.lastXZLogged <= speedMaxV[player.id]+6 || Date.now() - lastReset.get(player.id) >= 275 && xz - player.lastXZLogged >= speedMaxV[player.id]+6)) {
            speedLog[player.id]++;
            lastSpeedLog.set(player.id, Date.now());
        }
        //lagBack = tp the player back without taking any action or alerting admin
        const lagBack = ((player.lastXZLogged - xz > speedMaxV[player.id] + 1 || solidBlock && player.lastXZLogged - xz > speedMaxV[player.id] + 0.1)  && speedLog[player.id] >= 1 || player.lastXZLogged - x >= 25 )
        //if the player dBLNV bigger than max value + 1 lag back for escape bypasses
        if (lagBack) player.teleport(safePos);
        //check if speedLog reached the max which is 3 flag
        if (speedLog[player.id] >= 3 && player.lastXZLogged - xz > speedMaxV[player.id] && player.lastXZLogged - xz - lastVelocity.get(player.id) <= 0.3) {
            flag(player, "Speed", "B", config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">velocityXZ") + ":" + ( player.lastXZLogged-xz).toFixed(2)]);
            player.teleport(safePos);
            speedLog[player.id] = 0;
        }
        //saving last high velocity
        if (xz - player.lastXZLogged > speedMaxV[player.id])
            lastVelocity.set(player.id, xz - player.lastXZLogged);
        //saving last normal velocity before beeing flagged 
        if(player.lastXZLogged - xz < speedMaxV[player.id])
            lastLastLoggedV.set(player.id, player.lastXZLogged);
        //finally saving last xz velocity
        player.lastXZLogged = xz;
    }
}
const antiSpeedA = () => {
    const now = Date.now();
    const players = world.getPlayers();
    for (const player of players) {
        if (isAdmin(player)) continue;
        AntiSpeedA(player, now);
    }
};

const antiSpeedA2 = () => {
    const now = Date.now();
    const players = world.getPlayers();
    for (const player of players) {
        if (isAdmin(player)) continue;
        AntiSpeedA2(player, now);
    }
};

/* Hey rami, why this thing here with no use
const antiSpeedB = () => {
    const now = Date.now();
    const players = world.getPlayers();
    for (const player of players) {
        if (isAdmin(player)) continue;
        AntiSpeedB(player, now);
    }
};*/

const playerLeave = ({ playerId }: any) => {
    speedData.delete(playerId);
    locationData.delete(playerId);
    lastVelocity.delete(playerId);
    lastLastLoggedV.delete(playerId);
    lastAttack.delete(playerId);
    lastSpeedLog.delete(playerId);
    lastFlag.delete(playerId);
    delete speedLog[playerId];
    delete iSL[playerId];
    delete maxDBVD[playerId];
    delete xzLog[playerId];
    delete disLog[playerId];
    delete speedLog[playerId];
    delete speedMaxV[playerId];
    delete timerLog[playerId];
    delete yLog[playerId];
    delete yDisLog[playerId];
};

let id: any;

export default {
    enable() {
        id = {
            c: system.runInterval(antiSpeedA2, 20),
            a: system.runInterval(antiSpeedA, 1),
            b: system.runInterval(AntiSpeedB, 1),
        };
        world.afterEvents.playerLeave.subscribe(playerLeave);
    },
    disable() {
        speedData.clear();
        locationData.clear();
        system.clearRun(id.a);
        system.clearRun(id.c);
        system.clearRun(id.b);
        world.afterEvents.playerLeave.unsubscribe(playerLeave);
    },
};
