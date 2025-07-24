import { system, world } from "@minecraft/server";
import { Command } from "../main";
import { ban, BanData, banName, checkPunish, isBanned } from "../util/punishment";
import { parseTime } from "../util/util";
export const timeUnits = ["s", "second", "m", "minute", "h", "hour", "d", "day", "w", "week", "mo", "month", "y", "year"];
export const banCmd = {
    name: "ban",
    description: "Ban a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "playerTarget"
        },
    ],
    optionalParameters: [
        {
            name: "reason",
            type: "string",
        },
        {
            name: "duration",
            type: "float",
            min: 1,
        },
        {
            name: "timeUnit",
            type: "enum"
        },
    ],
    execute: (player, [target, reason, duration, timeUnit]) => {
        if (duration && !timeUnit) return { status: 1, message: "§7[§aMatrix§7] §fYou need to type time unit if you want to set a duration." };
        if (!timeUnits.includes(timeUnit)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid time unit!" };
        system.run(() => {
            ban(target, reason ?? "No reason provided", player.name, duration ? parseTime(timeUnit, duration) : undefined);
            checkPunish(target);
        });
        return { status: 0, message: "§7[§aMatrix§7] §fBanned player: " + target.name };
    }
} as Command;
export const banOffline = {
    name: "banoffline",
    description: "Ban a player who is offline",
    requireOp: true,
    parameters: [
        {
            name: "playerName",
            type: "string"
        },
    ],
    optionalParameters: [
        {
            name: "reason",
            type: "string",
        },
        {
            name: "duration",
            type: "float",
            min: 1,
        },
        {
            name: "timeUnit",
            type: "enum"
        },
    ],
    execute: (player, [target, reason, duration, timeUnit]) => {
        if (world.getDynamicProperty("nameBanData:" + target) || isBanned(target)) return { status: 1, message: "§7[§aMatrix§7] §fTarget player is already banned." };
        if (world.getPlayers({ name: target })) return { status: 1};
        if (duration && !timeUnit) return { status: 1, message: "§7[§aMatrix§7] §fYou need to type time unit if you want to set a duration." };
        if (duration && !timeUnits.includes(timeUnit)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid time unit!" };
        system.run(() => {
            banName(target, reason ?? "No reason provided", player.name, duration ? parseTime(timeUnit, duration) : undefined);
            checkPunish(player);
        });
        return { status: 0, message: "§7[§aMatrix§7] §fBanned player: " + target };
    }
} as Command;
export const unban = {
    name: "unban",
    description: "Unban a player",
    parameters: [
        {
            name: "playerName",
            type: "string",
        },
    ],
    requireOp: true,
    execute(_player, [target]) {
        const banned = isBanned(target);
        const nameBanned = world.getDynamicProperty("nameBanData:" + target);
        if (!banned && !nameBanned) return { status: 1, message: "Target player is not banned." };
        system.run(() => {
            if (banned) world.setDynamicProperty(banned!);
            if (nameBanned) world.setDynamicProperty("nameBanData:" + target);
        });
        return { status: 0, message: "§7[§aMatrix§7] §fUnbanned player: " + target };
    },
} as Command;
export const banlist = {
    name: "banlist",
    description: "Show a list of banned player",
    requireOp: true,
    execute() {
        const ids = world.getDynamicPropertyIds();
        const banned = [];
        for (const id of ids) {
            if (id.startsWith("nameBanData:")) {
                banned.push(id.slice(12));
            } else if (id.startsWith("banData:")) {
                const rawData = world.getDynamicProperty(id) as string;
                const data = JSON.parse(rawData) as BanData;
                banned.push(data.name);
            }
        }
        if (banned.length > 0) {
            return { status: 0, message: "§7[§aMatrix§7] §fBanned player list: §e" + banned.join(", ") };
        } else return { status: 0, message: "§7[§aMatrix§7] §fThere is no banned player yet." }
    },
} as Command;