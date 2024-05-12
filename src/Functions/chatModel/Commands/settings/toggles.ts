import { c } from "../../../../Assets/Util";
import { toggleList } from "../../../../Data/Help";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";

registerCommand ({
    name: "toggles",
    description: "Shows all toggles of modules",
    parent: false,
    maxArgs: 0,
    require: (player) => verifier (player, c().commands.toggles),
    executor: async (player, _args) => {
        sendRawText (player, 
            { text: "§bMatrix §7>§g \n" },
            { translate: "toggles.togglelist" },
            { text: `${toggleList(c().commands.prefix)}` },
        )
    }
});