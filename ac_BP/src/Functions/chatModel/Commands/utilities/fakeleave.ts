import { c } from "../../../../Assets/Util";
import { registerCommand, verifier } from "../../CommandHandler";
import { world } from "@minecraft/server";

registerCommand({
    name: "fakeleave",
    description: "Send a true leave message to the chat channel",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.openlog),
    executor: async (player, _args) => {
        const isThereAnyOp = world.getAllPlayers().some(player => {
            try {
                return player.isOp();
            } catch {
                return false;
            }
        })
        const translationKey = isThereAnyOp ? "multiplayer.player.left" : "multiplayer.player.left.realms";
        world.sendMessage({
            rawtext: [
                {
                    text: "§e"
                },
                {
                    translate: translationKey,
                    with: [player.name]
                }
            ]
        })
    },
});