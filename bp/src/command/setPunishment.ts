import type { Command } from "../main";
import { world } from "@minecraft/server";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "setpunishment",
    description: english.commandSetPunishmentDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandSetPunishment",
        description: "commandSetPunishmentDescription",
        param: ["commandSetPunishmentType"],
        optionalParam: ["commandSetPunishmentDuration"],
    },
    parameters: [{ name: "punishmentType", type: "enum" }],
    optionalParameters: [{ name: "banDurationInMs", type: "integer", min: 1000 }],
    execute: (_player, [newPunishmentType, banDuration]) => {
        world.setDynamicProperty("database:flagPunishmentType", newPunishmentType);

        if (banDuration) {
            world.setDynamicProperty("database:flagBanDuration", banDuration);
            return {
                status: 0,
                message: "§7[§aMatrix§7] §f" + text("commandSetPunishmentSuccessWithDuration", newPunishmentType, banDuration),
            };
        }

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandSetPunishmentSuccess", newPunishmentType),
        };
    },
} as Command;
