import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import { world } from "@minecraft/server";

registerCommand ({
    name: "showallrank",
    description: "Show all rank true? Or false?",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    require: (player) => verifier (player, c().commands.defaultrank),
    argRequire: [
        (value) => ["true", "false"].includes(value as string)
    ],
    executor: async (player, args) => {
        world.setDynamicProperty("showAllRank", Boolean(args[0]));
        sendRawText(player, 
            { text: "§bMatrix §7>§g " },
            { translate: "showallrank.has", with: [args[0]] },
        );
    },
})