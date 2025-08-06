import { BlockVolumeBase, PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockAfterEvent, PlayerPlaceBlockAfterEvent, system, world } from "@minecraft/server";
function blockBreak (event: PlayerBreakBlockBeforeEvent) {
    const block = event.block;
    if (block.typeId.startsWith("minecraft:") && block.typeId.endsWith("_shulker_box")) {
        const blockContainer = block.getComponent("inventory")?.container;
        if (!blockContainer) return;
        let shulkerBoxIndex: number[] = [];
        for (let i = 0; i < blockContainer.size; i++) {
            const item = blockContainer.getItem(i);
            if (item && item.typeId.startsWith("minecraft:") && item.typeId.endsWith("_shulker_box")) {
                shulkerBoxIndex.push(i);
            }
        }
        if (shulkerBoxIndex.length > 0) {
            event.cancel = true;
            system.run(() => {
                shulkerBoxIndex.forEach(index => blockContainer.setItem(index)); // Remove the shulker box item
                const itemStack = block.getItemStack(1, true);
                block.setType("minecraft:air");
                if (itemStack) block.dimension.spawnItem(itemStack, block.center());
            })
        }
    }
}
