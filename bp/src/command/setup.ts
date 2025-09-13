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
            const item = new ItemStack("matrix:ui_tool");
            item.nameTag = "§r" + text("itemAdminGUI");
            item.keepOnDeath = true;
            player.getComponent("inventory")!.container.addItem(item)
        });
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandSetupGainItem")};
    }
} as Command;
