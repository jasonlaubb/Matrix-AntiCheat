import { world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "antiafk",
    requireOp: true,
    description: english.commandAntiAfkDescription,
    translationDef: {
        actionName: "commandAntiAfk",
        description: "commandAntiAfkDescription",
    },
    execute: () => {
        const isEnabled = get("antiAfk");
        world.setDynamicProperty("database:antiAfk", !isEnabled);
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandAntiAfkSuccess", isEnabled ? text("commandToggleDisable") : text("commandToggleEnable")) };
    },
} as Command;
