import { system } from "@minecraft/server";
import { timeUnits } from "./ban";
import type { Command } from "../main";
import { parseTime, hasEducationalFeature } from "../util/util";
import { checkPunish } from "../util/punishment";
import english from "../data/languages/english";
import { text } from "../util/text";
export const mute = {
    name: "mute",
    description: english.commandMuteDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandMute",
        description: "commandMuteDescription",
        param: ["commandMuteTarget"],
        optionalParam: ["commandMuteDuration", "commandMuteTimeUnit"]
    },
    parameters: [
        { name: "player", type: "playerTarget" },
    ],
    optionalParameters: [
        { name: "duration", type: "float", min: 1 },
        { name: "timeUnit", type: "enum" },
    ],
    execute: (_player, [target, duration, timeUnit]) => {
        if (!hasEducationalFeature()) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandMuteMissingEdu")
            };
        }

        if (target.getDynamicProperty("muteData:" + target.id)) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandMuteAlready", target.name)
            };
        }

        if (duration && !timeUnit) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandMuteMissingUnit")
            };
        }

        if (duration && !timeUnits.includes(timeUnit)) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandMuteInvalidUnit", timeUnit)
            };
        }

        system.run(() => {
            target.setDynamicProperty("muteData:" + target.id, duration ? Date.now() + parseTime(timeUnit, duration) : -1);
            checkPunish(target);
        });

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandMuteSuccess", target.name)
        };
    },
} as Command;
export const unmute = {
    name: "unmute",
    description: english.commandUnmuteDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandUnmute",
        description: "commandUnmuteDescription",
        param: ["commandUnmuteTarget"]
    },
    parameters: [
        { name: "player", type: "playerTarget" },
    ],
    execute: (_player, [target]) => {
        if (!hasEducationalFeature()) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandMuteMissingEdu")
            };
        }

        if (!target.getDynamicProperty("muteData:" + target.id)) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandUnmuteNotMuted", target.name)
            };
        }

        system.run(() => {
            target.setDynamicProperty("muteData:" + target.id);
            target.runCommand("ability @s mute false");
        });

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandUnmuteSuccess", target.name)
        };
    },
} as Command;