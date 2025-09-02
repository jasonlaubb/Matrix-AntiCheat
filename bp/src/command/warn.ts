import { world } from "@minecraft/server";
import type { Command } from "../main";
import { max2, min2 } from "../util/mathUtil";
export const warn = {
    name: "warn",
    description: "Warn a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "player"
        },
    ],
    optionalParameters: [
        {
            name: "amount",
            type: "integer",
            max: 32767,
            min: -32767
        }
    ],
    execute: (player, [target, amount]) => {
        const warnAmount = amount ?? 1;
        const currentWarn = min2(32767, max2(0, (world.getDynamicProperty("warn:" + target.name) as number ?? 0) + warnAmount));
        world.setDynamicProperty("warn:" + player.name, currentWarn);
        if (warnAmount > 0) {
            world.sendMessage(`§7[§aMatrix§7] §e${target.name} §fhas been warned by admin.`);
            return { status: 0, message: `§7[§aMatrix§7] §fWarned §e${target.name} §ffor §e${warnAmount} §ftime(s). He has §e${currentWarn}§f warn(s) now.` };
        }
        return { status: 0, message: `§7[§aMatrix§7] §fRemoved ${warnAmount} warn(s) from ${target.name}. He has §e${currentWarn}§f warn(s) now.` };
    }
} as Command;
export const warnof = {
    name: "warnof",
    description: "View the amount of warning of an player",
    requireOp: true,
    parameters: [
        {
            name: "playerName",
            type: "string"
        }
    ],
    execute: (_player, [name]) => {
        const data = world.getDynamicProperty("warn:" + name) as number;
        if (!data) return { status: 1, message: `§7[§aMatrix§7] §f${name} doesn't have any warn`};
        return { status: 0, message: `§7[§aMatrix§7] §e${name} §fhas total §e${data} §fwarn(s)`};
    }
} as Command;