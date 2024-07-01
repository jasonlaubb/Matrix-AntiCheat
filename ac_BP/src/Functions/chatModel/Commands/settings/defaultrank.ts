import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import Dynamic from "../../../Config/dynamic_config";

registerCommand({
    name: "defaultrank",
    description: "Set the default rank",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    require: (player) => verifier(player, c().commands.defaultrank),
    executor: async (player, args) => {
        Dynamic.set(["chatRank", "defaultRank"], args[0]);
        sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "defaultrank.has", with: [args[0]] });
    },
});
