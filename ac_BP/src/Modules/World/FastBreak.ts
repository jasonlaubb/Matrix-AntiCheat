import { EntityHitBlockAfterEvent, ItemEnchantableComponent, Player, PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, system, world } from "@minecraft/server";
import fastBrokenBlocks from "../../Data/FastBrokenBlocks";
import { flag, isAdmin, isTargetGamemode } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEffectTypes, MinecraftEnchantmentTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { registerModule, configi } from "../Modules.js";
import { DisableTags } from "../../Data/EnumData";

/**
 * @author jasonlaubb
 * @description Checks if player breaks block too fast.
 * Also, checks if player break block without start breaking block first.
 * It can detect most of the timer and insteaBreak hack.
 * The limit value is reference from RaMiGamerDev
 */

function firstEvent(config: configi, event: PlayerBreakBlockBeforeEvent) {
    const { player, block, itemStack } = event;
    if (isAdmin(player) || block.isAir || player.hasTag(DisableTags.break) || isTargetGamemode(player, 1)) return;
    const typeId = itemStack?.typeId ?? "minecraft:air";

    const hasEfficiency = itemStack ? itemStack?.getComponent(ItemEnchantableComponent.componentId)?.hasEnchantment(MinecraftEnchantmentTypes.Efficiency) : false;

    if (!typeId.startsWith("minecraft:") || hasEfficiency || player.getEffect(MinecraftEffectTypes.Haste) || fastBrokenBlocks.includes(typeId as MinecraftBlockTypes)) return;

    let speedLimit = config.antiFastBreak.maxBPS;

    if (config.antiFastBreak.toolType.some((ends) => typeId.endsWith(ends))) {
        speedLimit = (config.antiFastBreak.matchType as { [key: string]: number })[typeId.replace("minecraft:", "").split("_")[0]] ?? 4;
    }

    const breakBPS = (1 / (Date.now() - player.lastTouchBlock)) * 1000;

    if (breakBPS > speedLimit && !(config.antiFastBreak.solidOnly && !block.isSolid)) {
        event.cancel = true;
        system.run(() => {
            player.addTag(DisableTags.break);
            flag(player, "Fast Break", "A", config.antiFastBreak.maxVL, config.antiFastBreak.punishment, ["BlockPerSecond" + ":" + breakBPS.toFixed(2)]);
        });
        system.runTimeout(() => {
            player.removeTag(DisableTags.break);
        }, 60);
    } //this is disabled until fix it
    /*else if (breakBPS < 11 && player.lastTouchBlockId != JSON.stringify(block.location) && block.isSolid) {
        event.cancel = true
        system.run(() => {
            player.addTag(DisableTags.break)
            flag (player, "Fast Break", "B", config.antiFastBreak.maxVL, config.antiFastBreak.punishment, undefined)
        })
        system.runTimeout(() => {
            player.removeTag(DisableTags.break)
        }, 100)
    }*/
}

const doubleEvent = ({ player }: PlayerBreakBlockAfterEvent) => (player.lastTouchBlock = Date.now());
const tripleEvent = ({ damagingEntity: player, hitBlock: { location } }: EntityHitBlockAfterEvent) => player instanceof Player && (player.lastTouchBlockId = JSON.stringify(location));

registerModule(
    "antiFastBreak",
    false,
    [],
    {
        worldSignal: world.beforeEvents.playerBreakBlock,
        playerOption: { entityTypes: ["minecraft:player"] },
        then: async (config, event: PlayerBreakBlockBeforeEvent) => {
            firstEvent(config, event);
        },
    },
    {
        worldSignal: world.afterEvents.playerBreakBlock,
        playerOption: { entityTypes: ["minecraft:player"] },
        then: async (_config, event: PlayerBreakBlockAfterEvent) => {
            doubleEvent(event);
        },
    },
    {
        worldSignal: world.beforeEvents.playerBreakBlock,
        playerOption: { entityTypes: ["minecraft:player"] },
        then: async (_config, event: EntityHitBlockAfterEvent) => {
            tripleEvent(event);
        },
    }
);
