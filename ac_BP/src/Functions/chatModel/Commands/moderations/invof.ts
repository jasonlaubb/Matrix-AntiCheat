import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import { invOfPlayer } from "../../../moderateModel/invPicker";

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
        // Open the inventory for the player
        invOfPlayer(target, player);
    },
});