import { Config } from "../../matrixAPI";
import { fastText } from "../../util/rawtext";
import type { cmd } from "../../assets/cmd";
import { CustomCommandParamType } from "@minecraft/server";
import config from "../../data/config";
function pathParser (data: any, type: "string" | "number" | "boolean", current: string = "") {
    const gains: string[] = [];
    for (const [key, value] of Object.entries(data)) {
        const path = current ? `${current}.${key}` : key;
        if (typeof value === "object") {
            gains.push(...pathParser(value, type, path));
        } else if (typeof value === type) gains.push(path);
    }
    return gains;
}
export default [
    {
        cc: {
            name: "m:setstring",
            description: "Sets a configuration value with string type.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "m:pathStr",
                    type: CustomCommandParamType.Enum,
                },
                {
                    name: "value",
                    type: CustomCommandParamType.String,
                }
            ]
        },
        cb: (player, path, value) => {
            Config.set(path, value);
            player.sendMessage(
                fastText()
                    .addText("§bMatrix§a+ §7> §g")
                    .addTran("command.set.success", path as string, value as string)
                    .build()
            );
        },
        en: {
            id: "m:pathStr",
            items: pathParser(config, "string"),
        }
    },
    {
        cc: {
            name: "m:setboolean",
            description: "Sets a configuration value with boolean type.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "m:pathBool",
                    type: CustomCommandParamType.Enum,
                },
                {
                    name: "value",
                    type: CustomCommandParamType.Boolean,
                }
            ]
        },
        cb: (player, path, value) => {
            Config.set(path, value);
            player.sendMessage(
                fastText()
                    .addText("§bMatrix§a+ §7> §g")
                    .addTran("command.set.success", path as string, value as string)
                    .build()
            );
        },
        en: {
            id: "m:pathBool",
            items: pathParser(config, "boolean"),
        }
    },
    {
        cc: {
            name: "m:setnumber",
            description: "Sets a configuration value with number type.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "m:pathNum",
                    type: CustomCommandParamType.Enum,
                },
                {
                    name: "value",
                    type: CustomCommandParamType.Boolean,
                }
            ]
        },
        cb: (player, path, value) => {
            Config.set(path, value);
            player.sendMessage(
                fastText()
                    .addText("§bMatrix§a+ §7> §g")
                    .addTran("command.set.success", path as string, value as string)
                    .build()
            );
        },
        en: {
            id: "m:pathNum",
            items: pathParser(config, "number"),
        }
    },
] as cmd[];