//@ts-nocheck
import { world, system, GameMode } from "@minecraft/server";
import { flag, isAdmin, getSpeedIncrease1, getSpeedIncrease2, c, getPing } from "../../Assets/Util.js";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang.js";
const speedData = new Map();
const lastSpeedLog = new Map(); 
const lastAttack = new Map();
const lastVelocity = new Map(); 
const lastLastLoggedV = new Map(); 
const safeZone = new Map(); 
const lastFlag = new Map();
let iSL = {}; 
let maxDBVD = {}; 
let xzLog = {};
let disLog = {};
let speedLog = {};
let speedMaxV = {};
let timerLog = {};
/**
 * @author Rami
 * @description The best antiSpeed check for mcpe, based on detect unnatural velocitys or unnatural moved distance with low velocity 
*/
const locationData = new Map();
world.afterEvents.entityHurt.subscribe((event) => {
	//for skip any error msgs we use try  and catch
    try {
	//define attacker and target 
    const attacker = event.damageSource.damagingEntity
    const hurtEntity = event.hurtEntity
    //check if the attacker is a player then save the time
    if(attacker.typeId == "minecraft:player") lastAttack.set(attacker.id, Date.now()) 
    } 
    catch {} 
}) 
async function AntiSpeedA2(player, now) {
	//loading data
     const data = locationData.get(player.id);
   //skip the code for some reasons
     if (isAdmin(player) || player.isGliding || player.hasTag("matrix:riding"))
        return;
    //define some cool things
     const config = c();
     const { x: x1, z: z1 } = player.location;
     const { x: x2, z: z2 } = data.location;
     const { x, z } = player.getVelocity();
     const xz = Math.hypot(x, z)
       //dBVD == difference between velocity and moved distance 
     const dBVD = Math.abs(xzLog[player.id] - disLog[player.id]) 
       //setting max value of dBVD 
       //iSL = is spike lagging 
     if(iSL[player.id]) maxDBVD[player.id] = 2
     else maxDBVD[player.id] = 1
       //check if dBVD lower than 1 and higher than 0.5 add one to timerLog and when timerLog reach 3 flag (check for low timer) 
     if(dBVD < maxDBVD[player.id] && dBVD > 0.5) timerLog[player.id]++
     else { timerLog[player.id] = 0 }
     //flag time if dBVD is greater than 1 blocks or timerLog reach 3 (low timer will flag in 3 secs probably but maybe i will downgrade the max from 1 to 1 after make sure no falses ) 
     if(dBVD > maxDBVD[player.id] || timerLog[player.id] >= 3){
     //dBLFN = difference between last flag time and now
     const dBLFN = Date.now() - lastFlag.get(player.id)
     //if the dBLFN is lower than the given value flag
     if(!iSL[player.id] && (dBLFN < 5000 && timerLog[player.id] >= 3 || dBLFN < 1100 &&  dBVD > maxDBVD[player.id])) flag(player, 'Speed', 'A', config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">BlockPerSecond") + ":" +(disLog[player.id].toFixed(2)*2)]);
     //lag back the player 
     player.teleport(safeZone.get(player.id));
     //setting new lastFlag 
     lastFlag.set(player.id, Date.now()) 
     } 
     //saving new location if the player didnt got flagged 
     if(dBVD < 0.5) safeZone.set(player.id, player.location) 
     //reseting logs to 0
     xzLog[player.id] = 0
     disLog[player.id] = 0
     iSL[player.id] = false 
} 
async function AntiSpeedA(player, now) {
	//getting data
    const data = locationData.get(player.id);   
    //skip the code for for some reasons
  if ( isAdmin(player) || player.isGliding || player.hasTag("matrix:riding"))
        return;
    locationData.set(player.id, { location: player.location, recordTime: Date.now() });
    //just defineing everything we need
    const config = c();
    const { x: x1, z: z1 } = player.location;
    const { x: x2, z: z2 } = data.location;
    const { x, z } = player.getVelocity();
    const xz = Math.hypot(x, z)
    const dBVD = Math.abs(xz-Math.hypot(x1 - x2, z1 - z2)) 
    //define everything if everything is undefined 
    if(timerLog[player.id] == undefined || timerLog[player.id] == NaN){
        xzLog[player.id] = 0
    	timerLog[player.id] = 0
        disLog[player.id] = 0
        maxDBVD[player.id] = 0
        iSL[player.id] = null
        safeZone.set(player.id, player.location) 
        lastFlag.set(player.id, Date.now()) 
    } 
    //just logging every velocity or moved distance in 20 ticks
        xzLog[player.id] = xzLog[player.id]+xz
        disLog[player.id]= disLog[player.id]+Math.hypot(x1 - x2, z1 - z2)
    //reset velocity xz log and distance log if player used /tp
    if(xz == 0 && Math.hypot(x1 - x2, z1 - z2) > 0.5){
        xzLog[player.id] = 0
        disLog[player.id] = 0
    } 
    //check if the player is spike lagging 
    if(dBVD > 0.5) iSL[player.id]++ 
    if(dBVD < 0.5 && iSL[player.id] <= 4 && iSL[player.id] > 0) iSL[player.id] = true
}
async function AntiSpeedB(){
	//getting players
	const players = world.getAllPlayers();
	//looping to every player in the server
    for (const player of players) {
    //define cool things
    const { x, z } = player.getVelocity();
    const xz = Math.hypot(x, z) 
    const safePos = speedData.get(player.id)
    //skip the code for some reasons
    if (isAdmin(player) || player.isFlying || player.isGliding || player.hasTag("matrix:riding"))
            continue;
    const config = c();
    //start complex things
    //changing value when needed to avoid false postives
    if(Date.now() - lastAttack.get(player.id) < 1000) speedMaxV[player.id] = 3
	if(player.hasTag("matrix:using_item")) speedMaxV[player.id] = 0.7
    if(!player.hasTag("matrix:using_item") && Date.now() - lastAttack.get(player.id) > 1000) speedMaxV[player.id] = 0.5
    //checking if values are undefined then define them
	if(speedLog[player.id] == undefined || 
        lastSpeedLog.get(player.id) == undefined){
        speedLog[player.id] = 0
        player.lastXZLogged = xz
        speedData.set(player.id, player.location) 
        lastSpeedLog.set(player.id,Date.now()) 
        lastAttack.set(player.id,Date.now()) 
    } 
    //checking if the player didnt got flagged then save location 
    if(xz - player.lastXZLogged < speedMaxV[player.id] && Date.now() - lastSpeedLog.get(player.id) > 900 && player.lastXZLogged - xz < speedMaxV[player.id]) {
        speedData.set(player.id, player.location);
    }
    if(Date.now() - lastSpeedLog.get(player.id) > 5000 && xz - player.lastXZLogged < speedMaxV[player.id] || Date.now() - lastSpeedLog.get(player.id) < 500 && xz - player.lastXZLogged > speedMaxV[player.id] || player.lastXZLogged - xz > speedMaxV[player.id] && Math.abs(xz - lastLastLoggedV.get(player.id)) > 0.05){
        speedLog[player.id] = 0
    }
    //check if the player flagged for if the difference between now and last velocity more than the maxvalue in one tick 
    //dBLNV = difference between last and now velocity 
    if(xz - player.lastXZLogged > speedMaxV[player.id]  && !(player.lastXZLogged.toFixed(2) > 0 && player.lastXZLogged.toFixed(2) < 0.05)){
    	speedLog[player.id]++
        lastSpeedLog.set(player.id,Date.now()) 
        lastLastLoggedV.set(player.id, player.lastXZLogged) 
    } 
    const lagBack = (player.lastXZLogged - xz > speedLog[player.id]+2 && speedLog[player.id] >= 1 || player.lastXZLogged - xz > speedLog[player.id]+1  && speedLog[player.id] >= 2)
    //if the player dBLNV bigger than max value + 1.5 lag back for escape bypasses
    if(lagBack && player.threwTridentAt == undefined || lagBack && Date.now() - player.threwTridentAt > 2200 || player.lastXZLogged - xz > 25 && speedLog[player.id] >= 1) player.teleport(safePos);
    //check if speedLog reached the max which is 3 flag
    if(speedLog[player.id] >= 3 && player.lastXZLogged - xz > speedMaxV[player.id]){
        flag(player, 'Speed', 'B', config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">velocityXZ") + ":" +(xz - player.lastXZLogged).toFixed(2)]);
        player.teleport(safePos)
        speedLog[player.id] = 0
    } 
    //saving last high velocity 
    if(xz - player.lastXZLogged > speedMaxV[player.id]) lastVelocity.set(player.id, xz-player.lastXZLogged) 
    //finally saving last xz velocity 
        player.lastXZLogged = xz;
    }
} 
const antiSpeedA = () => {
    const now = Date.now();
    const players = world.getPlayers();
    for (const player of players) {
        if (isAdmin(player))
            continue;
        AntiSpeedA(player, now);
    }
};
const antiSpeedA2 = () => {
    const now = Date.now();
    const players = world.getPlayers();
    for (const player of players) {
        if (isAdmin(player))
            continue;
        AntiSpeedA2(player, now);
    }
};
const antiSpeedB = () => {
    const now = Date.now();
    const players = world.getPlayers();
    for (const player of players) {
        if (isAdmin(player))
            continue;
        AntiSpeedB(player, now);
    }
};
const playerLeave = (({ playerId }) => {
    speedData.delete(playerId);
    locationData.delete(playerId);
    speedLog[player.id] = undefined 
    player.lastXZLogged = undefined 
    speedData.delete(player.id) 
    lastSpeedLog.delete(player.id) 
    lastAttack.delete(player.id) 
    xzLog[player.id] = undefined 
    timerLog[player.id] = undefined 
    iSL[player.id] = undefined 
    maxDBVD[player.id] = undefined 
    disLog[player.id] = undefined 
    safeZone.delete(player.id) 
    lastFlag.delete(player.id) 
});
let id;
export default {
    enable() {
        id = {
            c: system.runInterval(antiSpeedA2, 20),
            a: system.runInterval(antiSpeedA, 1),
            b: system.runInterval(antiSpeedB, 1),
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
    }
};
