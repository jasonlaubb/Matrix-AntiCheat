import { c, rawstr } from "../../../../Assets/Util";
import { registerCommand, verifier } from "../../CommandHandler";

registerCommand({
    name: "adminchat",
    description: "Switch to admin-only channel",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.adminchat),
    argRequire: [],
    executor: async (player, _args) => {
        if (player.getDynamicProperty("adminchat")) {
            player.setDynamicProperty("adminchat");
            player.sendMessage(new rawstr(true, "g").tra("adminchat.out").parse());
        } else {
            player.setDynamicProperty("adminchat", true);
            player.sendMessage(new rawstr(true, "g").tra("adminchat.has").parse());
        }
    }
})