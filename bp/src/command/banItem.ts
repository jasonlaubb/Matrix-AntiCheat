import type { Command } from "../main";
import { system, world } from "@minecraft/server";
export const banitem = {
    name: "banitem",
    description: "Ban an item from being given to players.",
    requireOp: true,
    parameters: [
        {
            name: "item",
            type: "item",
        },
    ],
    optionalParameters: [
        {
            name: "reason",
            type: "string",
        }
    ],
    execute: (_player, [item, reason]) => {
        const isItemBanned = world.getDynamicProperty("banitem:" + item) as string;
        if (isItemBanned) return { status: 1, message: `§7[§aMatrix§7] §fItem §e${item}§f is already banned for §e${isItemBanned}` };
        world.setDynamicProperty("banitem:" + item, reason ?? "No reason");
        if (!world?.banItemEventRegistered) registerItemBanEvent();
        return { status: 0, message: `§7[§aMatrix§7] §fItem §e${item}§f has been banned successfully.` };
    }
} as Command;
export const unbanitem = {
    name: "unbanitem",
    description: "Unban an item from being given to players.",
    requireOp: true,
    parameters: [
        {
            name: "item",
            type: "item",
        },
    ],
    execute: (_player, [item]) => {
        const isItemBanned = world.getDynamicProperty("banitem:" + item) as string;
        if (!isItemBanned) return { status: 1, message: `§7[§aMatrix§7] §fItem §e${item}§f has not been banned yet.` };
        world.setDynamicProperty("banitem:" + item);
        return { status: 0, message: `§7[§aMatrix§7] §fItem §e${item}§f has been unbanned successfully.` };
    }
} as Command;
export const banitemlist = {
    name: "banitemlist",
    description: "List all banned items.",
    requireOp: true,
    execute: () => {
        const bannedItems = world.getDynamicPropertyIds();
        let banned: string[] = [];
        for (const id of bannedItems) {
            if (id.startsWith("banitem:")) banned.push(id.slice(8));
        }
        if (banned.length === 0) return { status: 1, message: "§7[§aMatrix§7] §fNo items are banned." };
        return {
            status: 0,
            message: "§7[§aMatrix§7] §fBanned items:\n" + banned.map(item => `§e${item}§f - ${world.getDynamicProperty("banitem:" + item)}`).join("\n"),
        };
    }
} as Command;
export const banitemclear = {
    name: "banitemclear",
    description: "Clear all banned items.",
    requireOp: true,
    execute: () => {
        const bannedItems = world.getDynamicPropertyIds();
        let cleared = 0;
        for (const id of bannedItems) {
            if (id.startsWith("banitem:")) {
                world.setDynamicProperty(id);
                cleared++;
            }
        }
        if (cleared === 0) return { status: 1, message: "§7[§aMatrix§7] §fNo items were banned." };
        return { status: 0, message: `§7[§aMatrix§7] §fCleared ${cleared} banned items.` };
    }
} as Command;
export function registerItemBanEvent () {
    world.banItemEventRegistered = true;
    const event = system.runInterval(() => {
        const bannedItems = world.getDynamicPropertyIds().filter(id => id.startsWith("banitem:")).map(id => {
            return {
                id: id.slice(8),
                reason: world.getDynamicProperty(id) as string,
            }
        });
        if (bannedItems.length === 0) {
            delete world.banItemEventRegistered;
            return system.clearRun(event);
        }
        const allPlayers = world.getAllPlayers();
        allPlayers.forEach(player => {
            if (player.isOp()) return;
            const inventory = player.getComponent("inventory")!.container;
            let bannedList: { id: string, reason: string }[] = [];
            for (let i = 0; i < 36; i++) {
                const item = inventory.getItem(i);
                if (!item) continue;
                const bannedItem = bannedItems.find(b => b.id === item.typeId);
                if (bannedItem && !bannedList.includes(bannedItem)) {
                    bannedList.push(bannedItem);
                    inventory.setItem(i);
                }
            }
            if (bannedList.length > 0) {
                player.sendMessage(`§7[§aMatrix§7] §fBanned item(s) has been removed from your inventory:\n` + bannedList.map(({ id, reason }) => `§g${simplifyId(id)}: §e${reason}§r`).join("\n"));
            }
        });
    }, 20);
}
function simplifyId (id: string) {
    let simplified = id.split(":").slice(1).join(":").replace("_", " ");
    simplified = simplified.charAt(0).toUpperCase() + simplified.slice(1);
    for (let i = 1; i < simplified.length; i++) {
        if (simplified[i] === " ") {
            simplified = simplified.slice(0, i + 1) + simplified.charAt(i + 1).toUpperCase() + simplified.slice(i + 2);
        }
    }
    return simplified;
}