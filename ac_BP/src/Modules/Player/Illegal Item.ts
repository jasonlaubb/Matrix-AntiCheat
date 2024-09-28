import { ItemDurabilityComponent, ItemStack, Player } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import OperatorItemList from "../../Data/OperatorItemList";
import EducationItemList from "../../Data/EducationItemList";
import flag from "../../Assets/flag";

function checkIllegalItem(player: Player, item: ItemStack, config: configi): boolean {
    if (config.antiIllegalItem.checkIllegal) {
        if (item.typeId.startsWith("minecraft:") && !EducationItemList.includes(item.typeId)) {
            // Checks if the item is a vanilla item of Minecraft
            const isVanillaItem = Object.values(MinecraftItemTypes).includes(item.typeId as MinecraftItemTypes);
            if (!isVanillaItem) {
                flag(player, config.antiIllegalItem.modules, "A");
                return true;
            }
            // Checks if the item has correct durability
            const durability = item.getComponent(ItemDurabilityComponent.componentId);
            if (durability) {
                if (durability.maxDurability <= durability.damage || durability.damage < 0) {
                    flag(player, config.antiIllegalItem.modules, "G");
                    return true;
                }
            }
        }

        const itemNameLength = item?.nameTag?.length;
        // Checks if the item has vanilla item name length
        if (itemNameLength && (itemNameLength > 64 || itemNameLength < 1)) {
            flag(player, config.antiIllegalItem.modules, "B");
            return true;
        }
        const itemamount = item.amount;
        // Checks if the item stack amount is valid
        if (itemamount > item.maxAmount || itemamount < 1) {
            flag(player, config.antiIllegalItem.modules, "C");
            return true;
        }
    }
    if (config.antiIllegalItem.checkGivableItem) {
        for (const illegalitem of OperatorItemList) {
            // Search in the database whether the item is illegal
            if (item.matches(illegalitem)) {
                flag(player, config.antiIllegalItem.modules, "H");
                return true;
            }
        }
    }
    if (config.antiIllegalItem.checkEnchantment) {
        const enchantments = item.getComponent("enchantable")?.getEnchantments();
        if (enchantments && enchantments.length > 0) {
            /*
            const itemclone = item.clone()?.getComponent("enchantable");
            if (itemclone) {
                itemclone.removeAllEnchantments();
                // Try if the item enchantment is valid for vanilla
                try {
                    itemclone.addEnchantments(enchantments);
                } catch (e) {
                    flag(player, "Illegal Item", "I", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId, "Type:" + e]);
                    return true;
                }
            }*/
            const badEnchantlist: string[] = [];
            for (const {
                level,
                type: { maxLevel, id },
            } of enchantments) {
                // Checks if the enchantment level in the valid range
                if (level > maxLevel || level <= 0) {
                    badEnchantlist.push(`Enchantment: ${id} ${level}`);
                }
            }
            if (badEnchantlist.length > 0) {
                flag(player, config.antiIllegalItem.modules, "J");
                return true;
            }
            const commonEnchantList = enchantments.map(({ type: { id } }) => id);
            const uniqueEnchantList = new Set(enchantments);
            // Checks if the item contains duplicate enchantments
            if (commonEnchantList.length != uniqueEnchantList.size) {
                flag(player, config.antiIllegalItem.modules, "K");
                return true;
            }
        }
    }
    // Extra Checks for educational item
    if (config.antiIllegalItem.checkEducationalItem) {
        // Checks if the item is an educational item
        if (EducationItemList.includes(item.typeId)) {
            flag(player, config.antiIllegalItem.modules, "L");
            return true;
        }
    }
    if (config.antiIllegalItem.checkUnatural) {
        const itemlore = item.getLore();
        // Checks if the item contains lore which is not vanilla
        if (itemlore.length > 0) {
            flag(player, config.antiIllegalItem.modules, "D");
            return true;
        }
        const adventurePlaceLength = [...item.getCanDestroy(), ...item.getCanPlaceOn()].length;
        // Checks if the item contains extra NBT which is not vanilla
        if (adventurePlaceLength > 0) {
            flag(player, config.antiIllegalItem.modules, "E");
            return true;
        }
        // Checks if the item keep on death
        if (item?.keepOnDeath) {
            flag(player, config.antiIllegalItem.modules, "F");
            return true;
        }
    }
    return false;
}

function inventoryCheck(config: configi, player: Player) {
    const container = player.getComponent("inventory")?.container;
    for (let i = 0; i < container!.size; i++) {
        const item = container!.getItem(i);
        if (!item) continue;
        const illegal = checkIllegalItem(player, item, config);
        if (illegal) container!.setItem(i);
    }
}
// Export inventory Checks for more checks
export { inventoryCheck };
registerModule("antiIllegalItem", false, [], {
    tickInterval: 20,
    intick: async (config, player) => inventoryCheck(config, player),
});
