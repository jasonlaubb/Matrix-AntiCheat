import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { ItemStack } from "@minecraft/server";

registerCommand({
    name: "invsee",
    description: "View the item inside a player's inventory",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.invsee),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);

        const inv = target.getComponent("inventory")!.container!;

        let message = new rawstr(true, "g").tra("invsee.of", player.name).str(":\n");
        for (let i = 0; i < inv.size; i++) {
            const item: ItemStack | undefined = inv.getItem(i);

            if (item) {
                message.tra("invsee.item", String(i), item?.typeId).str("\n");
            } else {
                message.tra("invsee.item", String(i), "Empty").str("\n");
            }
            message.str("===================");
        }

        player.sendMessage(message.parse());
    },
});
