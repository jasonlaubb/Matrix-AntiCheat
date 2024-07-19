import { registerCommand, isPlayer, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";

registerCommand({
    name: "deop",
    description: "Deop a player",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, false, true)],
    require: (player) => verifier(player, c().commands.deop),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "deop.hasbeen", with: [target.name, player.name] });
        target.setDynamicProperty("isAdmin");
    },
});
