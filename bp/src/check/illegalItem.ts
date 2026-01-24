import {
    EnchantmentLevelOutOfBoundsError,
    EnchantmentTypeNotCompatibleError,
    EnchantmentTypeUnknownIdError,
    EquipmentSlot,
    ItemLockMode,
    ItemStack,
    ItemTypes,
    Player,
    PlayerInventoryItemChangeAfterEvent,
    PlayerPlaceBlockAfterEvent,
    PlayerSpawnAfterEvent,
    system,
    world,
} from "@minecraft/server";
import { get } from "../util/database";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
// All vanila item stack (start with minecraft:)
let vanillaItems: Set<string> = new Set();
function initVanillaItems() {
    if (vanillaItems.size > 0) return;
    vanillaItems = new Set(ItemTypes.getAll().map(({ id }) => id));
}
const creativeOnlyItems = new Set([
    "minecraft:farmland",
    "minecraft:large_fern",
    "minecraft:tall_grass",
    "minecraft:budding_amethyst",
    "minecraft:mob_spawner",
    "minecraft:trial_spawner",
    "minecraft:vault",
    "minecraft:bedrock",
    "minecraft:frog_spawn",
    "minecraft:end_portal_frame",
]);
const unfairItems = new Set([
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
    "minecraft:player_head",
]);
const educationalItems = new Set([
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
    "minecraft:balloon",
]);
const offHandItems = new Set(["minecraft:shield", "minecraft:totem_of_undying", "minecraft:map", "minecraft:arrow", "minecraft:firework_rocket"]);
function inventoryChange({ player, itemStack: item, slot }: PlayerInventoryItemChangeAfterEvent) {
    if (!item || player.canBypass()) return;
    initVanillaItems();
    const illegal = itemCheck(item);
    if (illegal) {
        const inventory = player.getComponent("inventory")!.container;
        inventory.setItem(slot);
        player.flag("IllegalItem", illegal.type, "Inventory", illegal.info);
    }
}
function onPlayerJoin({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || player.canBypass() || !get("antiIllegalItemTriggerOnJoin")) return;
    initVanillaItems();
    const inventory = player.getComponent("inventory")!.container;
    let triggedCheck:
        | {
              type: string;
              info?:
                  | {
                        [key: string]: string | number;
                    }
                  | undefined;
          }
        | undefined;
    for (let i = 0; i < 36; i++) {
        const item = inventory.getItem(i);
        if (!item) continue;
        const illegal = itemCheck(item);
        if (illegal) {
            inventory.setItem(i);
            triggedCheck = illegal;
        }
    }
    if (triggedCheck) {
        player.flag("IllegalItem", triggedCheck.type, "Inventory", triggedCheck.info);
    }
}
function tickEvent(player: Player) {
    if (system.currentTick % 30 !== 0) return; // Check every 1.5 seconds
    initVanillaItems();
    const equippable = player.getComponent("equippable")!;
    const values = Object.values(EquipmentSlot);
    const equipments = values.map((slot) => equippable.getEquipmentSlot(slot));
    let triggedCheck:
        | {
              type: string;
              info?:
                  | {
                        [key: string]: string | number;
                    }
                  | undefined;
          }
        | undefined;
    equipments.forEach((slot, index) => {
        const item = slot.getItem();
        if (!item) return;
        const currentSlot = values[index];
        if (currentSlot === EquipmentSlot.Mainhand) return; // Ignore mainhand
        if (currentSlot === EquipmentSlot.Offhand) {
            if (slot && item.typeId.startsWith("minecraft:") && !offHandItems.has(item.typeId)) {
                slot.setItem();
                triggedCheck = { type: "K", info: { item: item.typeId } };
                return;
            }
            const illegal = itemCheck(item);
            if (illegal) {
                slot.setItem();
                triggedCheck = illegal;
                return;
            }
        }
    });
    if (triggedCheck) {
        player.flag("IllegalItem", triggedCheck.type, "Equipment", triggedCheck.info);
    }
}
function placeCheck({ player, block }: PlayerPlaceBlockAfterEvent) {
    if (player.canBypass() || !get("antiIllegalItemTriggerOnPlace")) return;
    initVanillaItems();
    const container = block.getComponent("inventory")?.container;
    if (!container || container.weight === 0) return;
    if (get("antiIllegalItemBanPlaceWithData") && !block.typeId.endsWith("shulker_box")) {
        container.clearAll();
        player.flag("IllegalItem", "L", "Place", { block: block.typeId });
        return;
    }
    let triggedCheck: { type: string; info?: { [key: string]: string | number } } | undefined;
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        const illegal = itemCheck(item);
        if (illegal) {
            container.setItem(i);
            triggedCheck = illegal;
        }
    }
    if (triggedCheck) {
        player.flag("IllegalItem", triggedCheck.type, "Place", { block: block.typeId, ...triggedCheck.info });
    }
}
function itemCheck(item: ItemStack): undefined | { type: string; info?: { [key: string]: string | number } } {
    if (item.amount <= 0 || item.amount > item.maxAmount) return { type: "A", info: { item: item.typeId, amount: item.amount } };
    const isWrittenBook = item.typeId === "minecraft:written_book";
    if (!isWrittenBook && item.typeId.startsWith("minecraft:")) {
        if (get("antiIllegalItemBanSpawnEgg") && item.typeId.endsWith("spawn_egg")) return { type: "B", info: { item: item.typeId } };
        if (get("antiIllegalItemCheckImpossible") && creativeOnlyItems.has(item.typeId)) return { type: "C", info: { item: item.typeId } };
        if (get("antiIllegalItemCheckUnfair") && (item.typeId.startsWith("minecraft:light_block") || unfairItems.has(item.typeId))) return { type: "D", info: { item: item.typeId } };
        if (get("antiIllegalItemBanEducational") && (item.typeId.startsWith("minecraft:element") || educationalItems.has(item.typeId))) return { type: "E", info: { item: item.typeId } };
        if (item.typeId.startsWith("minecraft:") && !vanillaItems.has(item.typeId)) return { type: "F", info: { item: item.typeId } };
    }
    if (get("antiIllegalItemComponentCheck")) {
        if (item.keepOnDeath && !item.typeId.startsWith("matrix:")) return { type: "G", info: { item: item.typeId, keepOnDeath: "true" } };
        if (item.lockMode !== ItemLockMode.none) return { type: "H", info: { itemLockMode: item.lockMode } };
        const lore = item.getLore();
        if (isWrittenBook && lore.length > 0 && !(lore.length === 1 && lore[0] === "(+DATA)")) return { type: "I", info: { lore: `${lore[0]}...` } };
    }
    if (!get("antiIllegalItemEnchantmentCheck")) return undefined;
    const enchantable = item.getComponent("enchantable");
    if (enchantable) {
        let itemStack: ItemStack;
        try {
            itemStack = new ItemStack(item.typeId, item.amount);
        } catch {
            console.log("Failed to create item stack for enchantment check: " + item.typeId);
            return undefined; // Invalid item, ignore (Happen when other checks are disabled)
        }
        const stackEnchantable = itemStack.getComponent("enchantable");
        /**
         * This check might not work
         * Minecraft assume that enchantable component is always present on enchantable item, but it won't be present when the item is modified by nbt editing
         */
        if (!stackEnchantable) return { type: "J", info: { item: item.typeId } };
        const enchantments = enchantable.getEnchantments();
        const set = new Set(enchantments.map(({ type: { id } }) => id));
        if (set.size !== enchantments.length) return { type: "K", info: { item: item.typeId } };
        const useCustomLimit = get("antiIllegalItemUseCustomEnchantmentLimit");
        if (useCustomLimit) {
            const customLimit = get("antiIllegalItemCustomEnchantmentLimit");
            const illegalEnchantment = enchantments.find(({ level, type: { maxLevel } }) => level < 1 || level > Math.max(customLimit, maxLevel));
            if (illegalEnchantment) return { type: "L", info: { item: item.typeId, case: "levelOutOfBounds", enchantment: illegalEnchantment.type.id, level: illegalEnchantment.level } };
        }
        try {
            stackEnchantable.addEnchantments(enchantments);
        } catch (error) {
            let illegalCase: string | undefined;
            if (error instanceof EnchantmentLevelOutOfBoundsError) {
                illegalCase = useCustomLimit ? "ignore" : "levelOutOfBounds";
            } else if (error instanceof EnchantmentTypeNotCompatibleError) {
                illegalCase = "notCompatibleWithItem";
            } else if (error instanceof EnchantmentTypeUnknownIdError) {
                illegalCase = "unknownEnchantmentId";
            }
            if (!illegalCase) throw error; // Re-throw unknown error
            if (illegalCase !== "ignore") return { type: "M", info: { item: item.typeId, case: illegalCase } };
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
        world.afterEvents.playerSpawn.subscribe(onPlayerJoin);
        world.afterEvents.playerPlaceBlock.subscribe(placeCheck);
        addCheckInterval("illegalItem", tickEvent);
    },
    disable() {
        world.afterEvents.playerInventoryItemChange.unsubscribe(inventoryChange);
        world.afterEvents.playerSpawn.unsubscribe(onPlayerJoin);
        world.afterEvents.playerPlaceBlock.unsubscribe(placeCheck);
        removeCheckInterval("illegalItem");
    },
};
