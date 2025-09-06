import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
import { disableAntiGameMode, enableAntiGameMode } from "../asset/antiGamemode";
const GAMEMODES = ["adventure", "creative", "survival", "spectator"];
export const antiGameModeOption = [...GAMEMODES, "reset"];
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
function switchGamemodeToggle() {
    system.run(() => {
        const enableAtleast1 = get("antiGma") || get("antiGmc") || get("antiGms") || get("antiGmsp");
        if (enableAtleast1) {
            enableAntiGameMode();
        } else disableAntiGameMode();
    });
}
export default {
    name: "antigamemode",
    description: "Adjust the settings of anti gamemode (Don't ban default gamemode!!!)",
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
            return { status: 1, message: `§7[§aMatrix§7] §fInvalid option! Must be one of: ${antiGameModeOption.join(", ")}` };
        }
        const gmProperty = gmKey[option as keyof typeof gmKey];
        switch (setting) {
            case "only":
                setOnlyGamemode(option as keyof typeof gmKey);
                switchGamemodeToggle();
                return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode has been set to only detect ${option} mode.` };
            case "and":
                world.setDynamicProperty(gmProperty, true);
                switchGamemodeToggle();
                return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode will now also detect ${option} mode.` };

            case "except":
                setExceptGamemode(option as keyof typeof gmKey);
                switchGamemodeToggle();
                return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode has been set to detect the gamemode which is not ${option} mode.` };
            case "toggle":
            case undefined: {
                const current = world.getDynamicProperty(gmProperty) as boolean;
                world.setDynamicProperty(gmProperty, !current);
                switchGamemodeToggle();
                return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode ((${option} mode) has been ${!current ? "enabled" : "disabled"}.` };
            }
            default:
                return { status: 1, message: `§7[§aMatrix§7] §fInvalid setting! Must be one of: ${antiGameModeSetting.join(", ")}` };
        }
    }
} as Command;