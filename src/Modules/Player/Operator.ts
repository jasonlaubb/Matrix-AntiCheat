import { world, system, Player } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";

/**
 * @author jasonlaubb
 * @description Remove the op from non-admin players
 * @warning This check don't work on Realm or BDS without server properties setting right
 */

async function operator (player: Player) {
    const isadmin = isAdmin(player)

    const playerIsOp = player.isOp();

    //if the player is op and not admin, remove the op
    if (playerIsOp && !isadmin) {
        player.setOp(false)
        flag (player, "Operator", 0, config.antiOperator.punishment, undefined)
    }

    //if the player isn't op and is admin, add the op
    if (!playerIsOp && isadmin) {
        player.setOp(true)
    }
}

system.runInterval(() => {
    const toggle: boolean = (world.getDynamicProperty("antiOperator") ?? config.antiOperator.enabled) as boolean;
    if (toggle !== true) return

    for (const player of world.getAllPlayers()) {
        operator (player)
    }
}, 20)