import { ItemStack, system } from "@minecraft/server";
import type { Command } from "../main";
export default {
    name: "itemui",
    description: "Get the admin gui item",
    requireOp: true,
    execute: (player) => {
        system.run(() => player.getComponent("inventory")!.container.addItem(new ItemStack("matrix:ui_tool")));
        return { status: 0, message: "You have been given the ui tool. Holding the item and right-click (long-press on empty space for Pocket Edition) to open the gui." }
    }
} as Command;