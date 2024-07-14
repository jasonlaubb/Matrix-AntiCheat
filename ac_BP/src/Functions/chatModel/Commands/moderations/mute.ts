import { registerCommand, isPlayer, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import { Action } from "../../../../Assets/Action";
import { world } from "@minecraft/server";

registerCommand({
    name: "mute",
    description: "Cancell all the message that the targeted player sent.",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.mute),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        if (Action.mute(target)) {
            sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "mute.has", with: [target.name, player.name] });
        } else {
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "target.unable", with: [] });
        }
    },
});