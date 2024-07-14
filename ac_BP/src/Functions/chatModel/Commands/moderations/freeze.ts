import { registerCommand, isPlayer, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import { Action } from "../../../../Assets/Action";

registerCommand({
    name: "freeze",
    description: "Let a player cannot move anymore",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.freeze),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        if (Action.freeze(target)) {
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "freeze.has", with: [target.name, player.name] });
        } else {
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "target.unable", with: [] });
        }
    },
});
