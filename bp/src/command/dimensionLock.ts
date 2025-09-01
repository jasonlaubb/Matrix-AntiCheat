import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
import { checkNetherEnd, endNetherLockOff, endNetherLockOn } from "../asset/endNetherLock";
export const endLock = {
    name: "endlock",
    requireOp: true,
    description: "Lock the end (dimension)",
    execute: () => {
        const isEnabled = get("endLock");
        const isEnabled2 = get("netherLock");
        world.setDynamicProperty("database:endLock", !isEnabled);
        system.run(() => {
            if (isEnabled2) return;
            if (isEnabled) {
                endNetherLockOff();
            } else {
                checkNetherEnd();
                endNetherLockOn();
            }
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} end lock.` };
    },
} as Command;
export const netherLock = {
    name: "netherlock",
    requireOp: true,
    description: "Lock nether (dimension)",
    execute: () => {
        const isEnabled = get("netherLock");
        const isEnabled2 = get("endLock");
        world.setDynamicProperty("database:netherLock", !isEnabled);
        system.run(() => {
            if (isEnabled2) return;
            if (isEnabled) {
                endNetherLockOff();
            } else {
                checkNetherEnd();
                endNetherLockOn();
            }
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} nether lock.` };
    },
} as Command;
