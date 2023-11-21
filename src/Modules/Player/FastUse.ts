import { Player, world, system } from "@minecraft/server";
import lang from "../../Data/Languages/lang";
import config from "../../Data/Config";
import { flag, isAdmin } from "../../Assets/Util";

const lastItemUse = new Map<string, number>()

async function antiFastUse (player: Player) {
    const timeNow = Date.now();
    const timeLast = lastItemUse.get(player.id);
    lastItemUse.set(player.id, timeNow);
    if (timeLast === undefined) return;

    const delay = timeNow - timeLast;

    if (delay < config.antiFastUse.minUseTime && !player.hasTag("matrix:item-disabled")) {
        flag(player, "FastUse", config.antiFastUse.maxVL, config.antiFastUse.punishment, [lang(">Delay") + ":" + delay.toFixed(2)])
        player.addTag("matrix:item-disabled")
        system.runTimeout(() => player.removeTag("matrix:item-disabled"), config.antiFastUse.timeout)
    }
}
world.afterEvents.itemUse.subscribe(({ source: player }) => {
    const toggle: boolean = world.getDynamicProperty("antiFastUse") as boolean ?? config.antiFastUse.enabled;
    if (toggle !== true || isAdmin(player)) return;

    antiFastUse(player)
})
world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source
    if (player.hasTag("matrix:item-disabled")) {
        event.cancel = true;
    }
})
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) {
        player.removeTag("matrix:item-disabled")
    }
})
world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    lastItemUse.delete(playerId)
})