import { PlayerInteractWithBlockBeforeEvent, system, world } from "@minecraft/server";
import { calculateRelativeViewAngle, distanceXZ } from "../util/mathUtil";
export default {
    enable() {
        world.beforeEvents.playerInteractWithBlock.subscribe(interact);
    },
    disable() {
        world.beforeEvents.playerInteractWithBlock.unsubscribe(interact);
    }
}
function interact (event: PlayerInteractWithBlockBeforeEvent) {
    if (event.block.typeId !== "minecraft:chest" || distanceXZ(event.player.location, event.block.location) < 2) return;
    const angle = calculateRelativeViewAngle(event.player.location, event.block.center(), event.player.getRotation().y);
    system.run(() => event.player.sendMessage(angle.toString()));
    if (angle > (event.player.inputInfo.lastInputModeUsed === "Touch" ? 120 : 30)) {
        event.cancel = true;
        system.run(() => event.player.flag("ChestAura", "A", "Player", { angle: angle.toFixed(2) }));
    }
}