import { system, world } from "@minecraft/server";
import { worldBorderOff, worldBorderOn } from "../asset/worldBorder";
import type { Command } from "../main";
import { get } from "../util/database";
export const endLock = {
    name: "endlock",
    requireOp: true,
    description: "Lock the end (dimension)",
    execute: () => {
        const isEnabled = get("endLock");
        const isEnabled2 = get("netherLock");
        system.run(() => {
            if (isEnabled2) return;
            if (isEnabled) {
                worldBorderOff();
            } else worldBorderOn();
            world.setDynamicProperty("database:worldBorder", !isEnabled);
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} end lock.` };
    },
} as Command;
export const netherLock = {
    name: "netherlock",
    requireOp: true,
    description: "Lock the end (dimension)",
    execute: () => {
        const isEnabled = get("netherLock");
        const isEnabled2 = get("endLock");
        system.run(() => {
            if (isEnabled2) return;
            if (isEnabled) {
                worldBorderOff();
            } else worldBorderOn();
            world.setDynamicProperty("database:worldBorder", !isEnabled);
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} nether lock.` };
    },
} as Command;