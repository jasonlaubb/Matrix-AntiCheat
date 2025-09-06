import { world } from "@minecraft/server";
import type { Command } from "../main";
const GAMEMODES = ["adventure", "creative", "survival", "spectator"];
export const antiGamemodeOption = [...GAMEMODES, "reset"];
export const antiGameModeSetting = ["only", "and", "except", "toggle"];
const gmKey: Record<typeof GAMEMODES[number], string> = {
    adventure: "database:antiGma",
    creative: "database:antiGmc",
    survival: "database:antiGms",
    spectator: "database:antiGmsp",
};
function setAllGamemodes(state: boolean) {
    Object.values(gmKey).forEach(key => world.setDynamicProperty(key, state));
}
function setOnlyGamemode(gamemode: keyof typeof gmKey) {
    Object.entries(gmKey).forEach(([gm, key]) => {
        world.setDynamicProperty(key, gm === gamemode);
    });
}
function setExceptGamemode(gamemode: keyof typeof gmKey) {
    Object.entries(gmKey).forEach(([gm, key]) => {
        world.setDynamicProperty(key, gm !== gamemode);
    });
}
export default {
    name: "antigamemode",
    description: "Adjust the settings of anti gamemode.",
    requireOp: true,
    parameters: [
        {
            name: "antiGameModeOption",
            type: "enum",
        }
    ],
    optionalParameters: [
        {
            name: "antiGameModeSetting",
            type: "enum",
        }
    ],
    execute: (_player, [optionRaw, settingRaw]) => {
        const option = optionRaw?.toLowerCase();
        const setting = settingRaw?.toLowerCase();
        if (option === "reset") {
            setAllGamemodes(false);
            return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode settings have been reset (all modes allowed)." };
        }
        if (!GAMEMODES.includes(option as any)) {
            return { status: 1, message: `§7[§aMatrix§7] §fInvalid option! Must be one of: ${antiGamemodeOption.join(", ")}` };
        }
        const gmProperty = gmKey[option as keyof typeof gmKey];
        switch (setting) {
            case "only":
                setOnlyGamemode(option as keyof typeof gmKey);
                return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode has been set to only detect ${option} mode.` };
            case "and":
                world.setDynamicProperty(gmProperty, true);
                return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode will now also detect ${option} mode.` };

            case "except":
                setExceptGamemode(option as keyof typeof gmKey);
                return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode has been set to detect the gamemode which is not ${option} mode.` };
            case "toggle":
            case undefined: {
                const current = Boolean(world.getDynamicProperty(gmProperty));
                world.setDynamicProperty(gmProperty, !current);
                return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode ((${option} mode) has been ${!current ? "enabled" : "disabled"}.` };
            }
            default:
                return { status: 1, message: `§7[§aMatrix§7] §fInvalid setting! Must be one of: ${antiGameModeSetting.join(", ")}` };
        }
    }
} as Command;