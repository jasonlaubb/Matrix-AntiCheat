import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
import { disableAntiGameMode, enableAntiGameMode } from "../asset/antiGamemode";
import english from "../data/languages/english";
import { text } from "../util/text";
const GAMEMODES = ["adventure", "creative", "survival", "spectator"];
export const antiGameModeOption = [...GAMEMODES, "reset"];
export const antiGameModeSetting = ["only", "and", "except", "toggle"];
const gmKey: Record<(typeof GAMEMODES)[number], string> = {
    adventure: "database:antiGma",
    creative: "database:antiGmc",
    survival: "database:antiGms",
    spectator: "database:antiGmsp",
};
function setAllGamemodes(state: boolean) {
    Object.values(gmKey).forEach((key) => world.setDynamicProperty(key, state));
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
    description: english.commandAntiGM,
    requireOp: true,
    translationDef: {
        actionName: "commandAntiGM",
        description: "commandAntiGMDescription",
        param: ["commandAntiGMAntiGameModeOption"],
        optionalParam: ["commandAntiGMAntiGameModeSetting"],
    },
    parameters: [
        {
            name: "antiGameModeOption",
            type: "enum",
        },
    ],
    optionalParameters: [
        {
            name: "antiGameModeSetting",
            type: "enum",
        },
    ],
    execute: (_player, [optionRaw, settingRaw]) => {
        const option = optionRaw?.toLowerCase();
        const setting = settingRaw?.toLowerCase();
        if (option === "reset") {
            setAllGamemodes(false);
            return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandAntiGMReset") };
        }
        const gmProperty = gmKey[option as keyof typeof gmKey];
        switch (setting) {
            case "only":
                setOnlyGamemode(option as keyof typeof gmKey);
                switchGamemodeToggle();
                return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandAntiGMOnly", option) };
            case "and":
                world.setDynamicProperty(gmProperty, true);
                switchGamemodeToggle();
                return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandAntiGMAlso", option) };

            case "except":
                setExceptGamemode(option as keyof typeof gmKey);
                switchGamemodeToggle();
                return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandAntiGMExcept", option) };
            case "toggle":
            case undefined: {
                const current = world.getDynamicProperty(gmProperty) as boolean;
                world.setDynamicProperty(gmProperty, !current);
                switchGamemodeToggle();
                return { status: 0, message: `§7[§aMatrix§7] §f` + text("commandAntiGMToggle", option, current ? text("commandToggleDisable") : text("commandToggleEnable")) };
            }
            default:
                return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandAntiGMInvalid", antiGameModeSetting.join(", ")) };
        }
    },
} as Command;
