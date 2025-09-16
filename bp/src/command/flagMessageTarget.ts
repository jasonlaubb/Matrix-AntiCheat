import type { Command } from "../main";
import { messageTarget } from "../util/extension";
import { world } from "@minecraft/server";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "flagmsgtarget",
    description: english.commandFlagMsgTargetDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandFlagMsgTarget",
        description: "commandFlagMsgTargetDescription",
        param: ["commandFlagMsgTargetValue"],
    },
    parameters: [{ name: "messageTarget", type: "enum" }],
    execute: (_player, [newMessageTarget]) => {
        if (!messageTarget.includes(newMessageTarget)) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandFlagMsgTargetInvalid", newMessageTarget),
            };
        }

        world.setDynamicProperty("database:flagMessageTarget", newMessageTarget);

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandFlagMsgTargetSuccess", newMessageTarget),
        };
    },
} as Command;
