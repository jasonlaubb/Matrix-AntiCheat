import { registerCommand, verifier } from "../../CommandHandler";
import { c, rawstr, removeAdmin } from "../../../../Assets/Util";
import { world } from "@minecraft/server";

registerCommand({
    name: "deop",
    description: "Deop a player",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    argRequire: [],
    require: (player) => verifier(player, c().commands.deop),

    executor: async (player, _args) => {
        if (world.getDynamicProperty("lockdown") === true) {
            player.sendMessage(new rawstr(true, "c").tra("deladmin.lockdown").parse());
            return;
        }
        removeAdmin(player);
        player.sendMessage(new rawstr(true, "g").tra("deop.sucess").parse());
    },
});
