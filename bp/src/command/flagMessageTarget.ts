import type { Command } from "../main";
import { messageTarget } from "../data/prototype";
import { world } from "@minecraft/server";
export default {
    name: "flagmessagetarget",
    description: "Change the flag message's target",
    parameters: [
        {
            name: "messageTarget",
            type: "enum"
        }
    ],
    execute: (_player, [newMessageTarget]) => {
        if (!messageTarget.includes(newMessageTarget)) return { status: 1, message: "" }
    }
} as Command;