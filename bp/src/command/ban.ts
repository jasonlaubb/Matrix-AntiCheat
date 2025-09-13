import { system, world } from "@minecraft/server";
import { Command } from "../main";
import { ban, BanData, banName, checkPunish, isBanned } from "../util/punishment";
import { parseTime } from "../util/util";
import english from "../data/languages/english";
import { text } from "../util/text";
export const timeUnits = ["s", "second", "m", "minute", "h", "hour", "d", "day", "w", "week", "mo", "month", "y", "year"];
export const banCmd = {
    name: "ban",
    description: english.commandBanDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandBan",
        description: "commandBanDescription",
        param: ["commandPlayer"],
        optionalParam: ["commandBanReason", "commandBanDuration", "commandBanTimeUnit"]
    },
    parameters: [
        {
            name: "player",
            type: "playerTarget",
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
            type: "enum",
        },
    ],
    execute: (player, [target, reason, duration, timeUnit]) => {
        if (duration && !timeUnit) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandBanMissingUnit") };
        if (duration && !timeUnits.includes(timeUnit)) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandBanInvalidTimeUnit") };
        system.run(() => {
            ban(target, reason ?? text("commandBanNoReason"), player.name, duration ? Date.now() + parseTime(timeUnit, duration) : undefined);
            checkPunish(target);
        });
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandBanBanned", target.name) };
    },
} as Command;
export const banOffline = {
    name: "banoffline",
    description: english.commandOfflinebanDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandOfflineban",
        description: "commandOfflinebanDescription",
        param: ["commandBanPlayerName"],
        optionalParam: ["commandBanReason", "commandBanDuration", "commandBanTimeUnit"]
    },
    parameters: [
        {
            name: "playerName",
            type: "string",
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
            type: "enum",
        },
    ],
    execute: (player, [target, reason, duration, timeUnit]) => {
        if (world.getDynamicProperty("nameBanData:" + target) || isBanned(target)) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandOfflinebanAlready") };
        if (world.getPlayers({ name: target })[0]) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandOfflinebanOnline") };
        if (duration && !timeUnit) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandBanMissingUnit") };
        if (duration && !timeUnits.includes(timeUnit)) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandBanInvalidTimeUnit") };
        system.run(() => {
            banName(target, reason ?? text("commandBanNoReason"), player.name, duration ? Date.now() + parseTime(timeUnit, duration) : undefined);
            checkPunish(player);
        });
        return { status: 0, message: "§7[§aMatrix§7] §f " + text("commandBanBanned", target) };
    },
} as Command;
export const unban = {
    name: "unban",
    description: english.commandUnbanDescription,
    parameters: [
        {
            name: "playerName",
            type: "string",
        },
    ],
    translationDef: {
        actionName: "commandUnban",
        description: "commandUnbanDescription",
        param: ["commandBanPlayerName"],
    },
    requireOp: true,
    execute(_player, [target]) {
        const banned = isBanned(target);
        const nameBanned = world.getDynamicProperty("nameBanData:" + target);
        if (!banned && !nameBanned) return { status: 1, message: "§7[§aMatrix§7]" + text("commandUnbanNotBanned") };
        system.run(() => {
            if (banned) world.setDynamicProperty(banned!);
            if (nameBanned) world.setDynamicProperty("nameBanData:" + target);
        });
        return { status: 0, message: "§7[§aMatrix§7] §f " + text("commandUnbanUnbanned", target) };
    },
} as Command;
export const banlist = {
    name: "banlist",
    description: "Show a list of banned player",
    requireOp: true,
    translationDef: {
        actionName: "commandBanList",
        description: "commandBanListSuccess",
    },
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
            return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandBanListSuccess", banned.join(", ")) };
        } else return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandBanListNone") };
    },
} as Command;
