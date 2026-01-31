import { commands } from "../data/commands";
import type { Command } from "../main";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "commandlist",
    description: english.commandListDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandList",
        description: "commandListDescription",
    },
    execute: () => {
        const helpHeader = text("commandListHeader");
        const helpBody = commands
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(({ name, optionalParameters, parameters }, i, arr) => {
                const def = arr[i].translationDef;
                let line = `§f/${name}`;
                parameters?.forEach(({ type }, j) => {
                    line += ` <${text(def.param![j]!)}: ${type.includes("player") ? "player" : type}>`;
                });
                optionalParameters?.forEach(({ type }, j) => {
                    line += ` [${text(def.optionalParam![j]!)}: ${type.includes("player") ? "player" : type}]`;
                });
                return line + `§a ~ §f${text(def.description)}`;
            })
            .join("\n");

        return {
            status: 0,
            message: `§7[§aMatrix§7] §f${helpHeader}\n${helpBody}`,
        };
    },
} as Command;
