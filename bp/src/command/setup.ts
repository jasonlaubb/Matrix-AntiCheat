import type { Command } from "../main";
import english from "../data/languages/english";
import { text } from "../util/text";
import { ItemStack, system } from "@minecraft/server";
export default {
    name: "setup",
    description: english.commandSetupDescription,
    translationDef: {
        actionName: "commandSetup",
        description: "commandSetupDescription",
    },
    requireOp: true,
    execute(player) {
        system.run(() => {
            player.getComponent("inventory")?.container?.addItem(new ItemStack("matrix:setup_helper", 1));
        });
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandSetupGainItem")};
    }
} as Command;
