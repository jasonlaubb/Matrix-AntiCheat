import { c } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { validModules } from "../../../../Data/Help";
import { getModuleState, keys, antiCheatModules } from "../../../../Modules/Modules";
import { world } from "@minecraft/server";

registerCommand ({
    name: "toggle",
    description: "Change the toggle of a module",
    parent: false,
    maxArgs: 3,
    minArgs: 2,
    argRequire: [
        (value) => validModules.includes(value as string),
        (value) => ["enable", "disable", "default"].includes(value as string),
        (value) => value == "force"
    ],
    require: (player) => verifier (player, c().commands.toggles),
    executor: async (player, args) => {
        const config = c();
        const prefix = config.commands.prefix;
        if (keys.includes(args[0])) {
            const state = getModuleState(args[0]);
            if ((args[1] == "enable") === getModuleState(args[0]) && args[1] != "default") return sendRawText(player, 
                { text: "§bMatrix §7>§c " },
                { translate: "toggles.already", with: [args[1]] },
            );
            if ((config as { [key: string]: any })[args[0]].experimental && args[2] != "force" && args[1] == "enable")
                return sendRawText (player, 
                    { text: "§bMatrix §7>§c " },
                    { translate: "toggles.warning", with: [prefix, args[0]] },
                )
            if (args[1] === "enable") {
                antiCheatModules[args[0]].enable();
                world.setDynamicProperty(args[0], true);
            } else if (args[1] == "disable") {
                antiCheatModules[args[0]].disable();
                world.setDynamicProperty(args[0], false);
            } else {
                const configState = (config as { [key: string]: any })[args[0]];
                if (state != configState) state ? antiCheatModules[args[0]].disable() : antiCheatModules[args[0]].enable();
                world.setDynamicProperty(args[0]);
            }
            sendRawText (player, 
                { text: "§bMatrix §7>§g " },
                { translate: "toggles.toggleChange", with: [args[0], args[1]] },
            )
        } else {
            if (args[0] != "default") {
                if (world.getDynamicProperty(args[0]) == (args[1] == "enable")) return sendRawText (player, 
                    { text: "§bMatrix §7>§c " },
                    { translate: "toggles.already", with: [args[1]] },
                )
                world.setDynamicProperty(args[0], args[1] == "enable");
                sendRawText (player, 
                    { text: "§bMatrix §7>§g " },
                    { translate: "toggles.toggleChange", with: [args[0], args[1]] },
                )
            } else {
                world.setDynamicProperty(args[0]);
                sendRawText (player, 
                    { text: "§bMatrix §7>§g " },
                    { translate: "toggles.toggleChange", with: [args[0], args[1]] },
                )
            }
        }
    }
});