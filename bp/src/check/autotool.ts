import { EntityHitBlockAfterEvent, Player, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
;
export default {
    property: "antiAutotoolEnable",
    enable: () => {
        world.afterEvents.entityHitBlock.subscribe(hitBlock);
        addCheckInterval(tickEvent);
    },
    disable: () => {
        world.afterEvents.entityHitBlock.unsubscribe(hitBlock);
        removeCheckInterval(tickEvent);
    }
}
function hitBlock({ damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (!(player instanceof Player)) return;
    player.sendMessage("Index: " + player.autotoolLastSwitch);
}
function tickEvent (player: Player) {
    player.autotoolLastIndex ??= 0;
    if (player.autotoolLastIndex !== player.selectedSlotIndex) player.autotoolLastSwitch = Date.now();
    player.autotoolLastIndex = player.selectedSlotIndex;
}