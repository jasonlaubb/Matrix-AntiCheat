import { ItemUseBeforeEvent, system, world } from "@minecraft/server";
import { get } from "../util/database";
export default {
    property: "antiFastThrowEnable",
    enable() {
        world.beforeEvents.itemUse.subscribe(onItemUse);
    },
    disable() {
        world.beforeEvents.itemUse.unsubscribe(onItemUse);
    },
};
function onItemUse(event: ItemUseBeforeEvent) {
    const { itemStack: item, source: player } = event;
    if (player.isOp()) return;
    if (item.typeId === "minecraft:egg" || item.typeId === "minecraft:snowball") {
        const now = Date.now();
        player.fastthrowLastThrow ??= now;
        if (now - player.fastthrowLastThrow < get("antiFastThrowMinInterval")) {
            event.cancel = true;
            player.fastthrowFlag ??= 0;
            if (player.fastthrowLastFlag && now - player.fastthrowLastFlag > 5000) {
                player.fastthrowFlag = 0;
            }
            player.fastthrowLastFlag = now;
            player.fastthrowFlag++;
            if (player.fastthrowFlag >= 3) {
                system.run(() => player.flag("FastThrow", "A", "Player", { interval: now - player.fastthrowLastThrow }));
            }
        } else player.fastthrowLastThrow = now;
    }
}
