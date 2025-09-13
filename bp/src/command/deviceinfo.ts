import type { Player } from "@minecraft/server";
import type { Command } from "../main";
import { text, TranslationKey } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "deviceinfo",
    description: english.commandDeviceInfoDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandDeviceInfo",
        description: "commandDeviceInfoDescription",
        param: ["commandDeviceInfoPlayer"]
    },
    parameters: [
        { name: "player", type: "player" },
    ],
    execute: (_player, [target]) => {
        const player = target as Player;
        const { lastInputModeUsed, touchOnlyAffectsHotbar } = player.inputInfo;
        const { memoryTier: memoryLevel, maxRenderDistance, platformType } = player.clientSystemInfo;
        const memoryTier = text(("commandDeviceInfoMemoryTier" + memoryLevel) as TranslationKey); // e.g. commandDeviceInfoMemoryTier0

        const data = [
            text("commandDeviceInfoLastInput", lastInputModeUsed),
            text("commandDeviceInfoTouchHotbar", touchOnlyAffectsHotbar ? "true" : "false"),
            text("commandDeviceInfoMemoryTier", memoryTier),
            text("commandDeviceInfoRenderDistance", maxRenderDistance),
            text("commandDeviceInfoPlatform", platformType),
        ].join("\n");

        return {
            status: 0,
            message: `§7[§aMatrix§7] §f` + text("commandDeviceInfoHeader", target.name) + "\n" + data
        };
    },
} as Command;
