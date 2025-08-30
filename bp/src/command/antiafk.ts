import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
export default {
    name: "antiafk",
    requireOp: true,
    description: "Enable/disable anti AFK feature",
    execute: () => {
        const isEnabled = get("antiAfk");
        system.run(() => {
            world.setDynamicProperty("database:antiAfk", !isEnabled);
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} anti AFK feature.` };
    },
} as Command;
