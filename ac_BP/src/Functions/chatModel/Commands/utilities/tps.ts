import { c, rawstr } from "../../../../Assets/Util";
import { registerCommand, verifier } from "../../CommandHandler";
import { tps } from "../../../../Assets/Public";
registerCommand({
    name: "tps",
    description: "Get the server current tick per second",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.ping),
    executor: async (player, _args) => {
		player.sendMessage(new rawstr(true, "g").tra("tps.tps", tps.getTps()?.toFixed(3)).parse());
    },
});