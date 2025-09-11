import { commands } from "../data/commands";
import type { Command } from "../main";
export default {
    name: "commandlist",
    description: "Show all of the slash commands of Matrix Anticheat available",
    requireOp: true,
    execute: () => {
            const helpMessage = "§7[§aMatrix§7] Showing all the slash commands of Matrix anticheat:\n" +
            commands.sort(({ name: a }, { name: b }) => a.localeCompare(b))
                .map(({ name, optionalParameters, parameters }, i, arr) => {
                    const def = arr[i].translationDef;
                    let text = `§f/${name}`;
                    parameters?.forEach(({ name, type }, i) => {
                        text += ` <${def.param[i]}: ${type.includes("player") ? "player" : type}>`;
                    });
                    optionalParameters?.forEach(({ name, type }) => {
                        text += ` [${def.optionalParam[i]}: ${type.includes("player") ? "player" : type}]`;
                    });
                    return text + `§a ~ §f${def.description}`;
                })
                .join("\n");
        return { status: 0, message: helpMessage };
    },
} as Command;