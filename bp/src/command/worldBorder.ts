import { system } from "@minecraft/server";
import { worldBorderOff, worldBorderOn } from "../asset/worldBorder";
import type { Command } from "../main";
import { get } from "../util/database";
export default {
    name: "worldborder",
    requireOp: true,
    description: "Enable/disable world border feature",
    execute: () => {
        const isEnabled = get("worldBorder");
        system.run(() => {
            if (isEnabled) {
                worldBorderOff();
            } else worldBorderOn();
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} world border feature. To change the border size, you can use '/setnumber worldBorderSize <size>'` };
    },
} as Command;
