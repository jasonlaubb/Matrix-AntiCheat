import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { Action } from "../../../../Assets/Action";
import { world } from "@minecraft/server";

registerCommand({
    name: "timeout",
    description: "Timeout the player",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false), (value) => Number.isInteger(Number(value))],
    require: (player) => verifier(player, c().commands.timeout),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        Action.timeout(target, Math.trunc(Math.abs(Number(args[1]) / 0.05)));
        world.sendMessage(new rawstr(true, "g").tra("timeout.has", target.name, player.name, Math.abs(Number(args[1]) / 60).toFixed(2)).parse());
    },
});
