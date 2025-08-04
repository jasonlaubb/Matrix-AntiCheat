import { world } from "@minecraft/server";
import type { Command } from "../main";
export default {
    name: "flaglog",
    description: "Get previous flag logs from anticheat",
    requireOp: true,
    execute: () => {
        const logs = world.getDynamicPropertyIds().filter((id) => id.startsWith("flagrecord:")).sort().map((id) => world.getDynamicProperty(id) as string);
        const message = logs.length > 0 ? "§7[§aMatrix§7] §fPrevious logs:\n" + logs.join("\n") : "§7[§aMatrix§7] §fThere has not been any flag record yet.";
        return { status: 0, message }
    },
} as Command;