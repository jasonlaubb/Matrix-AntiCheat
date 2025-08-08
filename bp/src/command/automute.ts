import { world } from "@minecraft/server";
import type { Command } from "../main";
import { hasEducationalFeature } from "../util/util";
export const automute = {
    name: "automute",
    description: "Automatically mute incoming player",
    requireOp: true,
    execute: () => {
        if (!hasEducationalFeature()) return { status: 1, message: "§7[§aMatrix§7] §fEnable Minecraft Education Edition to use this feature." };
        const isEnabled = world.getDynamicProperty("automute");
        world.setDynamicProperty("automute", !isEnabled);
        return { status: 0, message: `§7[§aMatrix§7] §fSuccessfully ${isEnabled ? "disabled" : "enabled"} automute.` };
    },
} as Command;
export const enterchat = {
    name: "enterchat",
    description: "Enter the chat",
    requireOp: false,
    execute: (player) => {
        const isEnabled = world.getDynamicProperty("automute");
        if (!isEnabled) return { status: 1, message: "§7[§aMatrix§7] §fAutomute is not enabled." };
        if (player.getDynamicProperty("muteData:" + player.id)) return { status: 1, message: "§7[§aMatrix§7] §fYou are muted and cannot enter the chat." };
        if (player?.chatEntered) return { status: 1, message: "§7[§aMatrix§7] §fYou have already entered the chat." };
        player.chatEntered = true;
        return { status: 0, message: "§7[§aMatrix§7] §fYou have entered the chat." };
    },
} as Command;