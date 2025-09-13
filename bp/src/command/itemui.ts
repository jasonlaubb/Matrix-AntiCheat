import { ItemStack, system } from "@minecraft/server";
import type { Command } from "../main";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "itemui",
    description: english.commandItemUiDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandItemUi",
        description: "commandItemUiDescription",
    },
    execute: (player) => {
        system.run(() => player.getComponent("inventory")!.container.addItem(new ItemStack("matrix:ui_tool")));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandItemUiSuccess"),
        };
    },
} as Command;
