import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
export default {
    name: "antispam",
    requireOp: true,
    description: "Enable/disable antispam feature",
    execute: () => {
        const isEnabled = get("antiSpam");
        system.run(() => {
            world.setDynamicProperty("database:worldBorder", !isEnabled);
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} anti spam feature. You can modify the pattern or other settings by slash command!` };
    },
} as Command;
