import {
    Block,
    Player,
    PlayerBreakBlockBeforeEvent,
    PlayerLeaveAfterEvent,
    system,
    world,
    ItemStack,
    ItemEnchantableComponent
} from "@minecraft/server";
import { flag, isAdmin, c, recoverBlockBreak, isTargetGamemode } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEnchantmentTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import fastBrokenBlocks from "../../Data/FastBrokenBlocks";
import lang from "../../Data/Languages/lang";

const blockBreakData = new Map<string, number[]>();

/**
 * @author jasonlaubb
 * @description This checks if a player is using Nuker in Minecraft Bedrock.
 * it detects if a player breaks more than 5 blocks in a tick.
 */

async function AntiNuker (player: Player, block: Block, itemStack: ItemStack) {
    if (player.hasTag("matrix:break-disabled") || block?.isAir || isTargetGamemode(player, 1)) {
        return;
    }
    const config = c()
    
    const timeNow = Date.now();

    //get the block break count in the 1 tick
    let blockBreakCount: number[] = blockBreakData.get(player.id)?.filter(time => timeNow - time < 50) ?? [];
    let hasEfficiency: number
    // Thank you mojang, you add more case for throw
    try {
        hasEfficiency = itemStack.getComponent(ItemEnchantableComponent.componentId).getEnchantment(MinecraftEnchantmentTypes.Efficiency).level
    } catch {
        hasEfficiency = 0
    }
    //if the block not the fast broken block, push the block right now
    if (!fastBrokenBlocks.includes(block.typeId as MinecraftBlockTypes)) {
        blockBreakCount.push(timeNow);
    };

    blockBreakData.set(player.id, blockBreakCount);

    //if block break is in 1 tick is higher than the limit, flag them
    if (blockBreakCount.length > config.antiNuker.maxBreakPerTick && !(config.antiNuker.solidOnly && !block.isSolid)) {
        system.run(() => {
            player.addTag("matrix:break-disabled");
            block.dimension.getEntities({ location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item" }).forEach((item) => item.kill() )
            block.setPermutation(block.permutation.clone())

            //prevent the player from breaking blocks for 3 seconds
            system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiNuker.timeout);
            recoverBlockBreak(player.id, 200, player.dimension)
            blockBreakData.delete(player.id); 
            if (hasEfficiency <= 2) {
                flag(player, "Nuker", "A", config.antiNuker.maxVL, config.antiNuker.punishment, [lang(">Block") + ":" + block.typeId]);
            } 
        })
    }


}

const antiNuker = (event: PlayerBreakBlockBeforeEvent) => {
    const { player, block, itemStack } = event;
    if (isAdmin (player)) return;

    AntiNuker (player, block, itemStack)
};

const playerLeave = (({ playerId }: PlayerLeaveAfterEvent) => {
    blockBreakData.delete(playerId);
})

export default {
    enable () {
        world.beforeEvents.playerBreakBlock.subscribe(antiNuker)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        blockBreakData.clear()
        world.beforeEvents.playerBreakBlock.unsubscribe(antiNuker)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
