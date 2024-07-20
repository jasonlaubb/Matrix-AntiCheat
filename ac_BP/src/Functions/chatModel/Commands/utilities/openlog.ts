import { c } from "../../../../Assets/Util";
import { registerCommand, verifier } from "../../CommandHandler";
import { rawstr } from "../../../../Assets/Util";
import { sendLog } from "../../../moderateModel/log";

registerCommand({
    name: "openlog",
    description: "View the log record of the anticheats",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.openlog),
    executor: async (player, _args) => {
        player.sendMessage(new rawstr(true, "g").tra("ui.closechat").parse());
        sendLog(player);
    },
});
