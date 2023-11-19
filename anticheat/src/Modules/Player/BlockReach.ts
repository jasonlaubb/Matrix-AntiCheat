import {
    Vector,
    world, 
    system,
    PlayerBreakBlockBeforeEvent,
    Player,
    Block,
    PlayerPlaceBlockBeforeEvent
} from "@minecraft/server"
import { flag, isAdmin } from "../../Assets/Util"
import { isTargetGamemode } from "../../Assets/Util"
import config from "../../Data/Config.js"
import lang from "../../Data/Languages/lang.js"

/**
 * @author jasonlaubb
 * @description A simple checks for block reach, detect low range of blockReach clients
 */

async function antiBlockReachA (event: PlayerBreakBlockBeforeEvent, player: Player, block: Block) {
    if (player.hasTag("matrix:break-disabled") || isTargetGamemode(player, 1)) return;
    const distance = Vector.distance(player.getHeadLocation(), block.location);

    //if the distance is higher than the max distance, flag the player
    if (distance > config.antiBlockReach.maxBreakDistance) {
        event.cancel = true;
        system.run(() => {
            if (player.hasTag("matrix:break-disabled")) return;
            player.addTag("matrix:break-disabled")
            system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiBlockReach.timeout)
            flag (player, "BlockReach", config.antiBlockReach.maxVL, config.antiBlockReach.punishment, [lang(">Reach") + distance.toFixed(2), lang(">Mode") + lang(">Break")])
        })
    }
}

async function antiBlockReachB (event: PlayerPlaceBlockBeforeEvent, player: Player, block: Block) {
    if (player.hasTag("matrix:place-disabled") || isTargetGamemode(player, 1)) return;
    const distance = Vector.distance(player.getHeadLocation(), block.location);

    //if the distance is higher than the max distance, flag the player
    if (distance > config.antiBlockReach.maxPlaceDistance) {
        event.cancel = true;
        system.run(() => {
            if (player.hasTag("matrix:place-disabled")) return;
            player.addTag("matrix:place-disabled")
            system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiBlockReach.timeout)
            flag (player, "BlockReach", config.antiBlockReach.maxVL, config.antiBlockReach.punishment, [lang(">Reach") + distance.toFixed(2), lang(">Mode") + lang(">Place")])
        })
    }
}

world.beforeEvents.playerBreakBlock.subscribe(event => {
    const toggle: boolean = (world.getDynamicProperty("antiBlockReach") ?? config.antiScaffold.enabled) as boolean;
    if (toggle !== true) return;

    const { player, block } = event
    if (isAdmin (player)) return;

    antiBlockReachA (event, player, block)
})

world.beforeEvents.playerPlaceBlock.subscribe(event => {
    const toggle: boolean = (world.getDynamicProperty("antiBlockReach") ?? config.antiScaffold.enabled) as boolean;
    if (toggle !== true) return;

    const { player, block } = event
    if (isAdmin (player)) return;

    antiBlockReachB (event, player, block)
})
