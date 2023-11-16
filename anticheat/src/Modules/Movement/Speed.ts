import {
    world,
    system,
    Vector3,
    GameMode,
    Player,
    Effect
} from "@minecraft/server";
import config from "../../Data/Config.js";
import { flag, isAdmin } from "../../Assets/Util.js";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index.js";

const speedData = new Map();

/**
 * @author ravriv
 * @description Speed of the player is calculated based on their velocity in the x and z directions.
 * This speed is converted from blocks per tick to miles per hour
 */

async function antiSpeed (player: Player, now: number) {
    const { id } = player;

    //@ts-expect-error
    if (player.threwTridentAt && now - player.threwTridentAt < 2000 || player.lastExplosionTime && now - player.lastExplosionTime < 2000) return;

    const { x, z } = player.getVelocity();
    const playerSpeedMph: number = Math.hypot(x, z) * 72000 / 1609.34;
    const playerInfo: PlayerInfo = speedData.get(id);
    const limitIncrease: number = getSpeedIncrease(player.getEffect(MinecraftEffectTypes.Speed));
    const mphThreshold: number = config.antiSpeed.mphThreshold + limitIncrease;
    const isSpeeding: boolean = playerSpeedMph > mphThreshold && speedData.has(id);
    const isNotSpeeding: boolean = playerSpeedMph <= mphThreshold && speedData.has(id);

    if (playerSpeedMph === 0) {
        speedData.set(id, { initialLocation: player.location });
    } else if (isSpeeding) {
        if (!playerInfo.highestSpeed) {
            player.teleport(playerInfo.initialLocation, { dimension: player.dimension, rotation: { x: -180, y: 0 } });
            flag (player, 'Speed', config.antiSpeed.maxVL,config.antiSpeed.punishment, [`Mph:${playerSpeedMph.toFixed(2)}`])
            player.applyDamage(6);
            playerInfo.highestSpeed = playerSpeedMph;
        }
    } else if (isNotSpeeding) {
        playerInfo.highestSpeed = 0;
    }
}

class PlayerInfo {
    highestSpeed: number;
    initialLocation: Vector3;
}

function getSpeedIncrease (speedEffect: Effect | undefined) {
    if (speedEffect === undefined) return 0;
    if (speedEffect.amplifier < 2) return 0;
    return (speedEffect?.amplifier - 2) * 4032 / 1609.34;
}

system.runInterval(() => {
    const toggle: boolean = (world.getDynamicProperty("antiSpeed") ?? config.antiSpeed.enabled) as boolean;
    if (toggle !== true) return;
    
    const now: number = Date.now();
    for (const player of world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })) {
        if (isAdmin (player)) continue;

        antiSpeed (player, now);
    }
}, 2);

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    speedData.delete(playerId);
})
