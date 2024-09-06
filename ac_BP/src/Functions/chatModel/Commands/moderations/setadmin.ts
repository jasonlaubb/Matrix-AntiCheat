import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c, getPLevel, rawstr } from "../../../../Assets/Util";

registerCommand({
    name: "setadmin",
    description: "Let a player disconnect directly",
    parent: false,
    maxArgs: 2,
    minArgs: 2,
    argRequire: [(value) => !!isPlayer(value as string)],
    require: (player) => verifier(player, c().commands.tempkick),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        const targetNumber = Number(args[1]);
        if (getPLevel(target) >= getPLevel(player)) {
            player.sendMessage(new rawstr(true, "c").tra("setadmin.toohigh").parse());
        } else if ()
    },
});