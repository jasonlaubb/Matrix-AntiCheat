import { system } from "@minecraft/server";
import { Command } from "../main";
export default {
    name: "echestwipe",
    description: "Clear all items in a player's enderchest",
    parameters: [
        {
            name: "player",
            type: "player",
        },
    ],
    requireOp: true,
    execute: (_player, [target]) => {
        system.run(() => {
            for (let i = 0; i < 27; i++) {
                target.runCommand(`replaceitem entity @s slot.enderchest ${i} air`);
            }
        });
        return { status: 0, message: `§7[§aMatrix§7] §fWipe all items in ${target.name}'s enderchest` };
    },
} as Command;
