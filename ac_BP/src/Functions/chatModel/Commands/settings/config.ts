import { isAdmin, rawstr } from "../../../../Assets/Util";
import { registerCommand } from "../../CommandHandler";
import Dynamic from "../../../Config/dynamic_config";

registerCommand(
    {
        name: "config",
        description: "Dynamc config related commands",
        parent: true,
        require: (player) => isAdmin(player),
    },
    {
        name: "set",
        description: "Set a config value",
        argRequire: [(value) => ["string", "number", "array", "boolean"].includes(value as string), (value) => new RegExp(/([a-zA-Z]+\.?)+/g).test(value as string), (value) => new RegExp(/^(\d+$|^\d+\.\d+)/).test(value as string)],
        maxArgs: 3,
        minArgs: 3,
        executor: async (player, args) => {
            const [type, key, value] = args;
            const loc = key.split(".");
            const path = Dynamic.get(loc);
            if (path === undefined) return player.sendMessage(new rawstr(true, "c").tra("config.nullpath", key).parse());
            if (!Array.isArray(path) && !["string", "number", "boolean"].includes(typeof path)) return player.sendMessage(new rawstr(true, "c").tra("config.invalidpath", typeof path).parse());
            switch (type) {
                case "string": {
                    Dynamic.set(loc, value);
                    break;
                }
                case "boolean": {
                    if (value != "true" && value != "false" && value != "undefined") return player.sendMessage(new rawstr(true, "c").tra("config.nab").parse());
                    Dynamic.set(loc, value == "true");
                    break;
                }
                case "number": {
                    const number = Number(value);
                    if (Number.isNaN(number)) return player.sendMessage(new rawstr(true, "c").tra("config.nan").parse());
                    Dynamic.set(loc, number);
                    break;
                }
                case "array": {
                    const regexpArr = /^(("|'[^"|']+"|')|(\d+$|^\d+\.\d+)\,?)+$/g;
                    const singleArr = /(("|'[^"|']+"|')|(\d+$|^\d+\.\d+)\,?)/g;
                    if (!regexpArr.test(value)) return player.sendMessage(new rawstr(true, "c").tra("config.naa").parse());
                    Dynamic.set(
                        loc,
                        value.match(singleArr)!.map((v) => {
                            if (v.startsWith("")) {
                                return v.slice(1, -1);
                            } else {
                                return Number(v);
                            }
                        })
                    );
                    break;
                }
                default:
                    throw new Error("Type Error: Type out of range (string, number, array)");
            }

            player.sendMessage(new rawstr(true, "g").tra("config.set", key, value).parse());
        },
    }
);
