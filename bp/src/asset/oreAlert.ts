import { BlockVolume, PlayerBreakBlockAfterEvent, world } from "@minecraft/server";
import { get } from "../util/database";
export function oreAlertOn () {
    world.afterEvents.playerBreakBlock.subscribe(blockBreak);
}
export function oreAlertOff () {
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
  "minecraft:deepslate_lapis_ore"
];
function blockBreak (event: PlayerBreakBlockAfterEvent) {
    const { x, y, z } = event.block.location;
    const id = event.brokenBlockPermutation.type.id;
    const now = Date.now();
    if (targetID.includes(id) && !(!get("antiXray") && id.endsWith("diamond_ore"))) {
        event.player.lastOreFoundData ??= {};
        if (!event.player.lastOreFoundData[id] || now - event.player.lastOreFoundData[id] >= 6000) { 
            world.getAllPlayers().forEach((player) => {
                if (!player.isOp()) return;
                player.sendMessage(`§7[§aOre Alert§7] §e${event.player.name} §fhas just found and broken §e${id.replace("minecraft:", "").replace("_", " ")} §b[interval=${event.player.lastOreFoundData[id] ? Math.floor((now - event.player.lastOreFoundData[id]) / 1000) + "s" : "none"}]`);
            });
        }
        event.player.lastOreFoundData[id] = now;
    }
    if (id === "minecraft:diamond_ore" && !get("antiXray")) {
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
            player.sendMessage(`§7[§aOre Alert§7] §e${event.player.name}§f found §anew§f piece of §ediamond ore(s) §b[size=${event.player.diamondFoundAmount + 1},interval=${event.player.lastDiamondOresFound ? Math.floor((now - event.player.lastDiamondOresFound) / 1000) + "s" : "none"}]`);
        });
        event.player.lastDiamondOresFound = now;
    }
}