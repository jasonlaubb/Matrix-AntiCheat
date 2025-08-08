import { system } from "@minecraft/server";
import { timeUnits } from "./ban";
import type { Command } from "../main";
import { parseTime, hasEducationalFeature } from "../util/util";
import { checkPunish } from "../util/punishment";

export const mute = {
    name: "mute",
    description: "Mute a player",
    parameters: [
        {
            name: "player",
            type: "playerTarget",
        },
    ],
    requireOp: true,
    optionalParameters: [
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
    execute: (_player, [target, duration, timeUnit]) => {
        if (!hasEducationalFeature()) return { status: 1, message: "§7[§aMatrix§7] §fEducation edition required! " };
        if (target.getDynamicProperty("muteData:" + target.id)) return { status: 1, message: "§7[§aMatrix§7] §fPlayer has been muted already." }; 
        if (duration && !timeUnit) return { status: 1, message: "§7[§aMatrix§7] §fYou need to type time unit if you want to set a duration." };
        if (duration && !timeUnits.includes(timeUnit)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid time unit!" };
        system.run(() => {
            target.setDynamicProperty("muteData:" + target.id, duration ? Date.now() + parseTime(timeUnit, duration) : -1);
            checkPunish(target);
        });
        return { status: 0, message: "§7[§aMatrix§7] §fMuted player: " + target.name };
    },
} as Command;
export const unmute = {
    name: "unmute",
    description: "Unmute a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "playerTarget",
        },
    ],
    execute: (_player, [target]) => {
        if (!hasEducationalFeature()) return { status: 1, message: "§7[§aMatrix§7] §fEducation edition required! " };
        if (!target.getDynamicProperty("muteData:" + target.id)) return { status: 1, message: "§7[§aMatrix§7] §fPlayer has not been muted." }; 
        system.run(() => {
            target.setDynamicProperty("muteData:" + target.id);
            target.runCommand("ability @s mute false");
        });
        return { status: 0, message: "§7[§aMatrix§7] §fMuted player: " + target.name };
    },
} as Command;
