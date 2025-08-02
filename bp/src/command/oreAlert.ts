import type { Command } from "../main";
import { system, world } from "@minecraft/server";
import { get } from "../util/database";
import { oreAlertOff, oreAlertOn } from "../asset/oreAlert";
export default {
    name: "orealert",
    description: "Enable/disable ore alert",
    requireOp: true,
    execute: () => {
        const isEnabled = get("oreAlert");
        system.run(() => {
            if (isEnabled) {
                oreAlertOff();
            } else oreAlertOn();
            world.setDynamicProperty("database:oreAlert", !isEnabled);
        });
        return { status: 0, message: "§7[§aMatrix§7] §fSuccesfully " + (isEnabled ? "disabled" : "enabled") + " ore alert." };
    },
} as Command;
