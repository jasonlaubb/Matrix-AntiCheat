import { get } from "../util/database";
import type property from "../data/config";
import type { Command } from "../main";
import { system, world } from "@minecraft/server";
import { text } from "../util/text";
import english from "../data/languages/english";
import killaura from "../check/killaura";
import autototem from "../check/autototem";
import chestaura from "../check/chestaura";
import zipline from "../check/zipline";
import scaffold from "../check/scaffold";
import extinguisher from "../check/extinguisher";
import breaker from "../check/breaker";
import autotool from "../check/autotool";
import speed from "../check/speed";
import fly from "../check/fly";
import instabreak from "../check/instabreak";
import entityFly from "../check/entityFly";
import elytraFly from "../check/elytraFly";
import autoclicker from "../check/autoclicker";
import xp from "../check/xp";
import shulkerBoxNesting from "../check/shulkerBoxNesting";
import surround from "../check/surround";
import fastThrow from "../check/fastThrow";
import aimAssist from "../check/aimAssist";
import namespoof from "../check/namespoof";
import blockReach from "../check/blockReach";
import invalidSprint from "../check/invalidSprint";
import phase from "../check/phase";
import illegalItem from "../check/illegalItem";
export const detectionList = {
    killaura,
    autototem,
    chestaura,
    zipline,
    scaffold,
    extinguisher,
    breaker,
    autotool,
    speed,
    fly,
    instabreak,
    entityFly,
    elytraFly,
    autoclicker,
    xp,
    shulkerBoxNesting,
    surround,
    fastThrow,
    aimAssist,
    namespoof,
    blockReach,
    invalidSprint,
    phase,
    illegalItem,
};
export function initModules() {
    for (const toggle of Object.values(detectionList)) {
        const isEnabled = get(toggle.property as keyof typeof property);
        if (isEnabled) toggle.enable();
    }
}
export const detection = {
    name: "detection",
    description: english.commandDetectionDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandDetection",
        description: "commandDetectionDescription",
        param: ["commandDetectionName", "commandDetectionToggle"],
    },
    parameters: [
        { name: "detectionName", type: "enum" },
        { name: "enable", type: "boolean" },
    ],
    execute: (_player, [name, enable]) => {
        const toggle = detectionList[name as keyof typeof detectionList];
        const currentEnabled = get(toggle.property as keyof typeof property);
        if (currentEnabled === enable) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandDetectionAlready", name, enable ? "enabled" : "disabled"),
            };
        }

        system.run(() => {
            if (enable) {
                world.setDynamicProperty("database:" + toggle.property, true);
                toggle.enable();
            } else {
                toggle.disable();
                world.setDynamicProperty("database:" + toggle.property, false);
            }
        });

        if (["speed", "killaura", "fly", "invalidSprint"].includes(name) && enable === true) {
            return {
                status: 0,
                message: "§7[§aMatrix§7] §f" + text("commandDetectionRestartRequired"),
            };
        }

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandDetectionToggled", name, enable ? "enabled" : "disabled"),
        };
    },
} as Command;
export const detectionlist = {
    name: "detectionlist",
    description: english.commandDetectionListDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandDetectionList",
        description: "commandDetectionListDescription",
    },
    execute: (_player) => {
        const list = Object.entries(detectionList)
            .map(([name, toggle]) => {
                const status = get(toggle.property as keyof typeof property) ? text("commandDetectionEnabled") : text("commandDetectionDisabled");
                return `§f- ${name}: ${status}`;
            })
            .join("\n");

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandDetectionListHeader") + "\n" + list,
        };
    },
} as Command;
