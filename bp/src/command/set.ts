import type { Command } from "../main";
import { world, system } from "@minecraft/server";
import { getPropertyType } from "../util/propertyClassifier";
import property from "../data/property";
export const setBoolean = {
    name: "setboolean",
    description: "Change a boolean value (true/false) of config",
    requireOp: true,
    parameters: [
        {
            name: "booleanProperty",
            type: "enum",
        },
        {
            name: "value",
            type: "boolean",
        },
    ],
    execute: (_player, [id, value]) => {
        if (!getPropertyType().booleanValue.includes(id)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid property id..."}
        system.run(() => world.setDynamicProperty("database:" + id, value));
        return {
            status: 0,
            message: `§7[§aMatrix§7] §fSuccessfully changed property §e${id}§f to §e${value ? "true" : "false"}`,
        };
    },
} as Command;
export const setString = {
    name: "setstring",
    description: "Change a string value of config",
    requireOp: true,
    parameters: [
        {
            name: "stringProperty",
            type: "enum",
        },
        {
            name: "value",
            type: "string",
        },
    ],
    execute: (_player, [id, value]) => {
        if (!getPropertyType().stringValue.includes(id)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid property id..."}
        system.run(() => world.setDynamicProperty("database:" + id, value));
        return {
            status: 0,
            message: `§7[§aMatrix§7] §fSuccessfully changed property §e${id}§f to §e${value}`,
        };
    },
} as Command;
export const setNumber = {
    name: "setnumber",
    description: "Change a string value of config",
    requireOp: true,
    parameters: [
        {
            name: "stringProperty",
            type: "enum",
        },
        {
            name: "value",
            type: "float",
        },
    ],
    execute: (_player, [id, value]) => {
        if (!getPropertyType().numberValue.includes(id)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid property id..."};
        system.run(() => world.setDynamicProperty("database:" + id, value));
        return {
            status: 0,
            message: `§7[§aMatrix§7] §fSuccessfully changed property §e${id}§f to §e${value}`,
        };
    },
} as Command;
export const resetConfig = {
    name: "resetconfig",
    description: "Reset all the changed properties (config) saved in dynamic properties",
    requireOp: true,
    optionalParameters: [
        {
            name: "confirmation",
            type: "string",
        },
    ],
    execute: (player, [confirmation]) => {
        if (confirmation !== player.name)
            return {
                status: 1,
                message: "§7[§aMatrix§7] §fType your player name to continue, add quote if your name includes space.",
            };
        const matches = world.getDynamicPropertyIds().filter((id) => id.startsWith("database:"));
        if (matches.length === 0)
            return {
                status: 1,
                message: "§7[§aMatrix§7] §fYou have never changed any property...",
            };
        system.run(() => matches.forEach((id) => world.setDynamicProperty(id)));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §fSucessfully reset the config.",
        };
    },
} as Command;
export const clearProperty = {
    name: "discard",
    description: "Reset 1 of the property (config) saved in dyanamic properties",
    requireOp: true,
    parameters: [
        {
            name: "property",
            type: "enum",
        },
    ],
    execute: (_player, [id]) => {
        if (!world.getDynamicProperty("database:" + id))
            return {
                status: 1,
                message: "§7[§aMatrix§7] §fTarget property has not been changed.",
            };
        system.run(() => world.setDynamicProperty("database:" + id));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §fSucessfully reset the target property.",
        };
    },
} as Command;
export const getProperty = {
    name: "getproperty",
    description: "View 1 of the property (config) saved in data and dynamic properties",
    requireOp: true,
    parameters: [
        {
            name: "property",
            type: "enum",
        },
    ],
    execute: (_player, [id]) => {
        if (!Object.keys(property).includes(id)) return { status: 1, message: "§7[§aMatrix§7] §fInvalid property id..."};
        const { type, value } = property[id as keyof typeof property];
        return {
            status: 0,
            message: `§7[§aMatrix§7] §fThe value of property ${id}:\nType: §e${type}§f\nStatic data: §e${value}§r§f\nDynamic property: §e${world.getDynamicProperty("database:" + id) ?? "--"}`,
        };
    },
} as Command;
