import { ItemStack, system } from "@minecraft/server";
import { timeUnits } from "./ban";
import type { Command } from "../main";
import { parseTime } from "../util/util";
import { checkPunish } from "../util/punishment";

function hasEducationalFeature () {
    try {
        new ItemStack("minecraft:chemistry_table");
        return true;
    } catch {
        return false;
    }
}

export const mute = {
    name: "mute",
    description: "Mute a player",
    parameters: [
        {
            name: "player",
            type: "playerTarget",
        }
    ],
    optionalParameters: [
        {
            name: "duration",
            type: "float",
            min: 1,
        },
        {
            name: "timeUnit",
            type: "enum",
        }
    ],
    execute: (player, [target, duration, timeUnit]) => {
        if (!hasEducationalFeature()) return { status: 1, message: "§7[§aMatrix§7] §fEducation edition required! " };
        if (duration && !timeUnit) return { status: 1, message: "§7[§aMatrix§7] §fYou need to type time unit if you want to set a duration." };
        if (duration && !timeUnits.includes(timeUnit)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid time unit!" };
        system.run(() => {
            target.setDynamicProperty("muteData:" + player.id, duration ? Date.now() + parseTime(timeUnit, duration) : -1);
            checkPunish(target);
        });
        return { status: 0, message: "§7[§aMatrix§7] §fMuted player: " + target.name };
    }
} as Command;
export const unmute = {
    name: "unmute",
    description: "Unmute a player",
    parameters: [
        {
            name: "player",
            type: "playerTarget",
        }
    ],
    execute: (player, [target]) => {
        if (!hasEducationalFeature()) return { status: 1, message: "§7[§aMatrix§7] §fEducation edition required! " };
        system.run(() => {
            target.setDynamicProperty("muteData:" + player.id);
            player.runCommand("ability @s mute true");
        });
        return { status: 0, message: "§7[§aMatrix§7] §fMuted player: " + target.name };
    }
} as Command;