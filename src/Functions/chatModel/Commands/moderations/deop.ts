import { registerCommand, isPlayer, sendRawText } from "../../CommandHandler";
import { isAdmin } from "../../../../Assets/Util";

registerCommand ({
    name: "deop",
    description: "Deop a player",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [
        (value) => !!isPlayer(value as string, false, true)
    ],
    require: (player) => isAdmin(player),
    executor: async (player, args) => {
        const target = isPlayer (args[0]);
        sendRawText (player, 
            { text: "§bMatrix §7>§g " },
            { translate: "deop.hasbeen", with: [target.name] },
        )
        target.setDynamicProperty("isAdmin");
    }
});