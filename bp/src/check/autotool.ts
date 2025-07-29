import { EntityHitBlockAfterEvent, InvalidEntityError, Player, PlayerBreakBlockAfterEvent, system, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
;
export default {
    property: "antiAutotoolEnable",
    enable: () => {
        world.afterEvents.entityHitBlock.subscribe(hitBlock);
        world.afterEvents.playerBreakBlock.subscribe(blockBreak);
        addCheckInterval(tickEvent);
    },
    disable: () => {
        world.afterEvents.entityHitBlock.unsubscribe(hitBlock);
        world.afterEvents.playerBreakBlock.unsubscribe(blockBreak);
        removeCheckInterval(tickEvent);
    }
}
function hitBlock({ damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (!(player instanceof Player)) return;
    player.sendMessage("Index: " + (Date.now() - player.autotoolLastSwitch));
    const interval = Date.now() - player.autotoolLastSwitch;
    const safeIndex = player.autotoolSafeIndex;
    if (interval <= 20) {
        let i = 0;
        const id = system.runInterval(() => {
            i++;
            player.sendMessage("set : " + safeIndex)
            player.selectedSlotIndex = safeIndex;
            player.autotoolLastIndex = safeIndex;
            if (i >= 40) system.clearRun(id);
        });
    }
}
function blockBreak({ player }: PlayerBreakBlockAfterEvent) {
    system.runTimeout(() => {
        player.sendMessage("Index: " + (Date.now() - player.autotoolLastSwitch));
    });
}
function tickEvent (player: Player) {
    player.autotoolLastIndex ??= 0;
    if (player.autotoolLastIndex !== player.selectedSlotIndex) {
        player.autotoolSafeIndex = player.autotoolLastIndex;
        player.autotoolLastSwitch = Date.now();
    }
    player.autotoolLastIndex = player.selectedSlotIndex;
}