import { Player, PlayerLeaveAfterEvent, world, Vector3, system, GameMode } from "@minecraft/server";
import { c, flag } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

interface TimerData {
    locationMove: number[]
    velocityMove: number[]
    lastLocation: Vector3
    previousLocation: Vector3
    lastflag: number
}
const timerData = new Map<string, TimerData>()
function antiTimer (player: Player) {
    let data = timerData.get(player.id)
    const { x: xV, y: yV, z: zV } = player.getVelocity()
    if (!data || (xV == 0 && zV == 0 && yV <= 0) || player.isFlying || player.isGliding) {
        data = {
            locationMove: [],
            velocityMove: [],
            lastLocation: player.location,
            previousLocation: player.location,
            lastflag: Date.now() - 5500
        }
        timerData.set(player.id, data)
        return
    }
    const { x: xL, z: zL } = player.location
    const { x: xP, z: zP } = data.lastLocation
    data.locationMove.push(Math.hypot(xL - xP, zL - zP))
    data.velocityMove.push(Math.hypot(xV, zV))
    if (data.locationMove.length > 20) {
        let totalDifferent = 0
        data.locationMove.shift()
        data.velocityMove.shift()
        for (let i = 0; i < data.locationMove.length; i++) {
            totalDifferent += Math.abs(data.locationMove[i] - data.velocityMove[i]) * 0.05
        }
        const config = c()
        if (totalDifferent > config.antiTimer.maxDifferent) {
            player.teleport(data.previousLocation)
            const now = Date.now()
            if (now - data.lastflag < 5500) {
                flag (player, "Timer", "A", config.antiTimer.maxVL, config.antiTimer.punishment, [lang(">distance") + ":" + totalDifferent])
            }
            data.lastflag = now
            data = undefined
        }
    }
    timerData.set(player.id, data)
}
function playerLeaveAfterEvent ({ playerId }: PlayerLeaveAfterEvent) {
    timerData.delete(playerId)
}
function systemEvent () {
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator, GameMode.creative] })
    for (const player of players) {
        antiTimer(player)
    }
}
let id: number
export default {
    enable () {
        id = system.runInterval(systemEvent, 1)
        world.afterEvents.playerLeave.subscribe(playerLeaveAfterEvent)
    },
    disable () {
        timerData.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeaveAfterEvent)
    }
}