import { world } from "@minecraft/server";
import type { Command } from "../main";
import { languageList, updateLanguage } from "../util/text";
export default {
    name: "language",
    description: "Switch the system language of matrix anticheat",
    requireOp: true,
    parameters: [
        {
            name: "language",
            type: "enum"
        }
    ],
    execute: (_player, [language]) => {
        if (!Object.keys(languageList).includes(language)) return { status: 1, message: "§7[§aMatrix§7] §fUnsupported or invalid language!" };
        world.setDynamicProperty("database:systemLanguage", language);
        updateLanguage();
        return { status: 0, message: "§7[§aMatrix§7] §fSwitched language to §e" + language };
    }
} as Command;