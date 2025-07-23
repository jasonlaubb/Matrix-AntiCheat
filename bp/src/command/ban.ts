import { MolangVariableMap, system, world } from "@minecraft/server";
import { Command } from "../main";
import { ban, banName } from "../util/punishment";
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
        if (duration && !timeUnit) return { status: 1, message: "§7[§aMatrix§7] §fYou need to type time unit if you want to set a duration." };
        if (!timeUnits.includes(timeUnit)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid time unit!" };
        system.run(() => {
            banName(target, reason ?? "No reason provided", player.name, duration ? parseTime(timeUnit, duration) : undefined);
        });
        return { status: 0, message: "§7[§aMatrix§7] §fBanned player: " + target.name };
    }
} as Command;