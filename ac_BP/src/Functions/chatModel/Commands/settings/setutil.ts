import { c } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import Dynamic from "../../../Config/dynamic_config";

registerCommand({
    name: "setutil",
    description: "Change the toggle of a utility module",
    parent: false,
    maxArgs: 3,
    minArgs: 2,
    argRequire: [undefined, (value) => ["enable", "disable", "default"].includes(value as string), (value) => value == "force"],
    require: (player) => verifier(player, c().commands.setutil),
    executor: async (player, args) => {
        const config = c();
        const prefix = config.commands.prefix;
        const moduleids = ["chatRank", "dimensionLock"]
        if (moduleids.includes(args[0])) {
            // const state = Dynamic.get([args[0], "enabled"]);
            if ((args[1] == "enable") == (config as any)[args[0]].enabled && args[1] != "default") return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggles.already", with: [args[1]] });
            if ((config as { [key: string]: any })[args[0]].experimental && args[2] != "force" && args[1] == "enable") return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggles.warning", with: [prefix, args[0]] });
            if (args[1] === "enable") {
                Dynamic.set([args[0], "enabled"], true);
            } else if (args[1] == "disable") {
                Dynamic.set([args[0], "enabled"], false);
            } else {
                Dynamic.delete([args[0], "enabled"]);
            }
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "toggles.toggleChange", with: [args[0], args[1]] });
        } else sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggle.unknown", with: [args[0]] });
    },
});
