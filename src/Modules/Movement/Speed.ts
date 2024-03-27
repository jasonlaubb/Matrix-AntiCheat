import {
    world,
    system,
    GameMode,
    Player,
    Vector3,
    PlayerLeaveAfterEvent
} from "@minecraft/server";
import {
    flag,
    isAdmin,
    c,
    getPing
} from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";

/**
 * @author RamiGamerDev
 * @description Code improved by jasonlaubb
 * An integrated check for horizontal movement
 */

interface SpeedData {
    locationData: {
        location: Vector3
        recordTime: number
    }
    timerLog: number
    timerLog2: number
    safeZone: Vector3
    lastTimerLog: number
    lastflag: number
    lastflag2: number
    speedMaxV: number
    lastHurt: number
    lastAttack: number
    speedLog: number
    lastSpeedLog: number
    lastXZlogged: number
    posBackup: Vector3
    lastVelocity: number
    previousXZ: number
}

// The data storage
const speedData = new Map<string, SpeedData>()

function antiSpeed (player: Player, now: number) {
    let data = speedData.get(player.id)
    if (!data?.locationData) {
        data.locationData = {
            location: player.location,
            recordTime: now
        }
        speedData.set(player.id, {} as any)
        return
    }
    const config = c()
    const { x: x1, z: z1 } = player.location;
    const { x: x2, z: z2 } = data.locationData.location;
    const { x, z } = player.getVelocity();
    const xz = Math.hypot(x, z)
    const locDiff = Math.hypot(x1 - x2, z1 - z2)
    const predictionDiff = Math.abs(xz - locDiff)
    if (data?.timerLog == undefined || Number.isNaN(data?.timerLog)) {
        data.timerLog = 0
        data.timerLog2 = 0
        data.safeZone = player.location
        data.lastTimerLog = 0
        data.lastflag = now
        data.lastflag2 = now
    }
    const timerLogCondition = xz != 0 && locDiff != 0 && locDiff > xz
    if (timerLogCondition && predictionDiff > 0.2) data.timerLog++
    if (data.timerLog == data.lastTimerLog && data.timerLog >= 1 && predictionDiff > 0.2)
        data.timerLog2++
    else data.timerLog2 = 0
    if (data.timerLog2 >= 5 || data.timerLog >= 5 && now - data.lastflag < 60 && getPing(player) < 5 && predictionDiff > 0.1) {
        if (now - data.lastflag2 < 1000) {
            flag(player, 'Speed', 'A', config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">velocityXZ") + ":" + predictionDiff.toFixed(2)])
        }
        data.lastflag2 = now
        player.teleport(data.safeZone)
        data.timerLog = 0
        data.timerLog2 = 0
    }
    if (xz == predictionDiff && data.timerLog != 0) {
        data.timerLog = 0
        data.safeZone = player.location
        data.lastTimerLog = data.timerLog
    }
    if (timerLogCondition && predictionDiff > 0.1) data.lastflag = now

    if (player.isGliding || player.isFlying || player.isSleeping) player.lastSpeedSkipCheck = now
    if (!(player.isFlying || player.isGliding || player.threwTridentAt && now - player.threwTridentAt < 2000)) {
        if (data?.lastHurt && now - data.lastHurt) data.speedMaxV = 12
        const attackDuration = data?.lastAttack ? now - data.lastAttack : null
        const hurtDuration = data?.lastHurt ? now - data.lastHurt : null
        if (attackDuration && hurtDuration) {
            if(player.hasTag("matrix:using_item")) data.speedMaxV = 0.7
            if(attackDuration <= 1000) data.speedMaxV = 3 
            if (hurtDuration <= 250) {
                data.speedMaxV = 12
            } else if (attackDuration > 1000 && !player.hasTag("matrix:using_item")) {
                data.speedMaxV = 0.5
            }
        }
        if (!data?.speedLog || !data.lastSpeedLog) {
            data.speedLog = 0
            data.lastXZlogged = xz
            data.posBackup = player.location
            data.lastSpeedLog = now
            data.lastAttack = now
            data.lastHurt = now
        }
        if (xz - data.lastXZlogged < data.speedMaxV && now - data.lastSpeedLog > 900 && data.lastXZlogged - xz < data.speedMaxV) data.posBackup = player.location
        const logDiff = now - data.lastSpeedLog
        const xzDiff = xz - player.lastXZLogged
        if (
            logDiff > 5000 && xz - data.lastXZlogged < data.speedMaxV ||
            logDiff < 500  && xzDiff > data.speedMaxV ||
            player.threwTridentAt && now - player.threwTridentAt < 2100 ||
            hurtDuration < 250 &&
            data.lastVelocity < data.speedMaxV
            ) data.speedLog = 0
        if (xzDiff > data.speedMaxV && !(Number(data.lastXZlogged.toFixed(2)) > 0 && Number(data.lastXZlogged.toFixed(2)) < 0.05)) {
            data.speedLog++
            player.lastSpeedSkipCheck = now
            data.lastSpeedLog = now
            data.previousXZ = data.lastXZlogged
        }
        if (data.lastXZlogged - xz > data.speedMaxV && data.speedLog >= 1) player.teleport(data.safeZone);
        if ((data.speedLog >= 3 || data.speedLog >= 1  && xzDiff > data.speedMaxV +4.5) && data.lastVelocity - xzDiff < 0.2 && Math.abs(data.lastXZlogged - data.previousXZ) < 0.05 && getPing(player) < 5) {
            flag(player, 'Speed', 'B', config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">velocityXZ") + ":" +(xz - data.lastXZlogged).toFixed(2)]);
            player.teleport(data.safeZone)
            data.speedLog = 0
        }
        if (xzDiff > data.speedMaxV) data.lastVelocity = xzDiff
        data.lastXZlogged = xz

        speedData.set(player.id, data)
    }
}

function systemEvent () {
    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator]})
    const now = Date.now()
    for (const player of players) {
        if (isAdmin(player)) continue
        antiSpeed (player, now)
    }
}

function playerLeaveAfterEvent ({ playerId }: PlayerLeaveAfterEvent) {
    speedData.delete(playerId)
}

let id: number

export default {
    enable () {
        id = system.runInterval(systemEvent)
        world.afterEvents.playerLeave.subscribe(playerLeaveAfterEvent)
    },
    disable () {
        speedData.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeaveAfterEvent)
    }
}
