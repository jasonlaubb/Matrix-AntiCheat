import { EntityHitBlockAfterEvent, InputMode, Player, PlayerBreakBlockBeforeEvent, system, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import { get } from "../util/database";
import { fastAbs } from "../util/mathUtil";
export default {
    property: "antiAutotoolEnable",
    enable: () => {
        world.afterEvents.entityHitBlock.subscribe(hitBlock);
        world.beforeEvents.playerBreakBlock.subscribe(blockBreak);
        addCheckInterval("autotool", tickEvent);
    },
    disable: () => {
        world.afterEvents.entityHitBlock.unsubscribe(hitBlock);
        world.beforeEvents.playerBreakBlock.unsubscribe(blockBreak);
        removeCheckInterval("autotool");
    },
};
function hitBlock({ damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (!(player instanceof Player) || !get("antiAutoToolIgnoreKeyboardInput") || player.inputInfo.lastInputModeUsed !== InputMode.KeyboardAndMouse) return;
    const currentTick = system.currentTick;
    system.runTimeout(() => {
        // Switch tool with low interval
        player.autotoolFlagged = fastAbs(currentTick - player.autotoolLastSwitch) <= 2;
    }, 1);
}
function blockBreak(event: PlayerBreakBlockBeforeEvent) {
    const player = event.player;
    if (player.autotoolFlagged) {
        event.cancel = true;
        player.autotoolFlagged = false;
        const now = Date.now();
        player.autotoolLastFlag ??= 0;
        const flagInterval = now - player.autotoolLastFlag;
        if (flagInterval < 300000) system.run(() => player.flag("AutoTool", "A", "Player", { flagInterval }));
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
