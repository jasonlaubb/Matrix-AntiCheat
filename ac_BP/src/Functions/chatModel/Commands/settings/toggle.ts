import { c } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { getModulesIds, intilizeModules } from "../../../../Core/Modules";
import Dynamic from "../../../Config/dynamic_config";
import { system } from "@minecraft/server";

registerCommand({
    name: "toggle",
    description: "Change the toggle of a module",
    parent: false,
    maxArgs: 3,
    minArgs: 2,
    argRequire: [undefined, (value) => ["enable", "disable", "default"].includes(value as string), (value) => value == "force"],
    require: (player) => verifier(player, c().commands.toggles),
    executor: async (player, args) => {
        const config = c();
        const prefix = config.commands.prefix;
        const moduleids = await getModulesIds();
        if (moduleids.includes(args[0])) {
            const now = Date.now();
            // const state = Dynamic.get([args[0], "enabled"]);
            if ((args[1] == "enable") == (config as any)[args[0]].enabled && args[1] != "default") return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggle.already", with: [args[1]] });
            if ((config as { [key: string]: any })[args[0]].experimental && args[2] != "force" && args[1] == "enable") return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggle.warning", with: [prefix, args[0]] });
            if (args[1] === "enable") {
                Dynamic.set([args[0], "enabled"], true);
                await system.waitTicks(20);
                intilizeModules();
            } else if (args[1] == "disable") {
                Dynamic.set([args[0], "enabled"], false);
                await system.waitTicks(20);
                intilizeModules();
            } else {
                Dynamic.delete([args[0], "enabled"]);
                await system.waitTicks(20);
                intilizeModules();
            }
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "toggle.toggleChange", with: [args[0], args[1]] }, { text: ` (${Date.now() - now}ms)` });
        } else sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "toggle.unknown", with: [args[0]] });
    },
});
