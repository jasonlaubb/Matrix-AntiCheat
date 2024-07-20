import { c } from "../../../../Assets/Util";
import { adminUI } from "../../../Ui Model/main";
import { registerCommand, verifier } from "../../CommandHandler";
import { rawstr } from "../../../../Assets/Util";

registerCommand({
    name: "matrixui",
    description: "Shows the Matrix UI",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.matrixui),
    executor: async (player, _args) => {
        player.sendMessage(new rawstr(true, "g").tra("ui.closechat").parse());
        adminUI(player);
    },
});
