//@ts-nocheck
import { world, system, GameMode } from "@minecraft/server";
import { flag, isAdmin, getSpeedIncrease1, getSpeedIncrease2, c, getPing } from "../../Assets/Util.js";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang.js";
const speedData = new Map();
const lastSpeedLog = new Map(); 
const lastAttack = new Map();
const lastHurt = new Map();
const lastVelocity = new Map(); 
const lastLastLoggedV = new Map(); 
const lastTimerLog = new Map(); 
const safeZone = new Map(); 
const lastFlag = new Map();
const lastFlag2 = new Map(); 
let speedLog = {};
let speedMaxV = {};
let timerLog = {};
let timerLog2 = {};
/**
 * @author Rami
 * @description The best antiSpeed check for mcpe, based on detect unnatural velocitys or unnatural moved distance with low velocity 
*/
const locationData = new Map();
world.afterEvents.entityHurt.subscribe((event) => {
	try{
    const attacker = event.damageSource.damagingEntity
    const hurtEntity = event.hurtEntity
    if(attacker.typeId == "minecraft:player"){
      lastAttack.set(attacker.id, Date.now()) 
      } if(hurtEntity.typeId == "minecraft:player") lastHurt.set(hurtEntity.id, Date.now()) 
    } catch {} 
      }) 
async function AntiSpeedA(player, now) {
    const data = locationData.get(player.id);
    locationData.set(player.id, { location: player.location, recordTime: Date.now() });
    if (data === undefined)
        return;
    const config = c();
    const safePos = speedData.get(player.id)
    const { x: x1, z: z1 } = player.location;
    const { x: x2, z: z2 } = data.location;
    const { x, z } = player.getVelocity();
    const xz = Math.hypot(x, z)
    const dBVD = Math.abs(xz - Math.hypot(x1 - x2, z1 - z2)) 
    if(timerLog[player.id] == undefined || timerLog[player.id] == NaN){
    	timerLog[player.id] = 0
        timerLog2[player.id] = 0
        safeZone.set(player.id, player.location) 
        lastTimerLog.set(player.id, timerLog[player.id]) 
        lastFlag.set(player.id, Date.now()) 
        lastFlag2.set(player.id, Date.now()) 
        } 
        
    if(xz != Math.hypot(x1 - x2, z1 - z2) && xz != 0 && Math.hypot(x1 - x2, z1 - z2) != 0 && Math.hypot(x1 - x2, z1 - z2) > xz  && dBVD > 0.2){
    timerLog[player.id] = timerLog[player.id]+1
    } if(lastTimerLog.get(player.id) == timerLog[player.id] && timerLog[player.id] >= 1 && dBVD > 0.20 && Date.now() - lastFlag.get(player.id) < 300){
      timerLog2[player.id] = timerLog2[player.id]+1
      } else if(Date.now() - lastFlag.get(player.id) > 300) { timerLog2[player.id] = 0 }
       if(timerLog2[player.id] >= 5 || timerLog[player.id] >= 5 && Date.now() - lastFlag.get(player.id) < 60 && getPing(player) < 5 && dBVD >= 0.1){
       if(Date.now() - lastFlag2.get(player.id) < 1500 && Date.now() - lastFlag2.get(player.id) > 300) flag(player, 'Speed', 'A', config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">velocityXZ") + ":" +(dBVD).toFixed(2)]);
       lastFlag2.set(player.id, Date.now()) 
       player.teleport(safeZone.get(player.id));
       timerLog[player.id]  = 0
       timerLog2[player.id] = 0
     }
    
    if(xz == Math.hypot(x1 - x2, z1 - z2) && timerLog[player.id] > 0){
    
    timerLog[player.id] = 0
    safeZone.set(player.id, player.location) 
     } 
    if(timerLog[player.id] >= 1) lastTimerLog.set(player.id, timerLog[player.id]) 
    if(xz != Math.hypot(x1 - x2, z1 - z2) && xz != 0 && Math.hypot(x1 - x2, z1 - z2) != 0 && Math.hypot(x1 - x2, z1 - z2) > xz  && dBVD > 0.1) lastFlag.set(player.id, Date.now()) 
}
async function AntiSpeedB(){
	const players = world.getAllPlayers();
    const now = Date.now();
    for (const player of players) {
        
        const { x, z } = player.getVelocity();
        const xz = Math.hypot(x, z) 
        if (player.isFlying || player.isGliding || player.isSleeping) {
            player.lastSpeedSkipCheck = now;
        }
        const safePos = speedData.get(player.id)
        if (isAdmin(player) || player.isFlying || player.isGliding || player.threwTridentAt && now - player.threwTridentAt < 2000 || player.hasTag("matrix:riding"))
            continue;
        const config = c();
    if(Date.now() - lastHurt.get(player.id) < 250) speedMaxV[player.id] = 12
    if(Date.now() - lastAttack.get(player.id) < 1000) speedMaxV[player.id] = 3
	    if (player.hasTag("matrix:using_item")) speedMaxV = 0.7
    if(Date.now() - lastAttack.get(player.id) > 1000 && Date.now() - lastHurt.get(player.id) > 250) speedMaxV[player.id] = 0.5
	if(speedLog[player.id] == undefined || 
        lastSpeedLog.get(player.id) == undefined){
        speedLog[player.id] = 0
        player.lastXZLogged = xz
        speedData.set(player.id, player.location) 
        lastSpeedLog.set(player.id,Date.now()) 
        lastAttack.set(player.id,Date.now()) 
        lastHurt.set(player.id, Date.now()) 
        } 
        

        if (xz - player.lastXZLogged < speedMaxV[player.id] && Date.now() - lastSpeedLog.get(player.id) > 900 && player.lastXZLogged - xz < speedMaxV[player.id]) {
            speedData.set(player.id, player.location);
        }
        if(Date.now() - lastSpeedLog.get(player.id) > 5000 && xz - player.lastXZLogged < speedMaxV[player.id] || Date.now() - lastSpeedLog.get(player.id) < 500 && xz - player.lastXZLogged> speedMaxV[player.id] || player.threwTridentAt && now - player.threwTridentAt < 2100 || Date.now() - lastHurt.get(player.id) < 250 && lastVelocity.get(player.id) < speedMaxV[player.id] && Date.now() - lastSpeedLog.get(player.id) < 150){
            speedLog[player.id] = 0
            
        }
        if(xz - player.lastXZLogged > speedMaxV[player.id]  && !(player.lastXZLogged.toFixed(2) > 0 && player.lastXZLogged.toFixed(2) < 0.05) ){
        	speedLog[player.id]++
            player.lastSpeedSkipCheck = now; 
            lastSpeedLog.set(player.id,Date.now()) 
            lastLastLoggedV.set(player.id, player.lastXZLogged) 
        } 
        if(player.lastXZLogged - xz > speedMaxV[player.id] && speedLog[player.id] >= 1) player.teleport(safePos);
        if((speedLog[player.id] >= 3 || speedLog[player.id] >= 1  && xz - player.lastXZLogged > speedMaxV[player.id]+4.5) && lastVelocity.get(player.id)-(xz - player.lastXZLogged) < 0.2 && Math.abs(player.lastXZLogged - lastLastLoggedV.get(player.id)) < 0.05 && getPing(player) < 5){
        flag(player, 'Speed', 'B', config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">velocityXZ") + ":" +(xz - player.lastXZLogged).toFixed(2)]);
        player.teleport(safePos)
        speedLog[player.id] = 0
        } 
        
        if(xz - player.lastXZLogged > speedMaxV[player.id]) lastVelocity.set(player.id, xz-player.lastXZLogged) 
        player.lastXZLogged = xz;
       }
       
      } 
const antiSpeedA = () => {
    const now = Date.now();
    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] });
    for (const player of players) {
        if (isAdmin(player))
            continue;
        AntiSpeedA(player, now);
    }
};
const antiSpeedB = () => {
    const now = Date.now();
    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] });
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
    lastSpeedLog[player.id] = undefined 
    timerLog[player.id] = undefined 
    timerMaxDis[player.id] = undefined 
    lastSpeedLog.delete(playerId) 
    lastVelocity.delete(playerId) 
    lastAttack.delete(playerId) 
});
let id;
export default {
    enable() {
        id = {
            a: system.runInterval(antiSpeedA, 1),
            b: system.runInterval(antiSpeedB, 1),
        };
        world.afterEvents.playerLeave.subscribe(playerLeave);
    },
    disable() {
        speedData.clear();
        locationData.clear();
        system.clearRun(id.a);
        system.clearRun(id.b);
        world.afterEvents.playerLeave.unsubscribe(playerLeave);
    }
};
