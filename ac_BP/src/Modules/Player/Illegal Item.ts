import { ItemDurabilityComponent, ItemStack, Player } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { flag } from "../../Assets/Util";
import OperatorItemList from "../../Data/OperatorItemList";
import EducationItemList from "../../Data/EducationItemList";

function checkIllegalItem(player: Player, item: ItemStack, config: configi): boolean {
    if (config.antiIllegalItem.checkIllegal) {
        if (item.typeId.startsWith("minecraft:") && !EducationItemList.includes(item.typeId)) {
            const isVanillaItem = Object.values(MinecraftItemTypes).includes(item.typeId as MinecraftItemTypes);
            if (!isVanillaItem) {
                flag(player, "Illegal Item", "A", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId]);
                return true;
            }
            const durability = item.getComponent(ItemDurabilityComponent.componentId);
            if (durability) {
                if (durability.maxDurability <= durability.damage || durability.damage < 0) {
                    flag(player, "Illegal Item", "G", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId, "Durability:" + durability.damage]);
                    return true;
                }
            }
        }

        const itemNameLength = item?.nameTag?.length;
        if (itemNameLength > 64 || itemNameLength < 1) {
            flag(player, "Illegal Item", "B", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId, "Length:" + itemNameLength]);
            return true;
        }
        const itemamount = item.amount;
        // player.sendMessage(String(item.maxAmount - itemamount));
        if (itemamount > item.maxAmount || itemamount < 1) {
            flag(player, "Illegal Item", "C", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId, "Amount:" + itemamount]);
            return true;
        }
    }
    if (config.antiIllegalItem.checkGivableItem) {
        for (const illegalitem of OperatorItemList) {
            if (item.matches(illegalitem)) {
                flag(player, "Illegal Item", "H", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId]);
                return true;
            }
        }
    }
    if (config.antiIllegalItem.checkEnchantment) {
        const encomp = item.getComponent("enchantable");
        if (encomp) {
            const enchantments = encomp.getEnchantments();
            const newItemStack = new ItemStack(item.typeId, item.amount)?.getComponent("enchantable");
            if (enchantments.length > 0) {
            try {
                newItemStack.addEnchantments(enchantments);
            } catch (error) {
                flag(player, "Illegal Item", "I", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Error:" + (error as Error).stack]);
                return true;
            }
            for (const enchantment of enchantments) {
                const {
                    type: { maxLevel, id },
                    level,
                } = enchantment;
                if (level > maxLevel || level < 0) {
                    flag(player, "Illegal Item", "J", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId, "Enchantment:" + id, "Level:" + level]);
                    return true;
                }
            }
        }
        }
    }
    // Extra check for educational item
    if (config.antiIllegalItem.checkEducationalItem) {
        if (EducationItemList.includes(item.typeId)) {
            flag(player, "Illegal Item", "K", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId]);
            return true;
        }
    }
    if (config.antiIllegalItem.checkUnatural) {
        const itemlore = item.getLore();
        if (itemlore.length > 0) {
            flag(player, "Illegal Item", "D", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId, "Lore:" + (itemlore[0].length > 8 ? itemlore[0].slice(0, 8) + "..." : itemlore[0])]);
            return true;
        }
        const adventurePlaceLength = [...item.getCanDestroy(), ...item.getCanPlaceOn()].length;
        if (adventurePlaceLength > 0) {
            flag(player, "Illegal Item", "E", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId, "Length:" + adventurePlaceLength]);
            return true;
        }
        if (item?.keepOnDeath) {
            flag(player, "Illegal Item", "F", config.antiIllegalItem.maxVL, config.antiIllegalItem.punishment, ["Item:" + item.typeId]);
            return true;
        }
    }
    return false;
}

function inventoryCheck(config: configi, player: Player) {
    const container = player.getComponent("inventory")?.container;
    player.onScreenDisplay.setActionBar("Checking...");
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        const illegal = checkIllegalItem(player, item, config);
        if (illegal) container.setItem(i);
    }
}

registerModule("antiIllegalItem", false, [], {
    tickInterval: 20,
    intick: async (config, player) => inventoryCheck(config, player),
});
