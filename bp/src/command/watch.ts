import { GameMode, Player, system } from "@minecraft/server";
import type { Command } from "../main";

export default {
    name: "minecraft:watch",
    description: "Watch a player, you will not be seen by any method.",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "playerTarget",
        }
    ],
    execute: (player, [target]) => {
        if (player.isWatching) return { status: 1, message: "§7[§aMatrix§7] §fPress §eJUMP§f button to escape watch mode." };
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
            if (targetLeft || dimensionChange || jumpEscape) {
                system.clearRun(id);
                delete player.isWatching;
                player.camera.clear();
                player.setGameMode(currentGameMode);
                player.removeEffect("night_vision");
                if (targetLeft) return player.sendMessage("§7[§aMatrix§7] §fTarget player has left the game.");
                if (dimensionChange) return player.sendMessage("§7[§aMatrix§7] §fTarget player's dimension has been changed.");
                return;
            }
            player.camera.setCamera("minecraft:free", {
                location: targetPlayer.location,
                offsetFromTargetCenter: { x: 0, y: 2.5, z: 0 },
            });
            player.onScreenDisplay.setActionBar(`§gWatching §e${player.name} §7| §gPress §eJUMP §gto escape`);
        });
        return { status: 0 };
    }
} as Command;