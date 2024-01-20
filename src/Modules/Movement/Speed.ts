import {
    world,
    system,
    Vector3,
    GameMode,
    Player,
    PlayerLeaveAfterEvent
} from "@minecraft/server";
import { flag, isAdmin, getSpeedIncrease1, getSpeedIncrease2, c } from "../../Assets/Util.js";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang.js";

const speedData = new Map<string, PlayerInfo>();
const lastflag = new Map<string, number>();
const lastflag2 = new Map<string, number>();

/**
 * @author ravriv
 * @description A advanced checks for Speed, the player is calculated based on their velocity in the x and z directions
 * This is converted from blocks per tick to miles per hour
*/

async function AntiSpeedA (player: Player, now: number) {
    const { id } = player;

    if (player.threwTridentAt && now - player.threwTridentAt < 2000 || player.lastExplosionTime && now - player.lastExplosionTime < 2000) {
        return;
    }

    const config = c ()

    const { x, z } = player.getVelocity();

    //calulate the Mph from velocity X and Z
    const playerSpeedMph: number = Math.hypot(x, z) * 72000 / 1609.34;

    //get the info from map
    const playerInfo: PlayerInfo = speedData.get(id);

    //state increase the limit from the speed effect
    const limitIncrease: number = getSpeedIncrease1 (player.getEffect(MinecraftEffectTypes.Speed)) * 1.25;

    //calculate the threshold by adding the limit increase
    const mphThreshold: number = config.antiSpeed.mphThreshold + limitIncrease;

    //check if the player is speeding or not
    const isSpeeding: boolean = playerSpeedMph > mphThreshold && speedData.has(id);

    //check if the player is not speeding or is speeding
    const isNotSpeeding: boolean = playerSpeedMph <= mphThreshold && speedData.has(id);

    //if the player is not moving, set the initial location
    if (playerSpeedMph === 0) {
        speedData.set(id, { initialLocation: player.location });
    } else if (isSpeeding) {

        //if the player hasn't already been flagged, flag them
        if (!playerInfo.highestSpeed) {
            //teleport them back
            system.runTimeout(() => {
                if (player.isGliding || player.threwTridentAt && now - player.threwTridentAt < 80 || player.lastExplosionTime && now - player.lastExplosionTime < 80) return;
                if (!config.slient) player.teleport(playerInfo.initialLocation, { dimension: player.dimension, rotation: { x: -180, y: 0 } });
                //A - false positive: low, efficiency: very high
                const lastFlag = lastflag.get(player.id)
                if (lastFlag && now - lastFlag < 2450 && now - lastFlag > 550)
                    flag(player, 'Speed', 'A', config.antiSpeed.maxVL, config.antiSpeed.punishment, [`${lang(">Mph")}:${playerSpeedMph.toFixed(2)}`]);
                lastflag.set(player.id, now)
                playerInfo.highestSpeed = playerSpeedMph;
            }, 1)
        }
    } else if (isNotSpeeding) {
        playerInfo.highestSpeed = 0;
    }
}


const locationData = new Map<string, LocationData>()

async function AntiSpeedB (player: Player, now: number) {
    const data = locationData.get(player.id)
    locationData.set(player.id, { location: player.location, recordTime: Date.now() })
    if (data === undefined) return;

    if (player.threwTridentAt && now - player.threwTridentAt < 5000 || player.lastExplosionTime && now - player.lastExplosionTime < 5000 || player.isFlying || player.isInWater || player.isGliding || player.hasTag("matrix:riding") || player.isSleeping) {
        return;
    }

    const config = c()

    const { x: x1, z: z1 } = player.location
    const { x: x2, z: z2 } = data.location

    if (player.lastTeleportTime && now - player.lastTeleportTime < 600) return;
    if (player.lastSpeedSkipCheck && now - player.lastSpeedSkipCheck < 3000) return;
    
    //calulate the player block per second
    const bps = Math.hypot(x1 - x2, z1 - z2) / (now - data.recordTime) * 1000

    if (bps > config.antiSpeed.bpsThershold + getSpeedIncrease2 (player.getEffect(MinecraftEffectTypes.Speed)) * 1.5 && bps < 120) {
        const lastFlag = lastflag2.get(player.id)
        player.teleport(data.location)
        if (lastFlag && now - lastFlag < 1200) {
            flag(player, 'Speed', 'B', config.antiSpeed.maxVL, config.antiSpeed.punishment, [`${lang(">BlockPerSecond")}:${bps.toFixed(2)}`])
        }
    }
}

async function AntiSpeedC () {
    const players = world.getAllPlayers()
    const now = Date.now()
    for (const player of players) {
        const { x, z } = player.getVelocity()
        const xz = Math.hypot(x, z)
        // collect the data
        if (xz == 0) {
            player.lastTeleportTime = now
        }
        if (player.isFlying || player.isGliding || player.isSleeping) {
            player.lastSpeedSkipCheck = now
        }

        const safePos = speedData.get(player.id)?.initialLocation
        if (safePos === undefined) continue

        if (isAdmin(player) || player.isFlying || player.isGliding) continue
        const config = c()

        if (player?.lastXZLogged && xz == 0 && player.lastXZLogged > config.antiSpeed.clipThershold && !(player.lastExplosionTime && now - player.lastExplosionTime < 1000) && !(player.threwTridentAt && now - player.threwTridentAt < 1000)) {
            player.teleport(safePos)
            flag(player, 'Speed', 'C', config.antiSpeed.maxVL, config.antiSpeed.punishment, [lang(">velocityXZ") + ":" + player.lastXZLogged.toFixed(2)])
        }
        player.lastXZLogged = xz
    }
}

interface PlayerInfo {
    highestSpeed?: number;
    initialLocation: Vector3;
}

interface LocationData {
    location: Vector3;
    recordTime: number;
}

const antiSpeedA = () => {
    const now: number = Date.now();

    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })
    for (const player of players) {
        if (isAdmin(player)) continue;
        AntiSpeedA (player, now);
    }
}
const antiSpeedB = () => {
    const now: number = Date.now();

    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })
    for (const player of players) {
        if (isAdmin(player)) continue;
        AntiSpeedB (player, now);
    }
}

const playerLeave = (({ playerId }: PlayerLeaveAfterEvent) => {
    speedData.delete(playerId);
    locationData.delete(playerId);
    lastflag.delete(playerId);
});

let id: { [key: string]: number }
export default {
    enable () {
        id = {
            a: system.runInterval(antiSpeedA, 2),
            b: system.runInterval(antiSpeedB, 10),
            c: system.runInterval(AntiSpeedC, 1)
        }
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        speedData.clear()
        locationData.clear()
        lastflag.clear()
        system.clearRun(id.a)
        system.clearRun(id.b)
        system.clearRun(id.c)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
