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
        param: ["commandDeviceInfoPlayer"],
    },
    parameters: [{ name: "player", type: "player" }],
    execute: (_player, [target]) => {
        const player = target as Player;
        const { lastInputModeUsed, touchOnlyAffectsHotbar } = player.inputInfo;
        const { memoryTier: memoryLevel, maxRenderDistance } = player.clientSystemInfo;
        const memoryTier = text(("commandDeviceInfoMemoryTier" + memoryLevel) as TranslationKey); // e.g. commandDeviceInfoMemoryTier0

        const data = [
            text("commandDeviceInfoLastInput", lastInputModeUsed),
            text("commandDeviceInfoTouchHotbar", touchOnlyAffectsHotbar ? "true" : "false"),
            text("commandDeviceInfoMemoryTier", memoryTier),
            text("commandDeviceInfoRenderDistance", maxRenderDistance),
            text("commandDeviceInfoPlatform", getDevice(player)),
        ].join("\n");

        return {
            status: 0,
            message: `§7[§aMatrix§7] §f` + text("commandDeviceInfoHeader", target.name) + "\n" + data,
        };
    },
} as Command;
function getDevice(player: Player) {
    const { platformType, maxRenderDistance } = player.clientSystemInfo;

    if (maxRenderDistance < 6 || maxRenderDistance > 96) return "Bot";

    switch (platformType) {
        case "Desktop":
            return "Desktop/Laptop";
        case "Mobile":
            return maxRenderDistance > 16 ? "Android" : "iOS";
        case "Console": {
            switch (maxRenderDistance) {
                case 12:
                    return "Nintendo Switch";
                case 16:
                    return player.name.match(/[_-]/) ? "PS4" : "Xbox One";
                case 18:
                    return "PS4 Pro";
                case 28:
                    return "PS5";
                case 36:
                    return "Xbox Series";
            }
            break;
        }
    }
    return platformType;
}
