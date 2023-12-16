import { world, Player, system, GameMode, PlayerLeaveAfterEvent, Vector3 } from "@minecraft/server";
import { flag, isAdmin, c, inAir } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

const lastVelocity = new Map<string, Vector3>();

/**
 * @author jasonlaubb
 * @description Check if player change speed with a high range while high speed
 */

async function Engender (player: Player, now: number) {
    const config = c()
    const lastV = lastVelocity.get(player.id)
    const velocity = player.getVelocity()
    lastVelocity.set(player.id, velocity)
    if (lastV === undefined) return;

    if (player.isOnGround) player.lastTouchGround = now

    let flagged = false

    const notSkippingCheck = !player.hasTag("matrix:riding") && now - player.lastTouchGround > 1000 && !player.isFlying && !player.isOnGround && !player.isGliding && !player.isInWater && inAir(player.dimension, player.location) && player.fallDistance != 0 && velocity.y != 0 && !(player.lastExplosionTime && now - player.lastExplosionTime < 4000) && !(player.threwTridentAt && now - player.threwTridentAt < 4000) && !player.getEffect(MinecraftEffectTypes.JumpBoost) && !player.getEffect(MinecraftEffectTypes.Levitation)
    if (lastV.y < -0.12 && lastV.y < velocity.y && player.fallDistance < 20 && notSkippingCheck && !player.hasTag("matrix:slime")) {
        flagged = true
        flag (player, "Engender", "A", config.antiEngender.maxVL, config.antiEngender.punishment, [lang(">velocityY") + ":" + velocity.y.toFixed(2)])
    }

    const xzNow = Math.hypot(velocity.x, velocity.y)
    const xzLast = Math.hypot(lastV.x, lastV.z)
    if (xzNow > xzLast && xzNow > 2.5 && player.fallDistance < 10 && notSkippingCheck) {
        flagged = true
        flag (player, "Engender", "B", config.antiEngender.maxVL, config.antiEngender.punishment, [lang(">velocityXZ") + ":" + xzNow.toFixed(2)])
    }

    if (flagged) {
        if (!config.slient) {
            player.applyDamage(8)
            player.teleport(player.location)
        }
    }
}

const engender = () => {
    const DateNow = Date.now()
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator]} )
    for (const player of players) {
        if (isAdmin(player)) continue;
        Engender (player, DateNow)
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    lastVelocity.delete(playerId)
}

let id: number

export default {
    enable () {
        id = system.runInterval(engender)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        lastVelocity.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
