import { world, system, Player } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";

/**
 * @author jasonlaubb
 * @description Remove the op from non-admin players
 * @warning This check don't work on Realm or BDS without server properties setting right
 * @warning This will let /setmaxplayers be invalid if detected (this is very important, very very important)
 */

async function AntiOperator (player: Player) {
    const isadmin = isAdmin(player)

    const playerIsOp = player.isOp();

    //if the player is op and not admin, remove the op
    if (playerIsOp && !isadmin) {
        player.setOp(false)
        flag (player, "Operator", "A", 0, config.antiOperator.punishment, undefined)
    }

    //if the player isn't op and is admin, add the op
    if (!playerIsOp && isadmin) {
        //prevent some host open Anti-op and deop
        player.setOp(true)
    }
}

const antiOperator = () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        AntiOperator (player)
    }
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiOperator)
    },
    disable () {
        system.clearRun(id)
    }
}