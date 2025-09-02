import type { Player } from "@minecraft/server";
import type { Command } from "../main";
export default {
    name: "deviceinfo",
    description: "View the device information of a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "player",
        },
    ],
    execute: (_player, [target]) => {
        const player = target as Player;
        const { lastInputModeUsed, touchOnlyAffectsHotbar } = player.inputInfo;
        const { memoryTier: memoryLevel, maxRenderDistance, platformType } = player.clientSystemInfo;
        const memoryTier = ["Super Low", "Low", "Mid", "High", "Super High"][memoryLevel];
        const data = Object.entries({
            lastInputModeUsed,
            touchOnlyAffectsHotbar,
            memoryTier,
            maxRenderDistance,
            platformType,
        })
            .map(([type, value]) => `§g${type}: §e${value}`)
            .join("\n");
        return {
            status: 0,
            message: `§7[§aMatrix§7] §fDevice information of §e${target.name}§f:\n${data}`,
        };
    },
} as Command;
