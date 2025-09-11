import { world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
import english from "../data/languages/english";
import { text } from "../util/text";
export default {
    name: "antispam",
    requireOp: true,
    translationDef: {
        actionName: "commandAntiSpam",
        description: "commandAntiAfkDescription",
    },
    description: english.commandAntiSpamDescription,
    execute: () => {
        const isEnabled = get("antiSpam");
        world.setDynamicProperty("database:antiSpam", !isEnabled);
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandAntiSpamSuccess", isEnabled ? text("commandToggleDisable") : text("commandToggleEnable"))};
    },
} as Command;
