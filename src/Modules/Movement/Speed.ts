import {
    world,
    system,
    Vector3,
    GameMode,
    Player,
    Effect,
    PlayerLeaveAfterEvent
} from "@minecraft/server";
import config from "../../Data/Config.js";
import { flag, isAdmin } from "../../Assets/Util.js";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang.js";

const speedData = new Map();

/**
 * @author ravriv
 * @description A advanced checks for Speed, the player is calculated based on their velocity in the x and z directions
 * This is converted from blocks per tick to miles per hour
*/

async function AntiSpeed(player: Player, now: number) {
    const { id } = player;

    if (player.threwTridentAt && now - player.threwTridentAt < 2000 || player.lastExplosionTime && now - player.lastExplosionTime < 2000) {
        return;
    }

    const { x, z } = player.getVelocity();

    //calulate the Mph from velocity X and Z
    const playerSpeedMph: number = Math.hypot(x, z) * 72000 / 1609.34;

    //get the info from map
    const playerInfo: PlayerInfo = speedData.get(id);

    //state increase the limit from the speed effect
    const limitIncrease: number = getSpeedIncrease(player.getEffect(MinecraftEffectTypes.Speed));

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
            flag(player, 'Speed', 'A',config.antiSpeed.maxVL, config.antiSpeed.punishment, [`${lang(">Mph")}:${playerSpeedMph.toFixed(2)}`]);
            playerInfo.highestSpeed = playerSpeedMph;
        }
    } else if (isNotSpeeding) {
        playerInfo.highestSpeed = 0;
    }
}

interface PlayerInfo {
    highestSpeed: number;
    initialLocation: Vector3;
}

function getSpeedIncrease(speedEffect: Effect | undefined) {
    if (speedEffect === undefined) {
        return 0;
    }
    if (speedEffect.amplifier < 2) {
        return 0;
    }
    return (speedEffect?.amplifier - 2) * 4032 / 1609.34;
}

const antiSpeed = () => {
    const toggle: boolean = (world.getDynamicProperty("antiSpeed") ?? config.antiSpeed.enabled) as boolean;

    if (toggle !== true) {
        return;
    }

    const now: number = Date.now();

    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })
    for (const player of players) {
        if (isAdmin(player)) {
            continue;
        }
        AntiSpeed(player, now);
    }
}

const playerLeave = (({ playerId }: PlayerLeaveAfterEvent) => {
    speedData.delete(playerId);
});

let id: number
export default {
    enable () {
        id = system.runInterval(antiSpeed, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        speedData.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
