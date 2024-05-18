import { c } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { validModules } from "../../../../Data/Help";
import { getModuleState, keys, antiCheatModules } from "../../../../Modules/Modules";
import Dynamic from "../../../Config/dynamic_config";

registerCommand({
    name: "toggle",
    description: "Change the toggle of a module",
    parent: false,
    maxArgs: 3,
    minArgs: 2,
    argRequire: [(value) => validModules.includes(value as string), (value) => ["enable", "disable", "default"].includes(value as string), (value) => value == "force"],
    require: (player) => verifier(player, c().commands.toggles),
    executor: async (player, args) => {
        const config = c();
        const prefix = config.commands.prefix;
        if (keys.includes(args[0])) {
            const state = getModuleState(args[0]);
            if ((args[1] == "enable") == (config as any)[args[0]].enabled && args[1] != "default") return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggles.already", with: [args[1]] });
            if ((config as { [key: string]: any })[args[0]].experimental && args[2] != "force" && args[1] == "enable") return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggles.warning", with: [prefix, args[0]] });
            if (args[1] === "enable") {
                antiCheatModules[args[0]].enable();
                Dynamic.set([args[0], "enabled"], true);
            } else if (args[1] == "disable") {
                antiCheatModules[args[0]].disable();
                Dynamic.set([args[0], "enabled"], false);
            } else {
                const configState = (config as { [key: string]: any })[args[0]];
                if (state != configState) state ? antiCheatModules[args[0]].disable() : antiCheatModules[args[0]].enable();
                Dynamic.delete([args[0], "enabled"]);
            }
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "toggles.toggleChange", with: [args[0], args[1]] });
        } else {
            if (args[0] != "default") {
                if ((config as any)[args[1]].enabled == (args[1] == "enable")) return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggles.already", with: [args[1]] });
                Dynamic.set([args[0], "enabled"], args[1] == "enable");
                sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "toggles.toggleChange", with: [args[0], args[1]] });
            } else {
                Dynamic.delete([args[0], "enabled"]);
                sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "toggles.toggleChange", with: [args[0], args[1]] });
            }
        }
    },
});
