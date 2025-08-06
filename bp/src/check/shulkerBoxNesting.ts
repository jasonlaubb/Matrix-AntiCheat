import { Block, PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockBeforeEvent, PlayerPlaceBlockAfterEvent, system, world } from "@minecraft/server";
export default {
    property: "antiShulkerBoxNesting",
    enable: () => {
        world.beforeEvents.playerBreakBlock.subscribe(blockBreak);
        world.beforeEvents.playerInteractWithBlock.subscribe(blockInteract);
        world.afterEvents.playerPlaceBlock.subscribe(blockPlace);
    },
    disable: () => {
        world.beforeEvents.playerBreakBlock.unsubscribe(blockBreak);
        world.beforeEvents.playerInteractWithBlock.unsubscribe(blockInteract);
        world.afterEvents.playerPlaceBlock.unsubscribe(blockPlace);
    },
};
function blockBreak(event: PlayerBreakBlockBeforeEvent) {
    const block = event.block;
    if (block.typeId.startsWith("minecraft:") && block.typeId.endsWith("_shulker_box")) {
        const data = getShulkerBoxIndex(block);
        if (data && data.index.length > 0) {
            event.cancel = true;
            system.run(() => {
                data.index.forEach((index) => data.blockContainer.setItem(index)); // Remove the shulker box item
                const itemStack = block.getItemStack(1, true);
                block.setType("minecraft:air");
                if (itemStack) block.dimension.spawnItem(itemStack, block.center()); // Spawn the item
            });
        }
    }
}
function blockInteract(event: PlayerInteractWithBlockBeforeEvent) {
    const block = event.block;
    if (block.typeId.startsWith("minecraft:") && block.typeId.endsWith("_shulker_box")) {
        const data = getShulkerBoxIndex(block);
        if (data && data.index.length > 0) {
            event.cancel = true;
            system.run(() => {
                data.index.forEach((index) => data.blockContainer.setItem(index)); // Remove the shulker box item
            });
        }
    }
}
function blockPlace(event: PlayerPlaceBlockAfterEvent) {
    const block = event.block;
    if (block.typeId.startsWith("minecraft:") && block.typeId.endsWith("_shulker_box")) {
        const data = getShulkerBoxIndex(block);
        if (data && data.index.length > 0) {
            data.index.forEach((index) => data.blockContainer.setItem(index)); // Remove the shulker box item
        }
    }
}
function getShulkerBoxIndex(block: Block) {
    const blockContainer = block.getComponent("inventory")?.container;
    if (!blockContainer) return;
    let shulkerBoxIndex: number[] = [];
    for (let i = 0; i < blockContainer.size; i++) {
        const item = blockContainer.getItem(i);
        if (item && item.typeId.startsWith("minecraft:") && item.typeId.endsWith("_shulker_box")) {
            shulkerBoxIndex.push(i);
        }
    }
    return { index: shulkerBoxIndex, blockContainer };
}
