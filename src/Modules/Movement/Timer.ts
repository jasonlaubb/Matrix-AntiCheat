import { world, system, Player } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util.js";
import { tps } from "../../Assets/Public.js";
import { lastReset } from "./Speed.js"
import lang from "../../Data/Languages/lang.js";

const safeZone: Map<string, any> = new Map();
const lastFlag: Map<string, any> = new Map();
const locationData: Map<string, any> = new Map();
let iSL: any = {};
let maxDBVD: any = {};
let xzLog: any = {};
let disLog: any = {};
let timerLog: any = {};
let yLog: any = {};
let yDisLog: any = {};

/**
 * @author RamiGamerDev
 * @description Checks if the player moved without the same between velocity and moved distance.
 */
export async function AntiTimer(player: Player, now: number) {
    //loading data
    //const data = locationData.get(player.id);
    //skip the code for some reasons
    if (player.isGliding || player.hasTag("matrix:riding")) return;
    //define some cool things
    const config = c();
    //dBVD == difference between velocity and moved distance
    const dBVD = Math.abs(xzLog[player.id] - disLog[player.id]);
    const dBVD2 = yDisLog[player.id] - yLog[player.id];
    //setting max value of dBVD
    //iSL = is spike lagging
    maxDBVD[player.id] = 20/tps.getTps();
    //check if dBVD lower than 1 and higher than 0.5 add one to timerLog and when timerLog reach 3 flag (check for low timer)
    if ((dBVD < maxDBVD[player.id] && dBVD > 20/(tps.getTps()*2)) || (dBVD2 < maxDBVD[player.id] && dBVD2 > 20/(tps.getTps()*2))) timerLog[player.id]++;
    else timerLog[player.id] = 0;
    //flag time if dBVD is greater than 1 blocks or timerLog reach 3 (low timer will flag in 3 secs probably but maybe i will downgrade the max from 1 to 1 after make sure no falses)
    if (((dBVD > maxDBVD[player.id] || dBVD2 > maxDBVD[player.id]) && Date.now() - lastReset.get(player.id) >= 1025) || timerLog[player.id] >= config.antiTimer.minTimerLog) {
        //dBLFN = difference between last flag time and now
        const dBLFN = now - lastFlag.get(player.id);
        //if the dBLFN is lower than the given value flag
        if (!iSL[player.id] && ((dBLFN < 5000 && timerLog[player.id] >= 3) || (dBLFN < 2000 && dBVD > maxDBVD[player.id])))
            flag(player, "Timer", "A", config.antiTimer.maxVL, config.antiTimer.punishment, [lang(">BlockPerSecond") + ":" + disLog[player.id].toFixed(2) * 2]);
        //lag back the player
        if (!config.slient) player.teleport(safeZone.get(player.id));
        //setting new lastFlag
        lastFlag.set(player.id, Date.now());
    }
    //saving new location if the player didnt got flagged
    if (dBVD < 0.5) safeZone.set(player.id, player.location);
    //reseting logs to 0
    xzLog[player.id] = 0;
    yLog[player.id] = 0;
    disLog[player.id] = 0;
    yDisLog[player.id] = 0;
    iSL[player.id] = false;
}
/** @description For Anti Timer */
export async function SystemEvent(player: Player, now: number) {
    //getting data
    const data = locationData.get(player.id);
    //skip the code for for some reasons
    if (player.isGliding) return;
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
    if (y > 0) {
        yLog[player.id] = yLog[player.id] + Math.abs(y);
        yDisLog[player.id] = yDisLog[player.id] + Math.abs(y1 - y2);
    }
    disLog[player.id] = disLog[player.id] + Math.hypot(x1 - x2, z1 - z2);
    //reset velocity xz log and distance log if player used /tp or using high y velocity
    if (xz == 0 && Math.hypot(x1 - x2, z1 - z2) > 0.5 || player.hasTag("matrix:riding")) {
        xzLog[player.id] = 0;
        disLog[player.id] = 0;
    }
    //reset anti y timer if player used /tp or using high velocity
    if ((y == 0 && Math.abs(y1 - y2) > 0.1) || y > 0.5 || player.hasTag("matrix:riding")) yDisLog[player.id] = 0;
    //check if the player is spike lagging
    if (dBVD > 0.5) iSL[player.id]++;
    if (dBVD < 0.5 && iSL[player.id] <= 4 && iSL[player.id] > 0) iSL[player.id] = true;
}

const playerLeave = ({ playerId }: any) => {
    locationData.delete(playerId);
    lastFlag.delete(playerId);
    delete iSL[playerId];
    delete maxDBVD[playerId];
    delete xzLog[playerId];
    delete disLog[playerId];
    delete timerLog[playerId];
    delete yLog[playerId];
    delete yDisLog[playerId];
};

const antiTimer = () => {
    const now = Date.now();
    const players = world.getPlayers();
    for (const player of players) {
        if (isAdmin(player)) continue;
        AntiTimer(player, now);
    }
};

const systemEvent = () => {
    const now = Date.now();
    const players = world.getPlayers();
    for (const player of players) {
        if (isAdmin(player)) continue;
        SystemEvent(player, now);
    }
};

let id: number;
let id2: number;
export default {
    enable() {
        id = system.runInterval(antiTimer, 20);
        id2 = system.runInterval(systemEvent, 1);
        world.afterEvents.playerLeave.subscribe(playerLeave);
    },
    disable() {
        locationData.clear();
        lastFlag.clear();
        iSL = {};
        maxDBVD = {};
        xzLog = {};
        disLog = {};
        timerLog = {};
        yLog = {};
        yDisLog = {};
        system.clearRun(id);
        system.clearRun(id2);
        world.afterEvents.playerLeave.unsubscribe(playerLeave);
    },
};
