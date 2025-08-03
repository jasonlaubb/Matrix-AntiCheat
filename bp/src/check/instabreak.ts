import { Dimension, EntityHitBlockAfterEvent, ItemStack, Player, PlayerBreakBlockAfterEvent, system, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import type { BrokenBlockList, InstabreakData } from "../../../global";
const MAX_BREAK_IN_TICK = 6;
/**
 * @author jasonlaubb
 * @description The module against insteabreak hack. These types of hack is not working on the realm and bds server.
 */
function onBlockBreak({ player, brokenBlockPermutation, itemStackBeforeBreak: tool, block }: PlayerBreakBlockAfterEvent) {
    if (player.isOp() || brokenBlockPermutation.type.id === "minecraft:air" || brokenBlockPermutation.type.id === "minecraft:netherrack") return;
    player.breakData.brokenBlocks.push({ blockPermutation: brokenBlockPermutation, blockPosition: block.location });
    const usingTool = tool && isTool(tool);
    if (
        !(player.getEffect("minecraft:haste") && usingTool) ||
        (usingTool && (tool.getComponent("enchantable")?.getEnchantment("minecraft:efficiency")?.level ?? 0) >= 2 && INSTA_BREAKABLE_SET.has(brokenBlockPermutation.type.id))
    ) {
        player.breakData.brokenAmount++;
        if (Date.now() > player.breakData.startBreakingTime) player.breakData.flagInsteaBreak = true;
    }
}
function onPlayerHitBlock({ damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (player instanceof Player && !player.isOp()) {
        player.breakData.startBreakingTime = Date.now();
    }
}
function tickEvent(player: Player) {
    if (player.breakData.brokenBlocks.length == 0) return;
    if (player.breakData.brokenAmount > MAX_BREAK_IN_TICK || player.breakData.flagInsteaBreak) {
        // Recover the blocks
        system.runJob(recoverBlocks(player.breakData.brokenBlocks, player.dimension));
        player.flag("Insteabreak", "A", "World", { type: player.breakData.flagInsteaBreak ? "instabreak" : "nuking", breakAmount: player.breakData.brokenAmount });
    }
    player.breakData = DEFAULT_BREAK_DATA;
}
function isTool(itemStack: ItemStack) {
    TOOL_SET.has(itemStack.type.id);
}
function* recoverBlocks(blocks: BrokenBlockList, dimension: Dimension) {
    for (const { blockPermutation, blockPosition } of blocks) {
        dimension.setBlockPermutation(blockPosition, blockPermutation);
        dimension
            .getEntities({
                location: blockPosition,
                type: "minecraft:item",
                maxDistance: 2,
                minDistance: 0,
            })
            .forEach((item) => item.kill());
        yield;
    }
}
const TOOL_SET = new Set([
    "minecraft:wooden_axe",
    "minecraft:stone_axe",
    "minecraft:iron_axe",
    "minecraft:golden_axe",
    "minecraft:diamond_axe",
    "minecraft:netherite_axe",
    "minecraft:wooden_pickaxe",
    "minecraft:stone_pickaxe",
    "minecraft:iron_pickaxe",
    "minecraft:golden_pickaxe",
    "minecraft:diamond_pickaxe",
    "minecraft:netherite_pickaxe",
    "minecraft:wooden_shovel",
    "minecraft:stone_shovel",
    "minecraft:iron_shovel",
    "minecraft:golden_shovel",
    "minecraft:diamond_shovel",
    "minecraft:netherite_shovel",
    "minecraft:wooden_hoe",
    "minecraft:stone_hoe",
    "minecraft:iron_hoe",
    "minecraft:golden_hoe",
    "minecraft:diamond_hoe",
    "minecraft:netherite_hoe",
]);
const INSTA_BREAKABLE_SET = new Set([
    "minecraft:stone",
    "minecraft:granite",
    "minecraft:diorite",
    "minecraft:andesite",
    "minecraft:sandstone",
    "minecraft:quartz_block",
    "minecraft:deepslate",
    "minecraft:dirt",
    "minecraft:grass_block",
    "minecraft:sand",
    "minecraft:obsidian",
    "minecraft:crying_obsidian",
    "minecraft:oak_log",
    "minecraft:birch_log",
    "minecraft:spruce_log",
    "minecraft:jungle_log",
    "minecraft:acacia_log",
    "minecraft:dark_oak_log",
    "minecraft:oak_wood",
    "minecraft:birch_wood",
    "minecraft:spruce_wood",
    "minecraft:jungle_wood",
    "minecraft:acacia_wood",
    "minecraft:dark_oak_wood",
    "minecraft:anvil",
    "minecraft:diamond_block",
    "minecraft:gold_block",
    "minecraft:iron_block",
    "minecraft:lapis_block",
    "minecraft:redstone_block",
    "minecraft:netherite_block",
    "minecraft:coal_ore",
    "minecraft:iron_ore",
    "minecraft:gold_ore",
    "minecraft:redstone_ore",
    "minecraft:diamond_ore",
    "minecraft:copper_ore",
    "minecraft:emerald_ore",
    "minecraft:quartz_ore",
    "minecraft:deepslate_coal_ore",
    "minecraft:deepslate_iron_ore",
    "minecraft:deepslate_gold_ore",
    "minecraft:deepslate_redstone_ore",
    "minecraft:deepslate_diamond_ore",
    "minecraft:deepslate_copper_ore",
    "minecraft:deepslate_emerald_ore",
    "minecraft:deepslate_lapis_ore",
    "minecraft:lapis_ore",
    "minecraft:ancient_debris",
]);
const DEFAULT_BREAK_DATA = {
    brokenBlocks: [],
    startBreakingTime: 0,
    brokenAmount: 0,
    flagInsteaBreak: false,
} as InstabreakData;
export default {
    property: "antiInstabreakEnable",
    enable: () => {
        world.afterEvents.playerBreakBlock.subscribe(onBlockBreak);
        addCheckInterval(tickEvent);
        world.afterEvents.entityHitBlock.subscribe(onPlayerHitBlock);
    },
    disable: () => {
        world.afterEvents.playerBreakBlock.unsubscribe(onBlockBreak);
        removeCheckInterval(tickEvent);
        world.afterEvents.entityHitBlock.unsubscribe(onPlayerHitBlock);
    }
}