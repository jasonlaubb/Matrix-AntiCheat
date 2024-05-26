import { c } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";

registerCommand({
    name: "help",
    description: "Shows help related to commands",
    parent: false,
    maxArgs: 0,
    require: (player) => verifier(player, c().commands.help),
    executor: async (player, _args) => {
        const helps = "Sorry, this command hasn't been implemented yet. Please check back later!";
        sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "help.helpcdlist", with: [] }, { text: `\n${helps}` });
    },
});
