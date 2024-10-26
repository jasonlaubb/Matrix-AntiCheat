import { Block, Player, PlayerBreakBlockBeforeEvent, system, world, ItemStack, ItemEnchantableComponent, GameMode } from "@minecraft/server";
import { recoverBlockBreak } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEnchantmentTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import fastBrokenBlocks from "../../Data/FastBrokenBlocks";
import { configi, registerModule } from "../Modules";
import { DisableTags } from "../../Data/EnumData";
import flag from "../../Assets/flag";
import { Action } from "../../Assets/Action";

const blockBreakData = new Map<string, number[]>();

/**
 * @author jasonlaubb
 * @description This checks if a player is using Nuker in Minecraft Bedrock.
 * it detects if a player breaks more than 5 blocks in a tick.
 */

async function AntiNuker(player: Player, block: Block, itemStack: ItemStack, config: configi) {
    if (player.hasTag(DisableTags.break) || block?.isAir || player.getGameMode() == GameMode.creative) {
        return;
    }

    const timeNow = Date.now();

    //get the block break count in the 1 tick
    let blockBreakCount: number[] = blockBreakData.get(player.id)?.filter((time) => timeNow - time < 50) ?? [];
    let hasEfficiency: number;
    // Thank you mojang, you add more case for throw
    try {
        hasEfficiency = itemStack.getComponent(ItemEnchantableComponent.componentId)!.getEnchantment(MinecraftEnchantmentTypes.Efficiency)!.level;
    } catch {
        hasEfficiency = 0;
    }
    //if the block not the fast broken block, push the block right now
    if (!fastBrokenBlocks.includes(block.typeId as MinecraftBlockTypes)) {
        blockBreakCount.push(timeNow);
    }

    blockBreakData.set(player.id, blockBreakCount);

    // if block break is in 1 tick is higher than the limit, flag them
    if (blockBreakCount.length > config.antiNuker.maxBreakPerTick && !(config.antiNuker.solidOnly && !block.isSolid)) {
        system.run(() => {
            block.dimension.getEntities({ location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item" }).forEach((item) => item.kill());
            block.setPermutation(Object.assign({}, block.permutation));

            //prevent the player from breaking blocks for 3 seconds
            Action.timeout(player, 60);
            recoverBlockBreak(player.id, 200, player.dimension);
            blockBreakData.delete(player.id);
            if (hasEfficiency <= 2) {
                flag(player, config.antiNuker.modules, "A");
            }
        });
    }
}

registerModule("antiNuker", false, [blockBreakData], {
    worldSignal: world.beforeEvents.playerBreakBlock,
    then: async (config, { player, block, itemStack }: PlayerBreakBlockBeforeEvent) => AntiNuker(player, block, itemStack!, config),
});
