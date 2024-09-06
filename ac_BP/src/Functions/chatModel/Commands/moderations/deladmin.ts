import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c, getPLevel, isAdmin, rawstr, removeAdmin } from "../../../../Assets/Util";
import { world } from "@minecraft/server";

registerCommand({
    name: "deladmin",
    description: "Delete a player admin permission.",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string)],
    require: (player) => verifier(player, c().commands.tempkick),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        if (!isAdmin(target)) {
            player.sendMessage(new rawstr(true, "c").tra("deladmin.none").parse());
        } else if (world.getDynamicProperty("lockdown") === true) {
            player.sendMessage(new rawstr(true, "c").tra("deladmin.lockdown").parse());
        } else if (getPLevel(target) < getPLevel(player)) {
            removeAdmin(target);
            player.sendMessage(new rawstr(true, "c").tra("deladmin.has", target.name, player.name).parse());
        } else {
            player.sendMessage(new rawstr(true, "c").tra("deladmin.notenough").parse());
        }
    },
});