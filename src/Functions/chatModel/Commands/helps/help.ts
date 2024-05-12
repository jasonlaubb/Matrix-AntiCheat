import { c } from "../../../../Assets/Util";
import { helpList } from "../../../../Data/Help";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";

registerCommand({
    name: "help",
    description: "Shows help related to commands",
    parent: false,
    maxArgs: 0,
    require: (player) => verifier(player, c().commands.help),
    executor: async (player, _args) => {
        const helps = helpList(c().commands.prefix);
        sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "help.helpcdlist", with: [] }, { text: `\n${helps}` });
    },
});
