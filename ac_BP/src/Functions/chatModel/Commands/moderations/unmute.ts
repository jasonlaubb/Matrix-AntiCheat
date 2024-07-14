import { registerCommand, isPlayer, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import { Action } from "../../../../Assets/Action";
import { world } from "@minecraft/server";

registerCommand({
    name: "unmute",
    description: "Unmute a player",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.unmute),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        if (Action.unmute(target)) {
            sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "unmute.has", with: [target.name, player.name] });
        } else {
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "target.unable", with: [] });
        }
    },
});