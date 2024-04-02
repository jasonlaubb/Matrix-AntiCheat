import { Player, PlayerLeaveAfterEvent, world, Vector3, system, GameMode } from "@minecraft/server";
import { c, flag } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

interface TimerData {
    lastX: number
    lastZ: number
    lastTick: number
    diff: number
    lastLocation: Vector3
    listing: number[]
}
const timerData = new Map<string, TimerData>()
function antiTimer (player: Player) {
    let data = timerData.get(player.id)
    const { x: xV, z: zV } = player.getVelocity()
    if (!data) {
        data = {
            lastX: xV,
            lastZ: zV,
            lastTick: system.currentTick,
            diff: 0,
            lastLocation: player.location,
            listing: []
        }
        timerData.set(player.id, data)
    }
    if (xV + zV > 0 && (xV != data.lastX || zV != data.lastZ)) {
        const diff = system.currentTick - data.lastTick
        data.listing.push(diff)
        if (data.listing.length > 30) data.listing.shift()
        const ratio = data.listing.filter(dat => dat == 2).length / data.listing.length
        if (data.listing.length >= 30 && ratio > 0.26) {
            player.teleport(data.lastLocation)
            const config = c()
            flag (player, "Timer", "A", config.antiTimer.maxVL, config.antiTimer.punishment, [lang(">Ratio") + ":" + ratio.toFixed(2)])
            data.listing = []
        }
        data.diff = diff
        data.lastTick = system.currentTick
    }
    if (xV + zV == 0) {
        data.lastLocation = player.location
    }
    data.lastX = xV
    data.lastZ = zV
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