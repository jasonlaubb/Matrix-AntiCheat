import { registerCommand, verifier } from "../../CommandHandler";
import { world } from "@minecraft/server";
import { c, rawstr } from "../../../../Assets/Util";
registerCommand({
    name: "unlock",
    description: "Unlock the realm/server",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.unlock),
    executor: async (player, _args) => {
        if (!world.getDynamicProperty("lockdown")) {
            player.sendMessage(new rawstr(true, "c").tra("unlock.not").parse());
            return;
        }
        world.setDynamicProperty("lockdown");
        world.sendMessage(new rawstr(true, "g").tra("unlock.has", player.name).parse());
    },
});
