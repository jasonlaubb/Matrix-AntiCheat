import { EntityHitBlockAfterEvent, ItemEnchantsComponent, Player, PlayerBreakBlockBeforeEvent, system, world } from "@minecraft/server"
import fastBrokenBlocks from "../../Data/FastBrokenBlocks"
import { c, flag, isAdmin, isTargetGamemode } from "../../Assets/Util"
import { MinecraftBlockTypes, MinecraftEffectTypes, MinecraftEnchantmentTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

const antiFastBreak = (event: PlayerBreakBlockBeforeEvent) => {
    const { player, block, itemStack } = event
    if (isAdmin(player) || block.isAir || player.hasTag("matrix:break-disabled") || isTargetGamemode(player, 1)) return;
    const config = c()
    const { typeId } = itemStack

    const hasEfficiency = itemStack.getComponent(ItemEnchantsComponent.componentId).enchantments.hasEnchantment(MinecraftEnchantmentTypes.Efficiency) != 0

    if (!typeId.startsWith("minecraft:") || hasEfficiency || player.getEffect(MinecraftEffectTypes.Haste) || fastBrokenBlocks.includes(typeId as MinecraftBlockTypes)) return;

    let speedLimit = config.antiFastBreak.maxBPS

    if (config.antiFastBreak.toolType.some((ends) => typeId.endsWith(ends))) {
        speedLimit = (config.antiFastBreak.matchType as { [key: string]: number })[typeId.replace("minecraft:", "").split("_")[0]] ?? 4
    }

    const breakBPS = 1 / (Date.now() - player.lastTouchBlock / 1000)

    if (breakBPS > speedLimit) {
        event.cancel = true
        player.addTag("matrix:break-disabled")
        system.runTimeout(() => {
            player.removeTag("matrix:break-disabled")
        }, 60)
        flag (player, "Fast Break", "A", config.antiFastBreak.maxVL, config.antiFastBreak.punishment, [lang(">BlockPerSecond") + ":" + breakBPS.toFixed(2)])
    }
}

const hitBlock = ({ damagingEntity: player }: EntityHitBlockAfterEvent) => player instanceof Player && (player.lastTouchBlock = Date.now())

export default {
    enable () {
        world.beforeEvents.playerBreakBlock.subscribe(antiFastBreak)
        world.afterEvents.entityHitBlock.subscribe(hitBlock)
    },
    disable () {
        world.beforeEvents.playerBreakBlock.unsubscribe(antiFastBreak)
        world.afterEvents.entityHitBlock.unsubscribe(hitBlock)
    }
}