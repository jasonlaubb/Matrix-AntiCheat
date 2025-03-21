const map = {
    ore: {
        "minecraft:coal_ore": "matrix:coal",
        "minecraft:iron_ore": "matrix:iron",
        "minecraft:gold_ore": "matrix:gold",
        "minecraft:diamond_ore": "matrix:diamond",
        "minecraft:redstone_ore": "matrix:redstone",
        "minecraft:lapis_ore": "matrix:lapis",
        "minecraft:emerald_ore": "matrix:emerald",
        "minecraft:copper_ore": "matrix:copper",
        "minecraft:quartz_ore": "matrix:quartz",
        "minecraft:nether_gold_ore": "matrix:nether_gold",
        "minecraft:ancient_debris": "matrix:netherite",
    },
    nore: {
        "minecraft:stone": "matrix:stone_ore",
        "minecraft:deepslate": "matrix:deepslate_ore",
        "minecraft:netherrack": "matrix:netherrack_ore",
    },
}
export default map;
export const stoneBlocks = Object.keys(map.nore).concat(Object.values(map.nore), [
    "minecraft:granite",
    "minecraft:diorite",
    "minecraft:andesite",
]);
export const oreBlocks = Object.keys(map.ore).concat(Object.values(map.ore));