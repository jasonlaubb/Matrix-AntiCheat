import type { Command } from "../main";
import { punishmentType } from "../data/prototype";
import { world } from "@minecraft/server";
export default {
    name: "setpunishment",
    description: "Change punishment on flag",
    requireOp: true,
    parameters: [
        {
            name: "punishmentType",
            type: "enum",
        },
    ],
    optionalParameters: [
        {
            name: "banDurationInMs",
            type: "integer",
            min: 1000,
        },
    ],
    execute: (_player, [newPunishmentType, banDuration]) => {
        if (!punishmentType.includes(newPunishmentType)) return { status: 1, message: "§7[§aMatrix§7] §fUnknown punishment type: " + newPunishmentType };
        world.setDynamicProperty("database:flagPunishmentType", newPunishmentType);
        if (banDuration) {
            world.setDynamicProperty("database:flagBanDuration", banDuration);
            return { status: 0, message: `§7[§aMatrix§7] §fChanged flag punishment type to §e${newPunishmentType}§f and set ban duration to §e${banDuration}ms` };
        }
        return { status: 0, message: "§7[§aMatrix§7] §fChanged flag punishment type to §e" + newPunishmentType };
    },
} as Command;
