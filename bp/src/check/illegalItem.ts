import { EnchantmentLevelOutOfBoundsError, EnchantmentTypeNotCompatibleError, EnchantmentTypeUnknownIdError, ItemLockMode, ItemStack, ItemTypes, PlayerInventoryItemChangeAfterEvent, world } from "@minecraft/server";
import { getInventorySlot } from "../util/util";
import { get } from "../util/database";
// All vanila item stack (start with minecraft:)
const vanillaItems: Set<string> = new Set(ItemTypes.getAll().map(({ id }) => id));
const creativeOnlyItems: Set<string> = new Set([
    "minecraft:farmland",
    "minecraft:large_fern",
    "minecraft:tall_grass",
    "minecraft:budding_amethyst",
    "minecraft:mob_spawner",
    "minecraft:trial_spawner",
    "minecraft:vault",
    "minecraft:bedrock",
    "minecraft:frog_spawn",
    "minecraft:end_portal_frame"
]);
const unfairItems: Set<string> = new Set([
    "minecraft:command_block",
    "minecraft:chain_command_block",
    "minecraft:repeating_command_block",
    "minecraft:command_block_minecart",
    "minecraft:barrier",
    "minecraft:structure_block",
    "minecraft:structure_void",
    "minecraft:deny",
    "minecraft:allow",
    "minecraft:border_block",
    "minecraft:jigsaw",
    "minecraft:player_head"
]);
const educationalItems: Set<string> = new Set([
    "minecraft:board",
    "minecraft:chemistry_table",
    "minecraft:chemical_heat",
    "minecraft:underwater_torch",
    "minecraft:colored_torch_rg",
    "minecraft:colored_torch_bp",
    "minecraft:hard_glass",
    "minecraft:hard_stained_glass",
    "minecraft:hard_glass_pane",
    "minecraft:hard_stained_glass_pane",
    "minecraft:portfolio",
    "minecraft:photo_item",
    "minecraft:bleach",
    "minecraft:ice_bomb",
    "minecraft:rapid_fertilizer",
    "minecraft:medicine",
    "minecraft:sparkler",
    "minecraft:glow_stick",
    "minecraft:compound",
    "minecraft:balloon"
]);
function inventoryChange ({ player, itemStack: item, inventoryType, slot }: PlayerInventoryItemChangeAfterEvent) {
    if (!item || player.isOp()) return;
    const illegal = itemCheck(item);
    if (illegal) {
        const inventory = player.getComponent("inventory")!.container;
        inventory.setItem(getInventorySlot(inventoryType, slot));
        player.flag("IllegalItem", illegal.type, "Misc", illegal.info);
    }
}
function itemCheck (item: ItemStack): undefined | { type: string, info?: { [key: string]: string | number }} {
    if (item.amount <= 0 || item.amount > item.maxAmount) {
        return { type: "A", info: { item: item.typeId, amount: item.amount } };
    }
    if (item.typeId.startsWith("minecraft:")) {
        if (get("antiIllegalItemBanSpawnEgg") && item.typeId.endsWith("spawn_egg")) return { type: "B", info: { item: item.typeId } };
        if (get("antiIllegalItemCheckImpossible") && creativeOnlyItems.has(item.typeId)) return { type: "C", info: { item: item.typeId } };
        if (get("antiIllegalItemCheckUnfair") && (item.typeId.startsWith("minecraft:light_block") || unfairItems.has(item.typeId))) return { type: "D", info: { item: item.typeId } };
        if (get("antiIllegalItemBanEducational") && (item.typeId.startsWith("minecraft:element") || educationalItems.has(item.typeId))) return { type: "E", info: { item: item.typeId } };
        if (item.typeId.startsWith("minecraft:") && !vanillaItems.has(item.typeId)) return { type: "F", info: { item: item.typeId } };
    }
    if (item.keepOnDeath || item.lockMode !== ItemLockMode.none || item.getLore().length > 0) return { type: "G" };
    const enchantable = item.getComponent("enchantable");
    if (enchantable) {
        const itemStack = new ItemStack(item.typeId, item.amount);
        const stackEnchantable = itemStack.getComponent("enchantable");
        if (!stackEnchantable) return { type: "H", info: { item: item.typeId } };
        const enchantments = enchantable.getEnchantments();
        const set = new Set(enchantments);
        if (set.size !== enchantments.length) return { type: "I", info: { item: item.typeId } };
        try {
            stackEnchantable.addEnchantments(enchantments)
        } catch (error) {
            let illegalCase: string | undefined;
            if (error instanceof EnchantmentLevelOutOfBoundsError) {
                illegalCase = "levelOutOfBounds";
            } else if (error instanceof EnchantmentTypeNotCompatibleError) {
                illegalCase = "notCompatibleWithItem";
            } else if (error instanceof EnchantmentTypeUnknownIdError) {
                illegalCase = "unknownEnchantmentId";
            }
            if (!illegalCase) throw error; // Re-throw unknown error
            return { type: "J", info: { item: item.typeId, case: illegalCase } };
        }
    }
    return undefined;
}
export default {
    property: "antiIllegalItemEnable",
    enable() {
        world.afterEvents.playerInventoryItemChange.subscribe(inventoryChange, {
            ignoreQuantityChange: true,
        });
    },
    disable() {
        world.afterEvents.playerInventoryItemChange.unsubscribe(inventoryChange);
    }
}