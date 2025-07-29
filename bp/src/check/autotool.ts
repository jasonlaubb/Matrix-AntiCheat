import { EntityHitBlockAfterEvent, InputMode, Player, system, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import { get } from "../util/database";
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
    const now = Date.now();
    const interval = now - player.autotoolLastSwitch;
    if (interval <= 1) {
        if (!get("antiAutoToolIgnoreKeyboardInput") && player.inputInfo.lastInputModeUsed === InputMode.KeyboardAndMouse) {
            const safeIndex = player.autotoolSafeIndex;
            system.runTimeout(() => player.selectedSlotIndex = safeIndex, 1);
            if (player.autotoolLastFlag && now - player.autotoolLastFlag < 30000) {
                player.flag("AutoTool", "A", "Player", { interval });
            }
            player.autotoolLastFlag = now;
        } else player.flag("AutoTool", "A", "Player", { interval });
    }
}
function tickEvent (player: Player) {
    player.autotoolLastIndex ??= 0;
    if (player.autotoolLastIndex !== player.selectedSlotIndex) {
        player.autotoolSafeIndex = player.autotoolLastIndex;
        player.autotoolLastSwitch = Date.now();
    }
    player.autotoolLastIndex = player.selectedSlotIndex;
}