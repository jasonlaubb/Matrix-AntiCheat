import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "chatrank",
    requireOp: true,
    description: english.commandChatRankDescription,
    translationDef: {
        actionName: "commandChatRank",
        description: "commandChatRankDescription"
    },
    execute: () => {
        const isEnabled = get("chatRankEnable");
        system.run(() => {
            world.setDynamicProperty("database:chatRankEnable", !isEnabled);
        });
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text(isEnabled ? "commandChatRankDisabled" : "commandChatRankEnabled")
        };
    },
} as Command;