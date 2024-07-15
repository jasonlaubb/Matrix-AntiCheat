import { c, rawstr } from "../../../../Assets/Util";
import { registerCommand, verifier } from "../../CommandHandler";
import { ItemStack } from "@minecraft/server";

registerCommand({
    name: "matrixui",
    description: "Shows the Matrix UI",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.itemui),
    executor: async (player, _args) => {
        const container = player.getComponent("inventory").container;

        try {
            container.addItem(new ItemStack("matrix:itemui", 1));
            player.sendMessage(new rawstr(true, "g").tra("itemui.has").parse());
        } catch {
            player.sendMessage(new rawstr(true, "c").tra("setup.hcfeature").parse());
        }
    }
})