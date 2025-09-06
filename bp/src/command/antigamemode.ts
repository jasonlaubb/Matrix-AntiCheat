import { world } from "@minecraft/server";
import type { Command } from "../main";
export const antiGamemodeOption = ["adventure", "creative", "surivial", "spectator", "reset"];
export const antiGameModeSetting = ["only", "and", "except", "toggle"];
export default {
    name: "antigamempde",
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
    execute: (_player, [option, setting]) => {
        switch (option) {
            case "adventure": {
                switch (setting) {
                    case "only": {
                        world.setDynamicProperties({
                            "database:antiGma": true,
                            "database:antiGmc": false,
                            "database:antiGms": false,
                            "database:antiGmsp": false
                        });
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to only adventure mode." };
                    }
                    case "and": {
                        world.setDynamicProperty("database:antiGma", true);
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to include adventure mode." };
                    }
                    case "except": {
                        world.setDynamicProperties({
                            "database:antiGma": false,
                            "database:antiGmc": true,
                            "database:antiGms": true,
                            "database:antiGmsp": true
                        });
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to except adventure mode." };
                    }
                    default: {
                        const current = world.getDynamicProperty("database:antiGma") as boolean;
                        world.setDynamicProperty("database:antiGma", !current);
                        return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode adventure mode has been ${!current ? "enabled" : "disabled"}.` };
                    }
                }
            }
            case "creative": {
                switch (setting) {
                    case "only": {
                        world.setDynamicProperties({
                            "database:antiGma": false,
                            "database:antiGmc": true,
                            "database:antiGms": false,
                            "database:antiGmsp": false
                        });
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to only creative mode." };
                    }
                    case "and": {
                        world.setDynamicProperty("database:antiGmc", true);
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to include creative mode." };
                    }
                    case "except": {
                        world.setDynamicProperties({
                            "database:antiGma": true,
                            "database:antiGmc": false,

                            "database:antiGms": true,
                            "database:antiGmsp": true
                        });
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to except creative mode." };
                    }
                    default: {
                        const current = world.getDynamicProperty("database:antiGmc") as boolean;
                        world.setDynamicProperty("database:antiGmc", !current);
                        return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode creative mode has been ${!current ? "enabled" : "disabled"}.` };
                    }
                }
            }
            case "surivial": {
                switch (setting) {
                    case "only": {
                        world.setDynamicProperties({
                            "database:antiGma": false,
                            "database:antiGmc": false,
                            "database:antiGms": true,
                            "database:antiGmsp": false
                        });
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to only surivial mode." };
                    }

                    case "and": {
                        world.setDynamicProperty("database:antiGms", true);
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to include surivial mode." };
                    }
                    case "except": {
                        world.setDynamicProperties({
                            "database:antiGma": true,
                            "database:antiGmc": true,
                            "database:antiGms": false,
                            "database:antiGmsp": true
                        });
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to except surivial mode." };
                    }
                    default: {
                        const current = world.getDynamicProperty("database:antiGms") as boolean;
                        world.setDynamicProperty("database:antiGms", !current);
                        return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode surivial mode has been ${!current ? "enabled" : "disabled"}.` };
                    }
                }
            }
            case "spectator": {
                switch (setting) {
                    case "only": {
                        world.setDynamicProperties({
                            "database:antiGma": false,
                            "database:antiGmc": false,
                            "database:antiGms": false,
                            "database:antiGmsp": true
                        });
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to only spectator mode." };
                    }
                    case "and": {
                        world.setDynamicProperty("database:antiGmsp", true);
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to include spectator mode." };
                    }
                    case "except": {
                        world.setDynamicProperties({
                            "database:antiGma": true,
                            "database:antiGmc": true,
                            "database:antiGms": true,
                            "database:antiGmsp": false
                        });
                        return { status: 0, message: "§7[§aMatrix§7] §fAnti gamemode has been set to except spectator mode." };
                    }
                    default: {
                        const current = world.getDynamicProperty("database:antiGmsp") as boolean;
                        world.setDynamicProperty("database:antiGmsp", !current);
                        return { status: 0, message: `§7[§aMatrix§7] §fAnti gamemode spectator mode has been ${!current ? "enabled" : "disabled"}.` };
                    }
                }
            }
            default: {
                return { status: 1, message: `§7[§aMatrix§7] §fInvalid option! At least one of the following: ${antiGamemodeOption.join(", ")}` };
            }
        }
    }
} as Command;