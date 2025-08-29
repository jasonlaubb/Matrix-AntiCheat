import { EntityHitBlockAfterEvent, InputMode, Player, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import { get } from "../util/database";
export default {
    property: "antiAutotoolEnable",
    enable: () => {
        world.afterEvents.entityHitBlock.subscribe(hitBlock);
        addCheckInterval("autotool", tickEvent);
    },
    disable: () => {
        world.afterEvents.entityHitBlock.unsubscribe(hitBlock);
        removeCheckInterval("autotool");
    },
};
function hitBlock({ damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (!(player instanceof Player)) return;
    const now = Date.now();
    const interval = now - player.autotoolLastSwitch;
    if (interval <= 1) {
        if (!get("antiAutoToolIgnoreKeyboardInput") || player.inputInfo.lastInputModeUsed !== InputMode.KeyboardAndMouse) {
            player.flag("AutoTool", "A", "Player", { interval });
        }
    }
}
function tickEvent(player: Player) {
    player.autotoolLastIndex ??= 0;
    if (player.autotoolLastIndex !== player.selectedSlotIndex) {
        player.autotoolSafeIndex = player.autotoolLastIndex;
        player.autotoolLastSwitch = Date.now();
    }
    player.autotoolLastIndex = player.selectedSlotIndex;
}
