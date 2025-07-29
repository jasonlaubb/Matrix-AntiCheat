import { EntityHitBlockAfterEvent, Player, PlayerBreakBlockAfterEvent, system, world } from "@minecraft/server";
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
    if (interval <= 1) {
        system.runTimeout(() => player.selectedSlotIndex = safeIndex, 1);
        player.flag("AutoTool", "A", "Player", { interval });
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