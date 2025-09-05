import { world } from "@minecraft/server";
import type { Command } from "../main";
export const warn = {
    name: "warn",
    description: "Warn a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "player",
        },
    ],
    optionalParameters: [
        {
            name: "amount",
            type: "integer",
            max: 32767,
            min: -32767,
        },
    ],
    execute: (player, [target, amount]) => {
        const warnAmount = amount ?? 1;
        const currentWarn = Math.min(32767, Math.max(0, ((world.getDynamicProperty("warn:" + target.name) as number) ?? 0) + warnAmount));
        world.setDynamicProperty("warn:" + player.name, currentWarn);
        if (warnAmount > 0) {
            world.sendMessage(`§7[§aMatrix§7] §e${target.name} §fhas been warned by admin.`);
            return { status: 0, message: `§7[§aMatrix§7] §fWarned §e${target.name} §ffor §e${warnAmount} §ftime(s). He has §e${currentWarn}§f warn(s) now.` };
        }
        return { status: 0, message: `§7[§aMatrix§7] §fRemoved ${Math.abs(warnAmount)} warn(s) from ${target.name}. He has §e${currentWarn}§f warn(s) now.` };
    },
} as Command;
export const warnof = {
    name: "warnof",
    description: "View the amount of warning of an player",
    requireOp: true,
    parameters: [
        {
            name: "playerName",
            type: "string",
        },
    ],
    execute: (_player, [name]) => {
        const data = world.getDynamicProperty("warn:" + name) as number;
        if (!data) return { status: 1, message: `§7[§aMatrix§7] §f${name} doesn't have any warn` };
        return { status: 0, message: `§7[§aMatrix§7] §e${name} §fhas total §e${data} §fwarn(s)` };
    },
} as Command;
export const warns = {
    name: "warns",
    description: "View the amount of warning of a player",
    optionalParameters: [
        {
            name: "player",
            type: "player",
        },
    ],
    execute: (player, [target]) => {
        if (target) {
            if (!player.isOp()) return { status: 1, message: "§7[§aMatrix§7] §fYou don't have permission to view other player's warning" };
            const data = world.getDynamicProperty("warn:" + target.name) as number;
            if (!data) return { status: 1, message: `§7[§aMatrix§7] §f${target.name} doesn't have any warn` };
            return { status: 0, message: `§7[§aMatrix§7] §e${target.name} §fhas total §e${data} §fwarn(s)` };
        }
        const data = world.getDynamicProperty("warn:" + player.name) as number;
        if (!data || data === 0) return { status: 1, message: `§7[§aMatrix§7] §fYou don't have any warning.` };
        return { status: 0, message: `§7[§aMatrix§7] §fYou have been warned for §e${data} §ftime(s).` };
    },
} as Command;
export const warnreset = {
    name: "warnreset",
    description: "Reset a player's warning",
    parameters: [
        {
            name: "player",
            type: "player",
        },
    ],
    requireOp: true,
    execute: (_player, [target]) => {
        const data = world.getDynamicProperty("warn:" + target.name) as number;
        if (!data) return { status: 1, message: `§7[§aMatrix§7] §f${target.name} doesn't have any warn.` };
        world.setDynamicProperty("warn:" + target.name);
        return { status: 0, message: `§7[§aMatrix§7] §fReset all warnings of ${target.name}` };
    },
} as Command;
export const warnclear = {
    name: "warnclear",
    description: "Clear all warn records in the server",
    requireOp: true,
    execute: (_player) => {
        let clearedAmount = 0;
        world.getDynamicPropertyIds().forEach((id) => {
            if (!id.startsWith("warn:")) return;
            world.setDynamicProperty(id);
            clearedAmount++;
        });
        if (clearedAmount) return { status: 1, message: `§7[§aMatrix§7] §fNo one is warned in the server.` };
        return { status: 0, message: `§7[§aMatrix§7] §fCleared all warn records` };
    },
} as Command;
export const warnlist = {
    name: "warnlist",
    description: "Show the warn records",
    requireOp: true,
    execute: (_player) => {
        let warnRecord: string[] = [];
        world.getDynamicPropertyIds().forEach((id) => {
            if (!id.startsWith("warn:")) return;
            const data = world.getDynamicProperty(id) as number;
            warnRecord.push(`§g${id.slice(5)} §7- §e${data}`);
        });
        if (warnRecord.length === 0) return { status: 1, message: `§7[§aMatrix§7] §fNo one is warned in the server.` };
        return { status: 0, message: `§7[§aMatrix§7] §fShowing ${warnRecord.length} warn record(s):\n${warnRecord.join("\n")}` };
    },
} as Command;
