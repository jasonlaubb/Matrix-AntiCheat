import {
    world,
    system,
    Vector3,
    GameMode,
    Player,
    EntityDamageCause,
    Effect
} from "@minecraft/server";
import config from "../../Data/Config.js";
import { flag, isAdmin } from "../../Assets/Util.js";
import { MinecraftEffectTypes, MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index.js";

const speedData = new Map();

/**
 * @author ravriv
 * @description Speed of the player is calculated based on their velocity in the x and z directions.
 * This speed is converted from blocks per tick to miles per hour
 */

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
        const { id } = player;
        if (isAdmin (player)) return;
        //@ts-expect-error
        if (player.threwTridentAt && now - player.threwTridentAt < 2000 || player.lastExplosionTime && now - player.lastExplosionTime < 2000) {
            continue;
        }

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
                flag (player, 'Speed', config.antiSpeed.punishment, [`Miles Per Hour:${playerSpeedMph.toFixed(2)}`])
                player.applyDamage(6);
                playerInfo.highestSpeed = playerSpeedMph;
            }
        } else if (isNotSpeeding) {
            playerInfo.highestSpeed = 0;
        }
    }
}, 2);

world.afterEvents.itemReleaseUse.subscribe(({ itemStack, source: player }) => {
    if (itemStack?.typeId === MinecraftItemTypes.Trident && player instanceof Player) {
        //@ts-expect-error
        player.threwTridentAt = Date.now();
    }
});

world.afterEvents.entityHurt.subscribe(event => {
    const player = event.hurtEntity;
    if (player instanceof Player && (event.damageSource.cause == EntityDamageCause.blockExplosion || event.damageSource.cause == EntityDamageCause.entityExplosion || event.damageSource.cause === EntityDamageCause.entityAttack)) {
        player.addTag("matrix:knockback");
        //@ts-expect-error
        player.lastExplosionTime = Date.now();
    }
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    speedData.delete(playerId);
})
