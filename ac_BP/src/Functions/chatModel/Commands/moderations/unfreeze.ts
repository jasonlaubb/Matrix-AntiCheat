import { registerCommand, isPlayer, sendRawText, verifier } from "../../CommandHandler";
import { Action } from "../../../../Assets/Action";
import { c } from "../../../../Assets/Util";
import { world } from "@minecraft/server";

registerCommand({
    name: "unfreeze",
    description: "Unfreeze a player",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.unfreeze),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        if (Action.unfreeze(target)) {
            sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "unfreeze.has", with: [target.name, player.name] });
        } else {
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "target.unable", with: [] });
        }
    },
});