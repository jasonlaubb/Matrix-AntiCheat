import { registerCommand, isPlayer, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import { Action } from "../../../../Assets/Action";
import { world } from "@minecraft/server";

registerCommand({
    name: "tempkick",
    description: "Let a player disconnect directly",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.tempkick),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        Action.tempkick(target);
        sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "tempkick.has", with: [target.name, player.name] });
    },
});
