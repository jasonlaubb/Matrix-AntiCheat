import { world, system, Player, Vector3, PlayerLeaveAfterEvent } from "@minecraft/server";
import { c, flag, isAdmin } from "../../Assets/Util";

interface BlinkData {
    s: number,
    l: Vector3
}
const blinkData = new Map<string, BlinkData>()
let vl: { [key: string]: number } = {}

/**
 * @author jasonlaubb
 * @description check if player keep a same speed without location movement
 * It will detect when player open blink while moving, otherwise it will be detected by anti speed
 */

async function AntiBlink (player: Player) {
    const config = c ()

    const data = blinkData.get(player.id)

    const velocity = player.getVelocity()
    const { x: xV, y: yV, z: zV } = velocity
    const { x: xL, y: yL, z: zL } = player.location
    const speed = Math.hypot(xV, yV, zV)

    blinkData.set(player.id, { s: speed, l: player.location })
    if (data === undefined) return;

    const { l: lastPosition, s: lastSpeed } = data
    const { x: xT, y: yT, z: zT } = lastPosition

    vl[player.id] ??= 0

    const isLocationSame = xL == xT && yL == yT && zT == zL

    //A - false positive: low, efficiency: high
    if (speed > 0 && speed == lastSpeed && isLocationSame) {
        ++vl[player.id]
        if (vl[player.id] > config.antiBlink.flagVL) {
            if (!config.slient) player.teleport(player.location)
            flag (player, "Blink", "A", config.antiBlink.maxVL, config.antiBlink.punishment, undefined)
        }
    } else vl[player.id] = 0
}

const antiBlink = () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        if (isAdmin(player)) continue
        AntiBlink(player)
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    blinkData.delete(playerId)
    delete vl[playerId]
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiBlink)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        blinkData.clear()
        vl = {}
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
