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

const speedData = new Map();

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
    const limitIncrease: number = getSpeedIncrease1 (player.getEffect(MinecraftEffectTypes.Speed));

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
            if (!config.slient) player.teleport(playerInfo.initialLocation, { dimension: player.dimension, rotation: { x: -180, y: 0 } });
            //A - false positive: low, efficiency: very high
            flag(player, 'Speed', 'A', config.antiSpeed.maxVL, config.antiSpeed.punishment, [`${lang(">Mph")}:${playerSpeedMph.toFixed(2)}`]);
            playerInfo.highestSpeed = playerSpeedMph;
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

    if (player.threwTridentAt && now - player.threwTridentAt < 2000 || player.lastExplosionTime && now - player.lastExplosionTime < 2000 || player.isFlying || player.isInWater || player.isGliding || player.hasTag("matrix:riding") || player.isSleeping) {
        return;
    }

    const config = c()

    const { x: x1, z: z1 } = player.location
    const { x: x2, z: z2 } = data.location
    const { x, y, z } = player.getVelocity()
    if (x == 0 && y == 0 && z == 0) return;
    
    const bps = Math.hypot(x1 - x2, z1 - z2) / (Date.now() - data.recordTime) * 1000

    if (bps > 25 + getSpeedIncrease2 (player.getEffect(MinecraftEffectTypes.Speed)) * 1.25) {
        player.teleport(data.location)
        flag(player, 'Speed', 'B', config.antiSpeed.maxVL, config.antiSpeed.punishment, [`${lang(">PosDeff")}:${bps.toFixed(2)}`]);
    }
}

interface PlayerInfo {
    highestSpeed: number;
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
        if (isAdmin(player)) {
            continue;
        }
        AntiSpeedA (player, now);
    }
}
const antiSpeedB = () => {
    const now: number = Date.now();

    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })
    for (const player of players) {
        if (isAdmin(player)) {
            continue;
        }
        AntiSpeedB (player, now);
    }
}

const playerLeave = (({ playerId }: PlayerLeaveAfterEvent) => {
    speedData.delete(playerId);
    locationData.delete(playerId)
});

let id: { [key: string]:number}
export default {
    enable () {
        id = {
            a: system.runInterval(antiSpeedA, 2),
            b: system.runInterval(antiSpeedB, 1)
        }
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        speedData.clear()
        system.clearRun(id.a)
        system.clearRun(id.b)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
