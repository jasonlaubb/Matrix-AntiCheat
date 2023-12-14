import { world, Player, system, GameMode, PlayerLeaveAfterEvent, Vector3 } from "@minecraft/server";
import { flag, isAdmin, c, inAir } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

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

    if (lastV.y < -0.1 && lastV.y <= velocity.y && player.fallDistance < 20 && player.fallDistance != 0 && velocity.y != 0 && inAir(player.dimension, player.location) && !(player.lastExplosionTime && now - player.lastExplosionTime < 4000) && !(player.threwTridentAt && now - player.threwTridentAt < 4000)) {
        if (!config.slient) {
            player.applyDamage(8)
            player.teleport(player.location)
        }
        flag (player, "Engender", "A", config.antiEngender.maxVL, config.antiEngender.punishment, [lang(">velocityY") + ":" + velocity.y.toFixed(2)])
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
