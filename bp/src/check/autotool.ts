import { EntityHitBlockAfterEvent, InputMode, Player, PlayerBreakBlockBeforeEvent, PlayerHotbarSelectedSlotChangeAfterEvent, system, world } from "@minecraft/server";
import { get } from "../util/database";
import { text } from "../util/text";
export default {
    property: "antiAutotoolEnable",
    enable: () => {
        world.afterEvents.entityHitBlock.subscribe(hitBlock);
        world.beforeEvents.playerBreakBlock.subscribe(blockBreak);
        world.afterEvents.playerHotbarSelectedSlotChange.subscribe(hotBarEvent);
    },
    disable: () => {
        world.afterEvents.entityHitBlock.unsubscribe(hitBlock);
        world.beforeEvents.playerBreakBlock.unsubscribe(blockBreak);
        world.afterEvents.playerHotbarSelectedSlotChange.unsubscribe(hotBarEvent);
    },
};
function hitBlock({ damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (!(player instanceof Player) || player.isOp() || (get("antiAutoToolIgnoreKeyboardInput") && player.inputInfo.lastInputModeUsed === InputMode.KeyboardAndMouse)) return;
    const currentTick = system.currentTick;
    player.autotoolLastSwitch ??= player.selectedSlotIndex; // Prevent special false positive
    system.runTimeout(() => {
        // Switch tool in the same tick
        player.autotoolFlagged = currentTick === player.autotoolLastSwitch;
    }, 1);
}
function blockBreak(event: PlayerBreakBlockBeforeEvent) {
    const player = event.player;
    if (player.autotoolFlagged && player.isOp()) {
        event.cancel = true;
        player.autotoolFlagged = false;
        const now = Date.now();
        player.autotoolLastFlag ??= 0;
        const flagInterval = now - player.autotoolLastFlag;
        if (flagInterval < get("antiAutoToolMinFlagInterval"))
            system.run(() => {
                if (get("antiAutoToolKickOnly")) {
                    player.kick(text("flagUnfairAdvantage"));
                } else {
                    player.flag("AutoTool", "A", "Player", { flagInterval });
                }
            });
        player.autotoolLastFlag = now;
    }
}
function hotBarEvent({ player }: PlayerHotbarSelectedSlotChangeAfterEvent) {
    player.autotoolLastSwitch = system.currentTick;
}
