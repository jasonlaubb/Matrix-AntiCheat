import { system, world } from "@minecraft/server";
import { worldBorderOff, worldBorderOn } from "../asset/worldBorder";
import type { Command } from "../main";
import { get } from "../util/database";
import english from "../data/languages/english";
import { text } from "../util/text";
export default {
    name: "worldborder",
    requireOp: true,
    description: english.commandWorldBorderDescription,
    translationDef: {
        actionName: "commandWorldBorder",
        description: "commandWorldBorderDescription",
    },
    execute: () => {
        const isEnabled = get("worldBorder");
        world.setDynamicProperty("database:worldBorder", !isEnabled);

        system.run(() => {
            if (isEnabled) {
                worldBorderOff();
            } else {
                worldBorderOn();
            }
        });

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandWorldBorderSuccess", isEnabled ? text("commandToggleDisable") : text("commandToggleEnable")),
        };
    },
} as Command;
