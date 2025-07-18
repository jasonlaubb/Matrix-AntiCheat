import { GameMode, Player, system } from "@minecraft/server";
import type { Command } from "../main";

export default {
    name: "watch",
    description: "Watch a player, you will not be seen by any method.",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "playerTarget",
        }
    ],
    execute: (player, [target]) => {
        if (player.isWatching) return player.isWatching = false;
        const targetPlayer = target as Player;
        if (targetPlayer.dimension.id !== player.dimension.id) return { status: 1, message: "§7[§aMatrix§7] §fYou need to locate in same dimension with watch target." }
        const currentGameMode = player.getGameMode();
        player.isWatching = true;
        system.run(() => {
            player.setGameMode(GameMode.Spectator);
            player.addEffect("night_vision", 20000000, {
                showParticles: false,
            });
        })
        const id = system.runInterval(() => {
            if (!player || !player.isValid) return system.clearRun(id);
            const targetLeft = !targetPlayer || !targetPlayer.isValid;
            const dimensionChange = targetPlayer.dimension.id !== player.dimension.id;
            const jumpEscape = player.isJumping;
            if (targetLeft || dimensionChange || jumpEscape || !player.isWatching) {
                system.clearRun(id);
                delete player.isWatching;
                player.camera.clear();
                player.setGameMode(currentGameMode);
                player.removeEffect("night_vision");
                if (targetLeft) return player.sendMessage("§7[§aMatrix§7] §fTarget player has left the game.");
                if (dimensionChange) return player.sendMessage("§7[§aMatrix§7] §fTarget player's dimension has been changed.");
                return;
            }
            const { x, y, z } = targetPlayer.location;
            player.camera.setCamera("minecraft:free", {
                location: { x, y: y + 5, z },
                facingEntity: target
            });
            player.onScreenDisplay.setActionBar(`§gWatching §e${player.name} §7| §gRun §ewatch§g command to escape`);
        });
        return { status: 0 };
    }
} as Command;