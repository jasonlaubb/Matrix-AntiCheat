import { BlockVolume, PlayerBreakBlockAfterEvent, world } from "@minecraft/server";
import { get } from "../util/database";
import { text } from "../util/text";
import { sendAlert } from "../util/util";
export function oreAlertOn() {
    world.afterEvents.playerBreakBlock.subscribe(blockBreak);
}
export function oreAlertOff() {
    world.afterEvents.playerBreakBlock.unsubscribe(blockBreak);
}
const targetID = [
    "minecraft:diamond_ore",
    "minecraft:deepslate_diamond_ore",
    "minecraft:emerald_ore",
    "minecraft:deepslate_emerald_ore",
    "minecraft:ancient_debris",
    "minecraft:nether_gold_ore",
    "minecraft:gold_ore",
    "minecraft:deepslate_gold_ore",
    "minecraft:redstone_ore",
    "minecraft:deepslate_redstone_ore",
    "minecraft:lapis_ore",
    "minecraft:deepslate_lapis_ore",
];
function blockBreak(event: PlayerBreakBlockAfterEvent) {
    if (event.player.isOp()) return;
    const { x, y, z } = event.block.location;
    const blockId = event.brokenBlockPermutation.type.id;
    const now = Date.now();
    if (!targetID.includes(blockId)) return;
    const isDiamondOre = blockId.endsWith("diamond_ore");
    const antiXrayEnabled = get("antiXray");
    if (!antiXrayEnabled && isDiamondOre) {
        event.player.diamondFoundAmount ??= 0;
        const timeSinceLast = event.player.lastDiamondOresFound ? Math.floor((now - event.player.lastDiamondOresFound) / 1000) : -1;
        if (event.player.diamondFoundAmount > 0 && timeSinceLast < 60000) {
            // Do not alert repeatedly within 60 seconds (max)
            event.player.diamondFoundAmount--;
            return;
        }
        const diamondBlocks = event.dimension
            .getBlocks(
                new BlockVolume({ x: x + 3, y: y + 3, z: z + 3 }, { x: x - 3, y: y - 3, z: z - 3 }),
                {
                    includeTypes: ["minecraft:diamond_ore", "minecraft:deepslate_diamond_ore"],
                },
                true
            )
            .getBlockLocationIterator();
        let nearbyDiamondCount = 0;
        for (const _ of diamondBlocks) {
            nearbyDiamondCount++;
        }
        event.player.diamondFoundAmount = nearbyDiamondCount;
        sendAlert(`§7[§aOre Alert§7] §f` + text("oreAlertFoundDiamondOre", event.player.name, nearbyDiamondCount + 1, timeSinceLast));
        event.player.lastDiamondOresFound = now;
    } else {
        event.player.lastOreFoundData ??= {};
        const lastFoundTime = event.player.lastOreFoundData[blockId];
        const timeSinceLast = lastFoundTime ? now - lastFoundTime : Infinity;
        if (timeSinceLast >= 6000) {
            world.getAllPlayers().forEach((player) => {
                if (!player.isOp()) return;
                const timeAgo = lastFoundTime ? Math.floor(timeSinceLast / 1000) + "s" : "none";
                player.sendMessage(`§7[§aOre Alert§7] §f` + text("oreAlertOreFound", event.player.name, blockId.replace("minecraft:", "").replaceAll("_", ""), timeAgo));
            });
        }
        event.player.lastOreFoundData[blockId] = now;
    }
}
