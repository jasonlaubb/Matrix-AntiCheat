import { world, system, GameMode, Vector3, Dimension, Player, PlayerLeaveAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

interface FlyData {
    previousLocations: Vector3;
    velocityLog: number;
    lastHighVelocity: number;
    flyFlags: number;
    lastFlag: number;
    lastFlag2: number;
    lastVelLog: number;
    lastVelocity: number; 
    previousVelocity: number;
}
interface IncludeStairDataInput {
    location: Vector3;
    dimension: Dimension;
}

/**
 * @author RaMiGamerDev
 * @description Code rewrite by jasonlaubb
 * A efficient vertical movement check based on bds prediction
 */

const flyData = new Map<string, FlyData>();
const includeStair = ({ location: { x: px, y: py, z: pz }, dimension }: IncludeStairDataInput) => {
    try {
        return [dimension.getBlock({ x: Math.floor(px), y: Math.floor(py), z: Math.floor(pz) })?.typeId, dimension.getBlock({ x: Math.floor(px), y: Math.floor(py) - 1, z: Math.floor(pz) })?.typeId].includes("stair");
    } catch {
        return false;
    }
};
function antiFly(player: Player, now: number) {
    const config = c();
    let data = flyData.get(player.id);
    if (!data) {
        data = {} as any;
        data = {
            previousLocations: player.location,
            velocityLog: 0,
            lastVelLog: 0,
            lastHighVelocity: 0,
            previousHighVelocity: 0,
            previousVelocity: undefined,
            lastFlag: now,
            lastFlag2: now,
            flyFlags: 0,
        } as FlyData;
        flyData.set(player.id, data);
        return;
    }
    const { y: velocity, x, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    if (player.isOnGround && velocity == 0 && x == 0 && z == 0) {
        data.previousLocations = player.location;
        data.velocityLog = 0;
    }
    const jumpBoost = player.getEffect(MinecraftEffectTypes.JumpBoost);
    const levitation = player.getEffect(MinecraftEffectTypes.Levitation);
    const instair = includeStair(player);
    const skip1 = !(player.lastExplosionTime && now - player.lastExplosionTime < 5500) && !(player.threwTridentAt && now - player.threwTridentAt < 5000) && !player.hasTag("matrix:knockback");
    const skip2 = !player.isFlying && !player.isGliding;
    const skip3 = !(jumpBoost && jumpBoost?.amplifier > 2) && !(levitation && levitation?.amplifier > 2);
    if (jumpBoost?.amplifier > 2 || levitation?.amplifier > 2) {
        flyData.set(player.id, data);
        return;
    }
    const flyMovement = (data.velocityLog > 1 && velocity <= 0) || (velocity < config.antiFly.maxVelocity && player.fallDistance < -1.5);
    const clientFly = data.velocityLog > 0 && player?.lastVelLog == data.velocityLog;
    if (!player.isOnGround && clientFly && flyMovement && skip1 && skip2 && skip3 && velocity != 1 && !instair) {
        const lastflag = data.lastFlag;
        player.teleport(data.previousLocations);
        if (lastflag && now - lastflag <= 5000 && now - lastflag >= 500) flag(player, "Fly", "A", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + data.lastHighVelocity.toFixed(2)]);
        data.velocityLog = 0;
        delete data.previousVelocity;
        data.lastFlag = now;
    }
    data.lastVelLog = data.velocityLog;
    if (data.velocityLog == 1 && !instair && velocity <= 0.1 && (data.lastVelocity >= -0.95  && data.lastVelocity <= -0.1 || data.lastVelocity <= 0.42 && data.lastVelocity >= -0.03)) {
        const lastflag = data.lastFlag2;
        data.flyFlags++;
        if ((xz > 0 || player.lastXZLogged > 0) && (data.lastHighVelocity >= 7 || (data.flyFlags >= 2 && now - lastflag >= 450 && now - lastflag <= 1000))) {
            flag(player, "Fly", "B", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + data.lastHighVelocity.toFixed(2)]);
            player.teleport(data.previif (data.velocityLog == 1 && !instair && velocity <= 0.1 && (data.lastVelocity >= -0.95  && data.lastVelocity <= -0.1 || data.lastVelocity <= 0.42 && data.lastVelocity >= -0.03)) {
        const lastflag = data.lastFlag2;
        data.flyFlags++ 
        if ((xz > 0 || player.lastXZLogged > 0) && (data.lastHighVelocity >= 7 || data.flyFlags >= 2 && now - lastflag >= 450 && now - lastflag <= 1000)){
              flag(player, "Fly", "B", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + data.lastHighVelocity.toFixed(2)]);
              player.teleport(data.previousLocations);
              data.flyFlags = 0
        } else if(data.flyFlags >= 2) data.flyFlags = 0
        if(data.lastHighVelocity >= 1.5 && player.isOnGround) {
               flag(player, "Fly", "C", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + data.lastHighVelocity.toFixed(2)]);
               player.teleport(data.previousLocations);
        } 
        if(data.lastHighVelocity > 22) {
              flag(player, "Fly", "D", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + data.lastHighVelocity.toFixed(2)]);
              player.teleport(data.previousLocations);
        } 
        if(player.location.y - data.previousLocations.y >= 1 && data.lastHighVelocity > 1){
             flag(player, "Fly", "E", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + data.lastHighVelocity.toFixed(2)]);
             player.teleport(data.previousLocations);
        } 
        data.lastFlag2 = now;
    } 
    if (velocity > config.antiFly.maxVelocity && skip1) {
        data.velocityLog += 1;
        data.lastHighVelocity = velocity;
    }
    else if (velocity <= config.antiFly.maxVelocity || velocity == 0 && player.isOnGround || !skip1){
         data.velocityLog = 0;
         data.lastVelocity = velocity;
    }  
    flyData.set(player.id, data);
}
function systemEvent() {
    const now = Date.now();
    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] });
    for (const player of players) {
        if (isAdmin(player)) continue;
        antiFly(player, now);
    }
}
function playerLeaveAfterEvent({ playerId }: PlayerLeaveAfterEvent) {
    flyData.delete(playerId);
}
let id: number;
export default {
    enable() {
        id = system.runInterval(systemEvent);
        world.afterEvents.playerLeave.subscribe(playerLeaveAfterEvent);
    },
    disable() {
        flyData.clear();
        system.clearRun(id);
        world.afterEvents.playerLeave.unsubscribe(playerLeaveAfterEvent);
    },
};
