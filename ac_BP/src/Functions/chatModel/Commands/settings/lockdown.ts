import { registerCommand, verifier } from "../../CommandHandler";
import { world } from "@minecraft/server";
import { c, isAdmin, isHost, rawstr } from "../../../../Assets/Util";
import { Action } from "../../../../Assets/Action";
registerCommand({
    name: "lockdown",
    description: "Lockdown the server!",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    require: (player) => verifier(player, c().commands.lockdown),
    argRequire: [undefined],
    executor: async (player, _args) => {
        const config = c();
        const code = config.lockdowncode;

        if (world.getDynamicProperty("lockdown") == true) {
            player.sendMessage(new rawstr(true, "c").tra("lockdown.already").parse());
            return;
        }
        if (code != config.lockdowncode) {
            player.sendMessage(new rawstr(true, "c").tra("lockdown.wrong").parse());
            return;
        }
        world.setDynamicProperty("lockdown", true);
        world.sendMessage(new rawstr(true, "g").tra("lockdown.has", player.name).parse());
        world
            .getAllPlayers()
            .filter((players) => !(isAdmin(players) && isHost(player)))
            .forEach((players) => Action.tempkick(players));
    },
});
