import { BlockVolume, PlayerBreakBlockAfterEvent, world } from "@minecraft/server";
export function oreAlertOn () {
    world.afterEvents.playerBreakBlock.subscribe(blockBreak);
}
export function oreAlertOff () {
    world.afterEvents.playerBreakBlock.unsubscribe(blockBreak);
}
function blockBreak (event: PlayerBreakBlockAfterEvent) {
    const { x, y, z } = event.block.location;
    if (event.brokenBlockPermutation.type.id === "minecraft:diamond_ore") {
        event.player.diamondFoundAmount ??= 0;
        if (event.player.diamondFoundAmount > 0) {
            event.player.diamondFoundAmount--;
            return;
        };
        const diamondInRange = event.dimension.getBlocks(new BlockVolume({ x: x + 3, y: y + 3, z: z + 3 }, { x: x - 3, y: y - 3, z: z - 3 }), {
            includeTypes: ["minecraft:diamond_ore"],
        }, true).getBlockLocationIterator();
        for (const _ of diamondInRange) {
            event.player.diamondFoundAmount++;
        }
        world.getAllPlayers().forEach((player) => {
            if (!player.isOp()) return;
            player.sendMessage(`§7[§aMatrix§7] §fOre Alert >> §e${event.player.name} found new diamond ore(s) §b[size=${event.player.diamondFoundAmount + 1}]`);
        });
    }
}