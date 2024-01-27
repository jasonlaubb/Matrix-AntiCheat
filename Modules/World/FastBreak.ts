import { EntityHitBlockAfterEvent, ItemEnchantsComponent, Player, PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, system, world } from "@minecraft/server"
import fastBrokenBlocks from "../../Data/FastBrokenBlocks"
import { c, flag, isAdmin, isTargetGamemode } from "../../Assets/Util"
import { MinecraftBlockTypes, MinecraftEffectTypes, MinecraftEnchantmentTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb
 * @description Checks if player breaks block too fast.
 * Also, checks if player break block without start breaking block first.
 * It can detect most of the timer and insteaBreak hack.
 * The limit value is reference from RaMiGamerDev
 */

const antiFastBreak = (event: PlayerBreakBlockBeforeEvent) => {
    const { player, block, itemStack } = event
    if (isAdmin(player) || block.isAir || player.hasTag("matrix:break-disabled") || isTargetGamemode(player, 1)) return;
    const config = c()
    const typeId = itemStack?.typeId ?? "minecraft:air"

    const hasEfficiency = itemStack ? itemStack.getComponent(ItemEnchantsComponent.componentId).enchantments.hasEnchantment(MinecraftEnchantmentTypes.Efficiency) != 0 : false

    if (!typeId.startsWith("minecraft:") || hasEfficiency || player.getEffect(MinecraftEffectTypes.Haste) || fastBrokenBlocks.includes(typeId as MinecraftBlockTypes)) return;

    let speedLimit = config.antiFastBreak.maxBPS

    if (config.antiFastBreak.toolType.some((ends) => typeId.endsWith(ends))) {
        speedLimit = (config.antiFastBreak.matchType as { [key: string]: number })[typeId.replace("minecraft:", "").split("_")[0]] ?? 4
    }

    const breakBPS = 1 / (Date.now() - player.lastTouchBlock) * 1000

    if (breakBPS > speedLimit && !(config.antiFastBreak.solidOnly && !block.isSolid)) {
        event.cancel = true
        system.run(() => {
            player.addTag("matrix:break-disabled")
            flag (player, "Fast Break", "A", config.antiFastBreak.maxVL, config.antiFastBreak.punishment, [lang(">BlockPerSecond") + ":" + breakBPS.toFixed(2)])
        })
        system.runTimeout(() => {
            player.removeTag("matrix:break-disabled")
        }, 60)
    }//this is disabled until fix it
    /*else if (breakBPS < 11 && player.lastTouchBlockId != JSON.stringify(block.location) && block.isSolid) {
        event.cancel = true
        system.run(() => {
            player.addTag("matrix:break-disabled")
            flag (player, "Fast Break", "B", config.antiFastBreak.maxVL, config.antiFastBreak.punishment, undefined)
        })
        system.runTimeout(() => {
            player.removeTag("matrix:break-disabled")
        }, 100)
    }*/
}

const breakBlockAfter = ({ player }: PlayerBreakBlockAfterEvent) => player.lastTouchBlock = Date.now()
const hitBlock = ({ damagingEntity: player, hitBlock: { location } }: EntityHitBlockAfterEvent) => player instanceof Player && (player.lastTouchBlockId = JSON.stringify(location))

export default {
    enable () {
        world.beforeEvents.playerBreakBlock.subscribe(antiFastBreak)
        world.afterEvents.playerBreakBlock.subscribe(breakBlockAfter)
        world.afterEvents.entityHitBlock.subscribe(hitBlock)
    },
    disable () {
        world.beforeEvents.playerBreakBlock.unsubscribe(antiFastBreak)
        world.afterEvents.playerBreakBlock.unsubscribe(breakBlockAfter)
        world.afterEvents.entityHitBlock.unsubscribe(hitBlock)
    }
}
