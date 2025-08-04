import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
export default {
    name: "chatrank",
    requireOp: true,
    description: "Enable/disable chat rank feature",
    execute: () => {
        const isEnabled = get("chatRankEnable");
        system.run(() => {
            world.setDynamicProperty("database:chatRankEnable", !isEnabled);
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} chat rank feature. You can modify the pattern or other settings by slash command!` };
    },
} as Command;
