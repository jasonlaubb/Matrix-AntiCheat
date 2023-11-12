import { system, world, Player } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

const fastBrokenBlocks = new Set(["minecraft:yellow_flower", "minecraft:red_flower", "minecraft:double_plant",
"minecraft:wither_rose", "minecraft:tallgrass", "minecraft:hanging_roots", "minecraft:leaves",
"minecraft:leaves2", "minecraft:azalea_leaves", "minecraft:azalea_leaves_flowered", "minecraft:deadbush",
"minecraft:cocoa", "minecraft:chorus_plant", "minecraft:chorus_flower", "minecraft:cave_vines",
"minecraft:cave_vines_body_with_berries", "minecraft:cave_vines_head_with_berries",
"minecraft:glow_berries", "minecraft:carrots", "minecraft:cactus", "minecraft:big_dripleaf",
"minecraft:beetroot", "minecraft:bamboo", "minecraft:bamboo_sapling", "minecraft:azalea",
"minecraft:flowering_azalea", "minecraft:waterlily", "minecraft:melon_block", "minecraft:melon_stem",
"minecraft:potatoes", "minecraft:pumpkin", "minecraft:carved_pumpkin", "minecraft:pumpkin_stem",
"minecraft:sapling", "minecraft:seagrass", "minecraft:small_dripleaf_block", "minecraft:spore_blossom",
"minecraft:reeds", "minecraft:sweet_berry_bush", "minecraft:sweet_berries", "minecraft:vine",
"minecraft:wheat", "minecraft:kelp", "minecraft:crimson_fungus", "minecraft:warped_fungus",
"minecraft:glow_lichen", "minecraft:brown_mushroom", "minecraft:red_mushroom", "minecraft:nether_wart",
"minecraft:nether_sprouts", "minecraft:crimson_roots", "minecraft:warped_roots", "minecraft:twisting_vines",
"minecraft:weeping_vines", "minecraft:slime", "minecraft:redstone_wire", "minecraft:unpowered_repeater",
"minecraft:powered_repeater", "minecraft:unpowered_comparator", "minecraft:powered_comparator"] as MinecraftBlockTypes[]);

const blockBreakData = new Map<string, number[]>();

/**
 * @author jasonlaubb
 * @description This checks if a player is using Nuker in Minecraft Bedrock.
 * it detects if a player breaks more than 5 blocks in a tick.
 */

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const toggle: boolean = (world.getDynamicProperty("antiNuker") ?? config.antiNuker.enabled) as boolean;
    if (toggle !== true) return;

    const { player, block } = event;
    if (isAdmin (player) || !toggle) return;

    if (player.hasTag("matrix:break-disabled")) {
        block.dimension.getEntities({ location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item" }).forEach((item) => { item.kill() })
        block.setPermutation(block.permutation.clone())
        return
    }

    const timeNow = Date.now();

    //get the block break count in the 1 tick
    let blockBreakCount: number[] = blockBreakData.get(player.id)?.filter(time => timeNow - time < 50) ?? [];

    if (!fastBrokenBlocks.has(block.typeId as MinecraftBlockTypes)) {
        blockBreakCount.push(Date.now());
    };

    blockBreakData.set(player.id, blockBreakCount);

    if (blockBreakCount.length > config.antiNuker.maxBreakPerTick) {
        player.addTag("matrix:break-disabled");
        block.dimension.getEntities({ location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item" }).forEach((item) => { item.kill() })
        block.setPermutation(block.permutation.clone())

        //prevent the player from breaking blocks for 3 seconds
        system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiNuker.timeout);

        blockBreakData.delete(player.id);
        flag(player, "Nuker", config.antiNuker.punishment, ["block:" + block.typeId.replace("minecraft:","")]);
    }
});

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const player: Player = event.player;
    if (player.hasTag("matrix:break-disabled")) {
        event.cancel = true
    }
})

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    player.removeTag("matrix:break-disabled");
})

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    blockBreakData.delete(playerId);
})
