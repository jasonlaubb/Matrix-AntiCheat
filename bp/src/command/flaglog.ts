import { world } from "@minecraft/server";
import type { Command } from "../main";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "flaglog",
    description: english.commandFlagLogDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandFlagLog",
        description: "commandFlagLogDescription"
    },
    execute: () => {
        const logs = world
            .getDynamicPropertyIds()
            .filter((id) => id.startsWith("flagrecord:"))
            .sort()
            .map((id) => world.getDynamicProperty(id) as string);

        const message = logs.length > 0
            ? "§7[§aMatrix§7] §f" + text("commandFlagLogSuccess", logs.join("\n"))
            : "§7[§aMatrix§7] §f" + text("commandFlagLogNone");

        return { status: 0, message };
    },
} as Command;