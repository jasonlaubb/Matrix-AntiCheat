import { ItemStack } from "@minecraft/server";
import type { Command } from "../main";

function hasEducationalFeature () {
    try {
        new ItemStack("minecraft:chemistry_table");
        return true;
    } catch {
        return false;
    }
}

export const mute = {
    name: "mute",
    description: "Mute a player",
    execute: (player, [target, duration, timeUnit]) => {

    }
} as Command;