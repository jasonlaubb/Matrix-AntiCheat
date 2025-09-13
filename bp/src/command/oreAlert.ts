import type { Command } from "../main";
import { system, world } from "@minecraft/server";
import { get } from "../util/database";
import { oreAlertOff, oreAlertOn } from "../asset/oreAlert";
import english from "../data/languages/english";
import { text } from "../util/text";
export default {
    name: "orealert",
    requireOp: true,
    description: english.commandOreAlertDescription,
    translationDef: {
        actionName: "commandOreAlert",
        description: "commandOreAlertDescription"
    },
    execute: () => {
        const isEnabled = get("oreAlert");
        world.setDynamicProperty("database:oreAlert", !isEnabled);

        system.run(() => {
            if (isEnabled) {
                oreAlertOff();
            } else {
                oreAlertOn();
            }
        });

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandOreAlertSuccess", isEnabled ? text("commandToggleDisable") : text("commandToggleEnable"))
        };
    },
} as Command;