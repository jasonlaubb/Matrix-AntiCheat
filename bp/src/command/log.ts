import { system } from "@minecraft/server";
import english from "../data/languages/english";
import type { Command } from "../main";
import { text } from "../util/text";
import { logUI } from "../util/ui";
export default {
    name: "log",
    description: english.commandLogDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandLog",
        description: "commandLogDescription",
    },
    execute: (player) => {
        system.run(() => logUI(player));
        return { status: 0, message: "§7[§aMatrix§7]§7 §f" + text("commandLogOpen") };
    }
} as Command;