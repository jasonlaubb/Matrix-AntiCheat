import {
    Block,
    GameMode,
    Player,
    system,
    world
} from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import fastBrokenBlocks from "../../Data/FastBrokenBlocks";
import lang from "../../Data/Languages/lang";

const blockBreakData = new Map<string, number[]>();

/**
 * @author jasonlaubb
 * @description This checks if a player is using Nuker in Minecraft Bedrock.
 * it detects if a player breaks more than 5 blocks in a tick.
 */

async function antiNuker (player: Player, block: Block) {
    if (player.hasTag("matrix:break-disabled")) {
        return;
    }
    
    const timeNow = Date.now();

    //get the block break count in the 1 tick
    let blockBreakCount: number[] = blockBreakData.get(player.id)?.filter(time => timeNow - time < 50) ?? [];

    //if the block not the fast broken block, push the block right now
    if (!fastBrokenBlocks.includes(block.typeId as MinecraftBlockTypes)) {
        blockBreakCount.push(timeNow);
    };

    blockBreakData.set(player.id, blockBreakCount);

    //if block break is in 1 tick is higher than the limit, flag them
    if (blockBreakCount.length > config.antiNuker.maxBreakPerTick) {
        player.addTag("matrix:break-disabled");
        block.dimension.getEntities({ location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item" }).forEach((item) => item.kill() )
        block.setPermutation(block.permutation.clone())

        //prevent the player from breaking blocks for 3 seconds
        system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiNuker.timeout);
        player.runCommand('gamemode @s ' + GameMode.adventure)
        blockBreakData.delete(player.id);
        flag(player, "Nuker", "A", config.antiNuker.maxVL, config.antiNuker.punishment, [lang(">Block") + ":" + block.typeId]);
    }
}

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const toggle: boolean = (world.getDynamicProperty("antiNuker") ?? config.antiNuker.enabled) as boolean;
    if (toggle !== true) return;

    const { player, block } = event;
    if (isAdmin (player)) return;

    antiNuker (player, block)
});

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const { player, block } = event

    if (player.hasTag("matrix:break-disabled")) {
        block.dimension.getEntities({ location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item" }).forEach((item) => { item.kill() })
        block.setPermutation(block.permutation.clone())
    }
})

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { player } = event
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