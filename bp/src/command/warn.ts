import { world } from "@minecraft/server";
import type { Command } from "../main";
import { text } from "../util/text";
import english from "../data/languages/english";
export const warn = {
    name: "warn",
    description: english.commandWarnDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandWarn",
        description: "commandWarnDescription",
        param: ["commandWarnTarget"],
        optionalParam: ["commandWarnAmount"],
    },
    parameters: [{ name: "player", type: "player" }],
    optionalParameters: [{ name: "amount", type: "integer", max: 32767, min: -32767 }],
    execute: (_player, [target, amount]) => {
        const warnAmount = amount ?? 1;
        const currentWarn = Math.min(32767, Math.max(0, ((world.getDynamicProperty("warn:" + target.name) as number) ?? 0) + warnAmount));
        world.setDynamicProperty("warn:" + target.name, currentWarn);

        if (warnAmount > 0) {
            world.sendMessage(text("commandWarnBroadcast", target.name));
            return {
                status: 0,
                message: "§7[§aMatrix§7] §f" + text("commandWarnAdded", target.name, warnAmount, currentWarn),
            };
        }

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandWarnRemoved", Math.abs(warnAmount), target.name, currentWarn),
        };
    },
} as Command;

export const warnof = {
    name: "warnof",
    description: english.commandWarnOfDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandWarnOf",
        description: "commandWarnOfDescription",
        param: ["commandWarnOfTarget"],
    },
    parameters: [{ name: "playerName", type: "string" }],
    execute: (_player, [name]) => {
        const data = world.getDynamicProperty("warn:" + name) as number;
        if (!data) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandWarnNone", name),
            };
        }
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandWarnTotal", name, data),
        };
    },
} as Command;

export const warns = {
    name: "warns",
    description: english.commandWarnsDescription,
    translationDef: {
        actionName: "commandWarns",
        description: "commandWarnsDescription",
        optionalParam: ["commandWarnsTarget"],
    },
    optionalParameters: [{ name: "player", type: "player" }],
    execute: (player, [target]) => {
        if (target) {
            if (!player.isOp()) {
                return {
                    status: 1,
                    message: "§7[§aMatrix§7] §f" + text("commandWarnViewDenied"),
                };
            }
            const data = world.getDynamicProperty("warn:" + target.name) as number;
            if (!data) {
                return {
                    status: 1,
                    message: "§7[§aMatrix§7] §f" + text("commandWarnNone", target.name),
                };
            }
            return {
                status: 0,
                message: "§7[§aMatrix§7] §f" + text("commandWarnTotal", target.name, data),
            };
        }

        const data = world.getDynamicProperty("warn:" + player.name) as number;
        if (!data || data === 0) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandWarnSelfNone"),
            };
        }

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandWarnSelfTotal", data),
        };
    },
} as Command;

export const warnreset = {
    name: "warnreset",
    description: english.commandWarnResetDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandWarnReset",
        description: "commandWarnResetDescription",
        param: ["commandWarnResetTarget"],
    },
    parameters: [{ name: "player", type: "player" }],
    execute: (_player, [target]) => {
        const data = world.getDynamicProperty("warn:" + target.name) as number;
        if (!data) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandWarnNone", target.name),
            };
        }
        world.setDynamicProperty("warn:" + target.name);
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandWarnResetSuccess", target.name),
        };
    },
} as Command;

export const warnclear = {
    name: "warnclear",
    description: english.commandWarnClearDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandWarnClear",
        description: "commandWarnClearDescription",
    },
    execute: (_player) => {
        let clearedAmount = 0;
        world.getDynamicPropertyIds().forEach((id) => {
            if (!id.startsWith("warn:")) return;
            world.setDynamicProperty(id);
            clearedAmount++;
        });

        if (clearedAmount === 0) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandWarnClearNone"),
            };
        }

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandWarnClearSuccess"),
        };
    },
} as Command;

export const warnlist = {
    name: "warnlist",
    description: english.commandWarnListDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandWarnList",
        description: "commandWarnListDescription",
    },
    execute: (_player) => {
        let warnRecord: string[] = [];
        world.getDynamicPropertyIds().forEach((id) => {
            if (!id.startsWith("warn:")) return;
            const data = world.getDynamicProperty(id) as number;
            warnRecord.push(`§g${id.slice(5)} §7- §e${data}`);
        });

        if (warnRecord.length === 0) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandWarnClearNone"),
            };
        }

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandWarnListSuccess", warnRecord.length, warnRecord.join("\n")),
        };
    },
} as Command;
