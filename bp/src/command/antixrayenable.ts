import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";

export default {
    name: "antixrayenable",
    requireOp: true,
    description: "Enable anti xray",
    optionalParameters: [
        {
            name: "confirmation",
            type: "string",
        }
    ],
    execute: (player, [confirmation]) => {
        if (confirmation !== player.name)
            return {
                status: 1,
                message: "§7[§aMatrix§7] §fThis action §ccannot be fully reversed§f. Enabling Anti Xray might §edamage§f your server (unfixable) and cause some §cperformance issues§f. Type your player name to continue, add quote if your name includes space.",
            };
        if (get("antiXray") === true) return {
            status: 1,
            message: "§7[§aMatrix§7] §fAnti xray is already enabled. To disable, run '/setBoolean antiXray false'",
        }
        system.run(() => {
            world.setDynamicProperty("database:antiXray", true);
            world.setDynamicProperty("database:banXrayHandler", false);
        });
        return { status: 0, message: "Galgala" };
    }
} as Command;