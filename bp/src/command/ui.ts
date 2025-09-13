import { system } from "@minecraft/server";
import type { Command } from "../main";
import { openGeneralUI } from "../util/ui";
import english from "../data/languages/english";
export default {
    name: "ui",
    description: english.commandUiDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandUi",
        description: "commandUiDescription",
    },
    execute: (player) => {
        system.run(() => openGeneralUI(player));
        return { status: 0 };
    },
} as Command;
