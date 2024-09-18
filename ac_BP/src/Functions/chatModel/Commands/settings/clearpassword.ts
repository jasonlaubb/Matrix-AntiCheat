import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import Dynamic from "../../../Config/dynamic_config";

registerCommand({
    name: "clearpassword",
    description: "Disable the password.",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    argRequire: [],
    require: (player) => verifier(player, c().commands.clearpassword),
    executor: async (player, _args) => {
        Dynamic.set(["commands", "passwordSetting", "enabled"], false);
        sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "clearpassword.ok", with: [] });
    },
});
