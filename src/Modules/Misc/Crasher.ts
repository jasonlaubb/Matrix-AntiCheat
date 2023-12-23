import { system } from "@minecraft/server"

/**
 * @author jasonlaubb
 * @description Prevent watchdog to terminating the scripts
 */

// Prevent watchdog to terminating the scripts \:doge\:
const watchDog = () => system.beforeEvents.watchdogTerminate.subscribe(data => {

    //cancel the watchdog terminate
    data.cancel = true
})

async function AntiCrasher (player: Player) {
    const { x, y, z } = player.location
    const max = 30000000

    // if the player location is out of the range, flag them
    if (Math.abs(x) > max || Math.abs(y) > max || Math.abs(z) > max ||
        typeof x !== "number" || typeof y !== "number" || typeof z !== "number"
       ) {
        player.teleport({ x: 0, y: 0, z: 0 })
        if (!player.hasTag("matrix:crasher")) {
            player.addTag("matrix:crasher")
            system.runTimeout(() => {
                player.removeTag("matrix:crasher")
            })
        
            if (isAdmin(player) !== true) {
                flag (player, "Crasher", "A", config.antiCrasher.maxVL, config.antiCrasher.punishment, undefined)
            }
        }
    }
}

const antiCrasher = () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        AntiCrasher(player)
    }
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiCrasher, 0)
        watchDog ()
    },
    disable () {
        system.clearRun(id)
    }
}
