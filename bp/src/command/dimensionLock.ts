import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
import { checkNetherEnd, endNetherLockOff, endNetherLockOn } from "../asset/endNetherLock";
import english from "../data/languages/english";
import { text } from "../util/text";
export const endLock = {
    name: "endlock",
    requireOp: true,
    description: english.commandEndLockDescription,
    translationDef: {
        actionName: "commandEndLock",
        description: "commandEndLockDescription"
    },
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

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text(isEnabled ? "commandEndLockDisabled" : "commandEndLockEnabled")
        };
    },
} as Command;
export const netherLock = {
    name: "netherlock",
    requireOp: true,
    description: english.commandNetherLockDescription,
    translationDef: {
        actionName: "commandNetherLock",
        description: "commandNetherLockDescription"
    },
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

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text(isEnabled ? "commandNetherLockDisabled" : "commandNetherLockEnabled")
        };
    },
} as Command;