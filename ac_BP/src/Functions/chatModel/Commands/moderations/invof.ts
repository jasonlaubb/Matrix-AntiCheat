import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { projectPlayerInventory } from "../../../moderateModel/invPicker";

registerCommand({
    name: "invof",
    description: "View the item inside a player's inventory",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.invof),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        player.sendMessage(new rawstr(true, "g").tra("invof.open").parse());
        // Open the inventory for the player
        projectPlayerInventory(target, player);
    },
});
