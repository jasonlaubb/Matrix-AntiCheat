import { world, Player, system, GameMode, PlayerLeaveAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

const fallDistances = new Map<string, number[]>();

/**
 * @author jasonlaubb
 * @description Check if player change speed with a high range while high speed
 */

async function ElytraFly (player: Player, now: number) {
    const config = c()
    const data = fallDistances.get(player.id) ?? []
    data.push(player.fallDistance)

    const { y: velocity } = player.getVelocity()

    if (player.isGliding) {
        if (data.length > config.antiElytraFly.fallDiscycle) {  
            data.shift()
            if (data.every(f => player.fallDistance == f) && player.fallDistance !== 1 && player.fallDistance <= config.antiElytraFly.maxFallDis && velocity < -0.01) {
                if (!config.slient) player.kill()
                flag (player, "Elyra Fly", "A", config.antiElytraFly.maxVL, config.antiElytraFly.punishment, [lang(">velocityY") + ":" + + velocity.toFixed(2)])
            }
        } else {
            fallDistances.set(player.id, data)

            const ratio = player.fallDistance / (velocity ** 2) * player.getRotation().x ** 2 / 56000

            if (ratio > config.antiElytraFly.maxRatio && ratio !== Infinity && player.fallDistance !== 1 && player.lastGliding && now - player.lastGliding > 1000) {
                if (!config.slient) player.kill()
                flag (player, "Elyra Fly", "B", config.antiElytraFly.maxVL, config.antiElytraFly.punishment, [lang(">Ratio") + ":" + + ratio.toFixed(2)])
            }
        }
    } else {
        fallDistances.set(player.id, undefined)
        player.lastGliding = now
    }
}

const elyraFly = () => {
    const DateNow = Date.now()
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator]} )
    for (const player of players) {
        if (isAdmin(player)) continue;
        ElytraFly (player, DateNow)
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    fallDistances.delete(playerId)
}

let id: number

export default {
    enable () {
        id = system.runInterval(elyraFly)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        fallDistances.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
