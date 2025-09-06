import { Block, LocationOutOfWorldBoundariesError, PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockBeforeEvent, system, world } from "@minecraft/server";
import { getSurround } from "../util/util";
export default {
    property: "antiBreakerEnable",
    enable() {
        world.beforeEvents.playerBreakBlock.subscribe(interactOrBreak);
        world.beforeEvents.playerInteractWithBlock.subscribe(interactOrBreak);
    },
    disable() {
        world.beforeEvents.playerBreakBlock.unsubscribe(interactOrBreak);
        world.beforeEvents.playerInteractWithBlock.unsubscribe(interactOrBreak);
    },
};
function interactOrBreak(event: PlayerBreakBlockBeforeEvent | PlayerInteractWithBlockBeforeEvent) {
    if (event.block.isAir || event.player.isOp()) return;
    const now = Date.now();
    // To prevent false positive, stop checking breaker when player has jusr broken block
    if (!event.player.breakerLastBreak || now - event.player.breakerLastBreak > 100)
        if (event.block.typeId !== "minecraft:bed") {
            const surround = getSurround(event.block);
            if (surround.every((block) => block && (block.isSolid || isGlassBlock(block.typeId)))) {
                event.cancel = true;
                system.run(() => event.player.flag("Breaker", "A", "Block", { block: event.block.typeId }));
            }
        } else {
            const bedSide = getBedSide(event.block);
            if (bedSide) {
                if (surroundSolidCount(event.block) >= 5 && surroundSolidCount(bedSide) >= 5) {
                    event.cancel = true;
                    system.run(() => event.player.flag("Breaker", "B", "Block", { block: event.block.typeId }));
                }
            }
        }
    if (!event.cancel && event instanceof PlayerBreakBlockBeforeEvent) event.player.breakerLastBreak = Date.now();
}
function surroundSolidCount(block: Block) {
    return getSurround(block).filter((b) => b && (b.isSolid || isGlassBlock(b.typeId))).length;
}
function getBedSide(block: Block) {
    try {
        return getSurround(block).find((b) => b && b.typeId === "minecraft:bed");
    } catch (error) {
        if (error instanceof LocationOutOfWorldBoundariesError) return undefined;
        throw error;
    }
}
function isGlassBlock(typeId: string) {
    return typeId.startsWith("minecraft:") && typeId.endsWith("glass");
}
