import type { Command } from "../main";
import { world } from "@minecraft/server";
export default {
    name: "lockdown",
    description: "Lockdown the server",
    requireOp: true,
    execute: () => {
        if (world?.lockdown) {
            delete world.lockdown;
            return { status: 0, message: "§7[§aMatrix§7] §fServer is no longer locked down." };
        }
        world.lockdown = true;
        return { status: 0, message: "§7[§aMatrix§7] §fServer is now locked down, new players except operator will be kicked." };
    },
} as Command;