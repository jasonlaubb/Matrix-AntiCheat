import { world } from "@minecraft/server";
import type { Command } from "../main";
import { text, updateLanguage } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "language",
    description: english.commandLanguageDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandLanguage",
        description: "commandLanguageDescription",
        param: ["commandLanguageValue"],
    },
    parameters: [{ name: "language", type: "enum" }],
    execute: (_player, [language]) => {
        world.setDynamicProperty("database:systemLanguage", language);
        updateLanguage();

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandLanguageSuccess", language),
        };
    },
} as Command;
