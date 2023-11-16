import { world, system, GameMode, Player } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

const previousLocations = new Map();

async function antiFly (player: Player, now: number) {
    //@ts-expect-error
    const { id, name, isOnGround, isFlying, isInWater, isGliding, isFalling, threwTridentAt, lastExplosionTime } = player;
    const jumpEffect = player.getEffect(MinecraftEffectTypes.JumpBoost)
    const prevLoc = previousLocations.get(id);
    const { x, y, z } = player.getVelocity();
    const xz = Math.hypot(x, z);

    if (isFlying || isInWater || isGliding || player.hasTag("matrix:levitating") || (jumpEffect && jumpEffect.amplifier > 2) || (threwTridentAt && now - threwTridentAt < 3000) || (lastExplosionTime && now - lastExplosionTime < 5000)) {
        return;
    }

    if (!prevLoc && isOnGround) {
        previousLocations.set(id, player.location);
    }

    if (!isOnGround && prevLoc) {
        if ((y > 0.7 && xz > 0.39) || (y === 0 && xz > 0.02 && !player.isClimbing)) {
            player.teleport(prevLoc);
            player.applyDamage(8);
            flag (player, "Fly", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY:" + y.toFixed(2), "velocityXZ:" + xz.toFixed(2)])
        }
    }
}

system.runInterval(() => {
    const toggle: boolean = Boolean(world.getDynamicProperty("antiFly")) ?? config.antiFly.enabled;
    if (toggle !== true) return;

    const now = Date.now();
    for (const player of world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })) {
        if (isAdmin(player)) continue;

        antiFly (player, now)
    }
}, 1);