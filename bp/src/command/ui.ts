import { system } from "@minecraft/server";
import type { Command } from "../main";
import { openGeneralUI } from "../util/ui";
export default {
    name: "ui",
    description: "Open matrix anticheat UI",
    requireOp: true,
    execute: (player) => {
        system.run(() => openGeneralUI(player));
        return { status: 0 };
    },
} as Command;
