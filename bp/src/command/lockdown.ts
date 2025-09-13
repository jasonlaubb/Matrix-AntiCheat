import english from "../data/languages/english";
import type { Command } from "../main";
import { world } from "@minecraft/server";
import { text } from "../util/text";
export default {
    name: "lockdown",
    description: english.commandLockdownDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandLockdown",
        description: "commandLockdownDescription"
    },
    execute: () => {
        if (world?.lockdown) {
            delete world.lockdown;
            return {
                status: 0,
                message: "§7[§aMatrix§7] §f" + text("commandLockdownDisabled")
            };
        }

        world.lockdown = true;
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandLockdownEnabled")
        };
    },
} as Command;