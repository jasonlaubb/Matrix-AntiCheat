import { system } from "@minecraft/server";
import { Command } from "../main";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "echestwipe",
    description: english.commandEchestWipeDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandEchestWipe",
        description: "commandEchestWipeDescription",
        param: ["commandEchestWipePlayer"]
    },
    parameters: [
        { name: "player", type: "player" },
    ],
    execute: (_player, [target]) => {
        system.run(() => {
            for (let i = 0; i < 27; i++) {
                target.runCommand(`replaceitem entity @s slot.enderchest ${i} air`);
            }
        });
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandEchestWipeSuccess", target.name)
        };
    },
} as Command;