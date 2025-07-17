import { PlayerBreakBlockBeforeEvent, system, world } from "@minecraft/server";
export default {
    enable() {
        world.beforeEvents.playerBreakBlock.subscribe(blockBreak);
    },
    disable() {
        world.beforeEvents.playerBreakBlock.unsubscribe(blockBreak);
    },
    property: "antiExtinguisherEnable",
};
function blockBreak(event: PlayerBreakBlockBeforeEvent) {
    const {
        block: { typeId },
        player,
    } = event;
    if (typeId === "minecraft:fire") {
        event.cancel = true;
        system.run(() => player.flag("Extinguisher", "A", "Player", { block: typeId }));
    }
}
