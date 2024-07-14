import { registerCommand, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import Dynamic from "../../../Config/dynamic_config";

registerCommand({
    name: "banrun",
    description: "Execute a command on the player instead of gets kicked or tempkicked",
    parent: false,
    maxArgs: 1,
    minArgs: 0,
    argRequire: [(value) => (value as string).length > 2],
    require: (player) => verifier(player, c().commands.flagmode),
    executor: async (player, args) => {
        if (!c().banrun.enabled) {
            Dynamic.set(["banrun","enabled"], true);
            Dynamic.set(["banrun","command"], args[0]);
            player.sendMessage(new rawstr(true, "g").tra("banrun.set", args[0]).parse());
        } else if (!args[0]) {
            Dynamic.set(["banrun","enabled"], false);
            Dynamic.delete(["banrun","command"]);
            player.sendMessage(new rawstr(true, "g").tra("banrun.disabled").parse());
        } else {
            player.sendMessage(new rawstr(true, "r").tra("banrun.invalid", args[0]).parse());
        }
    },
});