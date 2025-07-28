import killaura from "../check/killaura";
import autototem from "../check/autototem";
import chestaura from "../check/chestaura";
import zipline from "../check/zipline";
import scaffold from "../check/scaffold";
import extinguisher from "../check/extinguisher";
import breaker from "../check/breaker";
import instabreak from "../check/instabreak";
import { get } from "../util/database";
import type property from "../data/property";
import type { Command } from "../main";
import { system, world } from "@minecraft/server";
export const detectionList = {
    killaura,
    autototem,
    chestaura,
    zipline,
    scaffold,
    extinguisher,
    breaker,
    instabreak,
};
export function initModules() {
    for (const toggle of Object.values(detectionList)) {
        const isEnabled = get(toggle.property as keyof typeof property);
        if (isEnabled) toggle.enable();
    }
}
export const detect = {
    name: "detection",
    description: "Enable/disable detection of anticheat",
    requireOp: true,
    parameters: [
        {
            name: "detectionName",
            type: "enum",
        },
        {
            name: "enable",
            type: "boolean",
        },
    ],
    execute: (_player, [name, enable]) => {
        const toggle = detectionList[name as keyof typeof detectionList];
        if (!toggle) {
            return { status: 1, message: `§7[§aMatrix§7] §fInvalid detection... At least one of the following: ${Object.keys(detectionList).join(", ")}` };
        }
        const currentEnabled = get(toggle.property as keyof typeof property);
        if (currentEnabled === enable) {
            return { status: 1, message: `§7[§aMatrix§7] §f${name} detection is already ${enable ? "enabled" : "disabled"}!` };
        }
        system.run(() => {
            if (enable) {
                world.setDynamicProperty(toggle.property, true);
                toggle.enable();
            } else {
                toggle.disable();
                world.setDynamicProperty(toggle.property, false);
            }
        });
        return { status: 0, message: `§7[§aMatrix§7] §f${name} detection has been ${enable ? "enabled" : "disabled"}!` };
    },
} as Command;
export const detectionlist = {
    name: "detectionlist",
    description: "List all detection including their status",
    requireOp: true,
    execute: (_player) => {
        return {
            status: 0,
            message: `§7[§aMatrix§7] §fDetection list:\n${Object.entries(detectionList)
                .map(([name, toggle]) => `§f- ${name}: ${get(toggle.property as keyof typeof property) ? "§aEnabled" : "§cDisabled"}`)
                .join("\n")}`,
        };
    },
} as Command;
