import { EntityHitBlockAfterEvent, InputMode, Player, system, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import { get } from "../util/database";
export default {
    property: "antiAutotoolEnable",
    enable: () => {
        world.afterEvents.entityHitBlock.subscribe(hitBlock);
        world.before
        addCheckInterval("autotool", tickEvent);
    },
    disable: () => {
        world.afterEvents.entityHitBlock.unsubscribe(hitBlock);
        removeCheckInterval("autotool");
    },
};
function hitBlock({ damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (!(player instanceof Player)) return;
    const currentTick = system.currentTick;
    system.runTimeout(() => {
    const interval = currentTick - player.autotoolLastSwitch;
    // Switch tool with low interval
    if (interval <= 2) {
        if (!get("antiAutoToolIgnoreKeyboardInput") || player.inputInfo.lastInputModeUsed !== InputMode.KeyboardAndMouse) {
            player.autotoolFlagged = true;
        }
    } else player.autotoolFlagged = false;
    }, 1);
}
function blockBreak({ player }: PlayerBreakBlockBeforeEvent) {
    if (player.autotoolFlagged) {
        event.cancel = true;
        player.autotoolFlagged = false;
        const now = Date.now();
        player.autotoolLastFlag ??= 0;
        if (now - player.autotoolLastFlag < 300000)
        system.run(() => 
            player.flag("AutoTool", "A", "Player", { interval }));
        player.autotoolLastFlag = now;
    }
}
function tickEvent(player: Player) {
    player.autotoolLastIndex ??= 0;
    if (player.autotoolLastIndex !== player.selectedSlotIndex) {
        player.autotoolSafeIndex = player.autotoolLastIndex;
        player.autotoolLastSwitch = system.currentTick;
    }
    player.autotoolLastIndex = player.selectedSlotIndex;
}
