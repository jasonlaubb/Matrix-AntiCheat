import { EntityHitBlockAfterEvent, InputMode, Player, PlayerBreakBlockBeforeEvent, PlayerHotbarSelectedSlotChangeAfterEvent, system, world } from "@minecraft/server";
import { get } from "../util/database";
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
    if (!(player instanceof Player) || (get("antiAutoToolIgnoreKeyboardInput") && player.inputInfo.lastInputModeUsed === InputMode.KeyboardAndMouse)) return;
    const currentTick = system.currentTick;
    system.runTimeout(() => {
        // Switch tool with low interval
        player.autotoolFlagged = Math.abs(currentTick - player.autotoolLastSwitch) <= 2;
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
function hotBarEvent({ player }: PlayerHotbarSelectedSlotChangeAfterEvent) {
    player.autotoolLastSwitch = system.currentTick;
}