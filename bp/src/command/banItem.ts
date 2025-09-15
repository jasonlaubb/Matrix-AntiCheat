import type { Command } from "../main";
import { system, world } from "@minecraft/server";
import english from "../data/languages/english";
import { text } from "../util/text";
export const banitem = {
    name: "banitem",
    description: english.commandBanItemDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandBanItem",
        description: "commandBanItemDescription",
        param: ["commandBanItemName"],
        optionalParam: ["commandBanItemReason"],
    },
    parameters: [{ name: "item", type: "item" }],
    optionalParameters: [{ name: "reason", type: "string" }],
    execute: (_player, [item, reason]) => {
        const isItemBanned = world.getDynamicProperty("banitem:" + item) as string;
        if (isItemBanned) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandBanItemAlready", item, isItemBanned) };
        world.setDynamicProperty("banitem:" + item, reason ?? text("commandBanItemNoReason"));
        if (!world?.banItemEventRegistered) system.run(() => registerItemBanEvent());
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandBanItemSuccess", item) };
    },
} as Command;

export const unbanitem = {
    name: "unbanitem",
    description: english.commandUnbanItemDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandUnbanItem",
        description: "commandUnbanItemDescription",
        param: ["commandBanItemName"],
    },
    parameters: [{ name: "item", type: "item" }],
    execute: (_player, [item]) => {
        const isItemBanned = world.getDynamicProperty("banitem:" + item) as string;
        if (!isItemBanned) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandUnbanItemNotBanned", item) };
        world.setDynamicProperty("banitem:" + item);
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandUnbanItemSuccess", item) };
    },
} as Command;

export const banitemlist = {
    name: "banitemlist",
    description: english.commandBanItemListDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandBanItemList",
        description: "commandBanItemListDescription",
    },
    execute: () => {
        const bannedItems = world.getDynamicPropertyIds();
        let banned: string[] = [];
        for (const id of bannedItems) {
            if (id.startsWith("banitem:")) banned.push(id.slice(8));
        }
        if (banned.length === 0) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandBanItemListNone") };
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandBanItemListSuccess", banned.map((item) => `${item} - ${world.getDynamicProperty("banitem:" + item)}`).join(", ")),
        };
    },
} as Command;

export const banitemclear = {
    name: "banitemclear",
    description: english.commandBanItemClearDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandBanItemClear",
        description: "commandBanItemClearDescription",
    },
    execute: () => {
        const bannedItems = world.getDynamicPropertyIds();
        let cleared = 0;
        for (const id of bannedItems) {
            if (id.startsWith("banitem:")) {
                world.setDynamicProperty(id);
                cleared++;
            }
        }
        if (cleared === 0) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandBanItemClearNone") };
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandBanItemClearSuccess", cleared) };
    },
} as Command;
export function registerItemBanEvent() {
    if (world.banItemEventRegistered) return;
    world.banItemEventRegistered = true;
    const event = world.afterEvents.playerInventoryItemChange.subscribe(({ player, itemStack: item, slot }) => {
        if (!item || player.isOp()) return;
        const bannedItems = world
            .getDynamicPropertyIds()
            .filter((id) => id.startsWith("banitem:"))
            .map((id) => {
                return {
                    id: id.slice(8),
                    reason: world.getDynamicProperty(id) as string,
                };
            });
        if (bannedItems.length === 0) {
            delete world.banItemEventRegistered;
            world.afterEvents.playerInventoryItemChange.unsubscribe(event);
            return;
        }
        const bannedItem = bannedItems.find(({ id }) => id === item.typeId);
        if (bannedItem) {
            const inventory = player.getComponent("inventory")!.container;
            inventory.setItem(slot);
            player.sendMessage("§7[§aMatrix§7] §f" + text("commandBanItemRemoved", simplifyId(bannedItem.id), bannedItem.reason));
        }
    });
}
function simplifyId(id: string) {
    let simplified = id.split(":").slice(1).join(":").replace("_", " ");
    simplified = simplified.charAt(0).toUpperCase() + simplified.slice(1);
    for (let i = 1; i < simplified.length; i++) {
        if (simplified[i] === " ") {
            simplified = simplified.slice(0, i + 1) + simplified.charAt(i + 1).toUpperCase() + simplified.slice(i + 2);
        }
    }
    return simplified;
}
