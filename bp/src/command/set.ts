import type { Command } from "../main";
import { world, system } from "@minecraft/server";
import { getPropertyType } from "../util/propertyClassifier";
import property from "../data/property";
import { MessageFormData } from "@minecraft/server-ui";
import english from "../data/languages/english";
import { text } from "../util/text";
import { isReadonly } from "../util/database";
export const setBoolean = {
    name: "setboolean",
    description: english.commandSetBooleanDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandSetBoolean",
        description: "commandSetBooleanDescription",
        param: ["commandSetBooleanProperty", "commandSetBooleanValue"],
    },
    parameters: [
        { name: "booleanProperty", type: "enum" },
        { name: "value", type: "boolean" },
    ],
    execute: (_player, [id, value]) => {
        if (!getPropertyType().booleanValue.includes(id)) {
            return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandInvalidProperty") };
        }
        if (isReadonly(id)) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandPropertyIsReadonly") };
        system.run(() => world.setDynamicProperty("database:" + id, value));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandSetBooleanSuccess", id, value ? "true" : "false"),
        };
    },
} as Command;

export const setString = {
    name: "setstring",
    description: english.commandSetStringDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandSetString",
        description: "commandSetStringDescription",
        param: ["commandSetStringProperty", "commandSetStringValue"],
    },
    parameters: [
        { name: "stringProperty", type: "enum" },
        { name: "value", type: "string" },
    ],
    execute: (_player, [id, value]) => {
        if (isReadonly(id)) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandPropertyIsReadonly") };
        system.run(() => world.setDynamicProperty("database:" + id, value));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandSetStringSuccess", id, value),
        };
    },
} as Command;

export const setNumber = {
    name: "setnumber",
    description: english.commandSetNumberDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandSetNumber",
        description: "commandSetNumberDescription",
        param: ["commandSetNumberProperty", "commandSetNumberValue"],
    },
    parameters: [
        { name: "numberProperty", type: "enum" },
        { name: "value", type: "float" },
    ],
    execute: (_player, [id, value]) => {
        if (isReadonly(id)) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandPropertyIsReadonly") };
        system.run(() => world.setDynamicProperty("database:" + id, value));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandSetNumberSuccess", id, value),
        };
    },
} as Command;

export const resetConfig = {
    name: "resetconfig",
    description: english.commandResetConfigDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandResetConfig",
        description: "commandResetConfigDescription",
    },
    execute: (player) => {
        const matches = world.getDynamicPropertyIds().filter((id) => id.startsWith("database:"));
        if (matches.length === 0) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandResetConfigEmpty"),
            };
        }
        system.run(() => {
            new MessageFormData()
                .title(text("commandResetConfigConfirmTitle"))
                .body(text("commandResetConfigConfirmBody"))
                .button1(text("commandResetConfigConfirmYes"))
                .button2(text("commandResetConfigConfirmNo"))
                .show(player)
                .then((res) => {
                    if (res.canceled || res.selection === 1) return;
                    matches.forEach((id) => world.setDynamicProperty(id));
                    player.sendMessage("§7[§aMatrix§7] §f" + text("commandResetConfigSuccess"));
                });
        });
        return { status: 0 };
    },
} as Command;

export const clearProperty = {
    name: "discard",
    description: english.commandClearPropertyDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandClearProperty",
        description: "commandClearPropertyDescription",
        param: ["commandClearPropertyTarget"],
    },
    parameters: [{ name: "property", type: "enum" }],
    execute: (_player, [id]) => {
        if (!world.getDynamicProperty("database:" + id)) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandClearPropertyNotChanged"),
            };
        }
        if (isReadonly(id)) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandPropertyIsReadonly") };
        system.run(() => world.setDynamicProperty("database:" + id));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandClearPropertySuccess"),
        };
    },
} as Command;

export const getProperty = {
    name: "getproperty",
    description: english.commandGetPropertyDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandGetProperty",
        description: "commandGetPropertyDescription",
        param: ["commandGetPropertyTarget"],
    },
    parameters: [{ name: "property", type: "enum" }],
    execute: (_player, [id]) => {
        const { type, value } = property[id as keyof typeof property];
        const dynamic = world.getDynamicProperty("database:" + id) ?? "--";
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandGetPropertySuccess", id, type, "" + value, "" + dynamic),
        };
    },
} as Command;
