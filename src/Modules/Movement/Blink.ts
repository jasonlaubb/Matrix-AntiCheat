import { world, system, Player, Vector3, PlayerLeaveAfterEvent, PlayerSpawnAfterEvent } from "@minecraft/server";
import { c, flag, isAdmin } from "../../Assets/Util";

interface BlinkData {
    s: Vector3,
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

    blinkData.set(player.id, { s: velocity, l: player.location })
    if (data === undefined) return;

    const { l: { x: xT, y: yT, z: zT }, s: { x, y, z } } = data

    vl[player.id] ??= 0

    const isLocationSame = xL == xT && yL == yT && zT == zL
    const isVelocitySame = x == xV && y == yV && z == zV

    //A - false positive: low, efficiency: high
    if (Math.hypot(x, y, z) > 0.005 && isVelocitySame && isLocationSame && player.hasTag("matrix:alive") && !(player.lastSpawn && Date.now() - player.lastSpawn < 5000)) {
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

const playerSpawn = ({ player }: PlayerSpawnAfterEvent) => player.lastSpawn = Date.now()

let id: number

export default {
    enable () {
        id = system.runInterval(antiBlink, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
        world.afterEvents.playerSpawn.subscribe(playerSpawn)
    },
    disable () {
        blinkData.clear()
        vl = {}
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn)
    }
}
