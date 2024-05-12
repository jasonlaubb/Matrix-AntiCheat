import { registerCommand, sendRawText, isPlayer, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";

registerCommand ({
    name: "rankclear",
    description: "Clear all ranks of a player",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [
        (value) => !!isPlayer(value as string, false, true)
    ],
    require: (player) => verifier (player, c().commands.rankclear),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        const ranks: string[] = target.getTags().filter((tag) => tag.startsWith("rank:"));
        if (ranks.length > 0) {
            ranks.forEach((rank) => target.removeTag(rank));
            sendRawText (player,
                { text: "§bMatrix §7>§g " },
                { translate: "rankclear.has", with: [target.name] },
            )
        } else {
            sendRawText (player, 
                { text: "§bMatrix §7>§c " },
                { translate: "rankclear.empty", with: [target.name] },
            )
        }
    }
})