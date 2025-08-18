import type { Command } from "../main";
import { messageTarget } from "../data/prototype";
import { world } from "@minecraft/server";
export default {
    name: "flagmsgtarget",
    description: "Change the flag message's target",
    requireOp: true,
    parameters: [
        {
            name: "messageTarget",
            type: "enum",
        },
    ],
    execute: (_player, [newMessageTarget]) => {
        if (!messageTarget.includes(newMessageTarget)) return { status: 1, message: "§7[§aMatrix§7] §fUnknown message target: " + newMessageTarget };
        world.setDynamicProperty("database:flagMessageTarget", newMessageTarget);
        return { status: 0, message: "§7[§aMatrix§7] §fChanged flag message target to §e" + newMessageTarget };
    },
} as Command;
