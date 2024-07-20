import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { world } from "@minecraft/server";

registerCommand({
    name: "echestwipe",
    description: "Wipe a player ender chest",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.echestwipe),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);

        for (let i = 0; i < 27; i++) {
            target.runCommand(`replaceitem entity @s slot.enderchest ${i} air`);
        }

        world.sendMessage(new rawstr(true, "g").tra("echestwipe.has", target.name, player.name).parse());
    },
});
