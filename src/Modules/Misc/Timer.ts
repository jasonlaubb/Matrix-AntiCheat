import { world, system, Player, Vector3, PlayerLeaveAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

interface TimerData {
    lastPos: Vector3;
    velocities: number[];
}

const timerData = new Map<string, TimerData>()

/**
 * @author jasonlaubb
 * @description Check if player is using timer
 */

async function AntiTimer (player: Player) {
    const config = c ()
    const { x, y, z } = player.getVelocity()
    const totalSpeed = Math.hypot(x, y, z)
    
    let data = timerData.get(player.id)

    if (data === undefined) {
        data = {
            lastPos: player.location,
            velocities: []
        }
        timerData.set(player.id, data)
        return
    }

    let { velocities, lastPos } = data  

    // log the speed
    velocities.push(totalSpeed)

    if (velocities.length <= 10) {
        timerData.set(player.id, { lastPos: player.location, velocities } as TimerData)
        return
    } else {
        velocities.shift()
        timerData.set(player.id, { lastPos: player.location, velocities } as TimerData)
    }

    if (lastPos === undefined || velocities.some((v) => v == 0)) return

    //calculate block per tick
    const blockPerTick = Math.hypot(lastPos.x - player.location.x, lastPos.y - player.location.y, lastPos.z - player.location.z)
    const speedLimit = Math.max(...velocities)

    const timeNow = Date.now()

    // flag the player
    const ratio = blockPerTick / speedLimit
    if (ratio > 2.6 && totalSpeed > 0.23 && !velocities.some((v) => v == 0)) {
        if (player.lastExplosionTime && player.lastExplosionTime - timeNow < 2000) return
        if (player.isFlying || player.getEffect(MinecraftEffectTypes.JumpBoost) || player.getEffect(MinecraftEffectTypes.Speed)) return
        if (!config.slient) player.teleport(lastPos)
        //A - false positive: high, efficiency: high
        flag (player, "Timer", "A", config.antiTimer.maxVL, config.antiTimer.punishment, [lang(">Ratio") + ":" + ratio.toFixed(2)])
    }
}

const antiTimer = () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        if (isAdmin (player)) continue
        AntiTimer (player)
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    timerData.delete(playerId)
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiTimer, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        timerData.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
