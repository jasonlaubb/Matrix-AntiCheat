import { c, rawstr } from "../../../../Assets/Util";
import { getAllCommandNames, registerCommand, sendRawText, verifier } from "../../CommandHandler";

registerCommand({
    name: "help",
    description: "Shows help related to commands",
    parent: false,
    maxArgs: 0,
    require: (player) => verifier(player, c().commands.help),
    executor: async (player, _args) => {
        const helpMessage = new rawstr(true, "g").tra("help.matrix").str("\n").tra("help.docs", "https://jasonlaubb.github.io/Matrix-AntiCheat").str("\n").tra("help.valid", getAllCommandNames().join(", "));
        sendRawText(player, helpMessage.parse());
    },
});
