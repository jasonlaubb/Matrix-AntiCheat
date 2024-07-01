import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import Dynamic from "../../../Config/dynamic_config";

registerCommand({
    name: "flagmode",
    description: "Change the flag mode used for flag message in chat",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => ["all", "tag", "bypass", "admin", "none"].includes(value as string)],
    require: (player) => verifier(player, c().commands.flagmode),
    executor: async (player, args) => {
        Dynamic.set(["flagMode"], args[0]);
        sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "flagmode.changed", with: [args[0]] });
    },
});
