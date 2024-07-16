import { c, rawstr } from "../../../../Assets/Util";
import { toggleList } from "../../../../Data/Help";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";

registerCommand({
    name: "toggles",
    description: "Shows all toggles of modules",
    parent: false,
    maxArgs: 0,
    require: (player) => verifier(player, c().commands.toggles),
    executor: async (player, _args) => {
        const togglelist = await toggleList(c().commands.prefix)
        const message = rawstr.compare(new rawstr(true, "g").tra("toggles.togglelist"), togglelist);
        sendRawText(player, message.parse());
    },
});
