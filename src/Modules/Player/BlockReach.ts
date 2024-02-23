import {
    Vector,
    world, 
    system,
    PlayerBreakBlockBeforeEvent,
    Player,
    Block,
    PlayerPlaceBlockBeforeEvent,
    Vector3
} from "@minecraft/server"
import { flag, isAdmin, c } from "../../Assets/Util"
import { isTargetGamemode } from "../../Assets/Util"
import lang from "../../Data/Languages/lang.js"

/**
 * @author jasonlaubb
 * @description A simple checks for block reach, detect low range of blockReach clients
 */

async function AntiBlockReachA (event: PlayerBreakBlockBeforeEvent, player: Player, block: Block) {
    const config = c()
    if (player.hasTag("matrix:break-disabled") || isTargetGamemode(player, 1)) return;
    const distance = Vector.distance(player.getHeadLocation(), absCentrePos(block.location));

    //if the distance is higher than the max distance, flag the player
    if (distance > config.antiBlockReach.maxBreakDistance) {
        event.cancel = true;
        system.run(() => {
            if (player.hasTag("matrix:break-disabled")) return;
            if (!config.slient) {
                player.addTag("matrix:break-disabled")
                system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiBlockReach.timeout)
            }
            //A - false positive: low, efficiency: high
            flag (player, "BlockReach", "A", config.antiBlockReach.maxVL, config.antiBlockReach.punishment, [lang(">Reach") + ":" + distance.toFixed(2), lang(">Mode") + ":" + lang(">Break")])
        })
    }
}

async function AntiBlockReachB (event: PlayerPlaceBlockBeforeEvent, player: Player, block: Block) {
    const config = c()
    if (player.hasTag("matrix:place-disabled") || isTargetGamemode(player, 1)) return;
    const distance = Vector.distance(player.getHeadLocation(), absCentrePos(block.location));

    //if the distance is higher than the max distance, flag the player
    if (distance > config.antiBlockReach.maxPlaceDistance) {
        event.cancel = true;
        system.run(() => {
            if (player.hasTag("matrix:place-disabled")) return;
            if (!config.slient) {
                player.addTag("matrix:place-disabled")
                system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiBlockReach.timeout)
            }
            //B - false positive: low, efficiency: high
            flag (player, "BlockReach", "B", config.antiBlockReach.maxVL, config.antiBlockReach.punishment, [lang(">Reach") + ":" + distance.toFixed(2), lang(">Mode") + ":" + lang(">Place")])
        })
    }
}

function absCentrePos (pos: Vector3) {
    return { x: pos.x - 0.5, y: pos.y - 0.5, z: pos.z - 0.5 } as Vector3
}

const antiBlockReachA = (event: PlayerBreakBlockBeforeEvent) => {
    const { player, block } = event
    if (isAdmin (player)) return;

    AntiBlockReachA (event, player, block)
}

const antiBlockReachB = (event: PlayerPlaceBlockBeforeEvent) => {
    const { player, block } = event
    if (isAdmin (player)) return;

    AntiBlockReachB (event, player, block)
}

export default {
    enable () {
        world.beforeEvents.playerBreakBlock.subscribe(antiBlockReachA)
        world.beforeEvents.playerPlaceBlock.subscribe(antiBlockReachB)
    },
    disable () {
        world.beforeEvents.playerBreakBlock.unsubscribe(antiBlockReachA)
        world.beforeEvents.playerPlaceBlock.unsubscribe(antiBlockReachB)
    }
}
