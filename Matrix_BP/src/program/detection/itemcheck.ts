import { EntityInventoryComponent, ItemEnchantableComponent, ItemStack, Player, system } from "@minecraft/server";
import { Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
const vanillaSet = new Set(Object.values(MinecraftItemTypes)) as Set<string>;
let eventId: number;
const itemCheck = new Module()
    .setTag(3)
    .setName(rawtextTranslate("module.itemcheck.name"))
    .setDescription(rawtextTranslate("module.itemcheck.description"))
    .setToggleId("itemCheck")
    .setPunishment("ban")
    .onModuleEnable(() => {
        eventId = system.runInterval(() => {
            const allPlayers = Module.allNonAdminPlayers;
            for (const player of allPlayers) {
                tickEvent(player);
            }
        }, 20);
    })
    .onModuleDisable(() => {
        system.clearRun(eventId);
    });
itemCheck.register();
function tickEvent(player: Player) {
    const { container } = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
    let isFlagged = false;
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        const detect = itemDetector(item);
        if (detect && !isFlagged) {
            isFlagged = true;
            player.flag(itemCheck, detect as any);
        }
        container.setItem(i);
    }
}
function itemDetector (item: ItemStack) {
    const config = Module.config.sensitivity.illegalItemDefinition;
    if (config.nonVanillaID && item.typeId.startsWith("minecraft:") && !vanillaSet.has(item.typeId)) {
        return { t: 1, typeId: item.typeId };
    }
    if (config.amountStack && (item.amount <= 0 || item.amount > item.maxAmount)) {
        return { t: 2, typeId: item.typeId };;
    }
    if (config.itemLore) {
        const lore = item.getLore().length;
        if (lore > 0) {
            return { t: 3, loreAmount: lore.toString() }
        }
    }
    if (config.itemTag && (item.keepOnDeath || item.getCanDestroy().length > 0 || item.getCanPlaceOn().length > 0)) {
        return { t: 4, typeId: item.typeId };
    }
    if (config.spawnEgg && item.typeId.endsWith("spawn_egg")) {
        return { t: 5, typeId: item.typeId };
    }
    if (config.badEnchantment) {
        const enchantment = item.getComponent(ItemEnchantableComponent.componentId) as ItemEnchantableComponent;
        if (!enchantment) return null;
        const enchantmentList = enchantment.getEnchantments();
        if (enchantmentList.length === 0) return null;
        enchantment.removeAllEnchantments();
        try {
            enchantment.addEnchantments(enchantmentList);
        } catch (error) {
            const { name, message } = error as Error;
            return { t: 6, typeId: item.typeId, error: name, message };
        }
    }
    return null;
}