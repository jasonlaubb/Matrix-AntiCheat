import { Player, world, system, ItemUseAfterEvent, PlayerLeaveAfterEvent } from "@minecraft/server";
import lang from "../../Data/Languages/lang";
import { flag, isAdmin, c } from "../../Assets/Util";

const lastItemUse = new Map<string, number>()

async function AntiFastUse (player: Player) {
    const config = c()
    const timeNow = Date.now();
    const timeLast = lastItemUse.get(player.id);
    lastItemUse.set(player.id, timeNow);
    if (timeLast === undefined) return;

    const delay = timeNow - timeLast;

    if (delay < config.antiFastUse.minUseTime && !player.hasTag("matrix:item-disabled")) {
        flag(player, "FastUse", "A", config.antiFastUse.maxVL, config.antiFastUse.punishment, [lang(">Delay") + ":" + delay.toFixed(2)])
        if (!config.slient) {
            player.addTag("matrix:item-disabled")
            system.runTimeout(() => player.removeTag("matrix:item-disabled"), config.antiFastUse.timeout)
        }
    }
}
const antiFastUse = ({ source: player }: ItemUseAfterEvent) => {
    if (isAdmin(player)) return;
    AntiFastUse(player)
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    lastItemUse.delete(playerId)
}

export default {
    enable () {
        world.afterEvents.itemUse.subscribe(antiFastUse)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        lastItemUse.clear()
        world.afterEvents.itemUse.unsubscribe(antiFastUse)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}