import { world, system, Player, Vector3 } from "@minecraft/server";
import config from "../../Data/Config";
import { flag, isAdmin } from "../../Assets/Util";

interface TimerData {
    lastPos: Vector3;
    velocities: number[];
}

const timerData = new Map<string, TimerData>()

/**
 * @author jasonlaubb
 * @description Check if player is using timer
 */

async function antiTimer (player: Player): Promise<any> {
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
        return timerData.set(player.id, { lastPos: player.location, velocities } as TimerData)
    } else {
        velocities.shift()
        timerData.set(player.id, { lastPos: player.location, velocities } as TimerData)
    }

    if (lastPos === undefined || velocities.some((v) => v == 0)) return

    //calculate block per tick
    const blockPerTick = Math.hypot(lastPos.x - player.location.x, lastPos.z - player.location.z)
    const speedLimit = Math.max(...velocities)

    // flag the player
    if (blockPerTick > speedLimit * config.antiTimer.absError && !velocities.some((v) => v == 0)) {
        player.teleport(lastPos)
        flag (player, "Timer", "A", config.antiTimer.maxVL, config.antiTimer.punishment, ["BlockPerTick:" + blockPerTick.toFixed(2)])
    }
}

system.runInterval(() => {
    const toggle: boolean = world.getDynamicProperty("antiTimer") as boolean ?? config.antiTimer.enabled
    if (toggle !== true) return

    const players = world.getAllPlayers()

    for (const player of players) {
        if (isAdmin (player)) continue
        antiTimer (player)
    }
}, 0)

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    timerData.delete(playerId)
})