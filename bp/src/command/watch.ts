import { GameMode, InputPermissionCategory, Player, system, Vector2, Vector3 } from "@minecraft/server";
import type { Command } from "../main";
export const cameraTypes = ["down", "head", "behind"];
export const watchtp = {
    name: "watchtp",
    description: "Teleport to the camera (watch mode) position.",
    requireOp: true,
    execute: (player) => {
        if (!player?.isWatching || !player.watchTargetPos || !player.watchBeforeGM) return { status: 1, message: "§7[§aMatrix§7] §fYou're not watching anyone." };
        system.run(() => {
            delete player.isWatching;
            delete player.watchPlayerPos;
            delete player.watchTargetPos;
            player.camera.clear();
            player.setGameMode(player.watchBeforeGM!);
            delete player.watchBeforeGM;
            player.removeEffect("night_vision");
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true);
            // Add effect & teleport
            player.addEffect("invisible", 100, { showParticles: false });
            player.removeEffect("night_vision");
            player.addEffect("night_vision", 1200, { showParticles: false });
            player.teleport(player.watchTargetPos!, {
                facingLocation: player.watchPlayerPos,
            });
        })
        return { status: 0, message: "§7[§aMatrix§7] §fTeleported!" };
    }
} as Command;
export default {
    name: "watch",
    description: "Watch a player, you will not be seen by any method.",
    requireOp: true,
    optionalParameters: [
        {
            name: "viewType",
            type: "enum",
        },
        {
            name: "player",
            type: "playerTarget",
        }
    ],
    execute: (player, [type, target]) => {
        if (player.isWatching) {
            if (type) {
                player.cameraType = type;
                return { status: 0, message: "§7[§aMatrix§7] §fSwitch camera type to §e" + type };
            } else player.isWatching = false;
            return { status: 0, message: "§7[§aMatrix§7] §fEscaped from watch mode." };
        } else if (!target) {
            return { status: 1, message: "§7[§aMatrix§7] §fPlease select a player!" };
        }
        if (type) {
            player.cameraType = type;
        }
        const targetPlayer = target as Player;
        if (targetPlayer.dimension.id !== player.dimension.id) return { status: 1, message: "§7[§aMatrix§7] §fYou need to locate in same dimension with watch target." }
        const currentGameMode = player.getGameMode();
        player.watchBeforeGM = currentGameMode;
        player.isWatching = true;
        system.run(() => {
            player.setGameMode(GameMode.Spectator);
            player.addEffect("night_vision", 20000000, {
                showParticles: false,
            });
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, false);
        })
        const id = system.runInterval(() => {
            if (!player || !player.isValid) return system.clearRun(id);
            const targetLeft = !targetPlayer || !targetPlayer.isValid;
            const dimensionChange = targetPlayer.dimension.id !== player.dimension.id;
            const jumpEscape = player.isJumping;
            if (targetLeft || dimensionChange || jumpEscape || !player.isWatching) {
                system.clearRun(id);
                delete player.isWatching;
                delete player.watchPlayerPos;
                delete player.watchTargetPos;
                player.camera.clear();
                player.setGameMode(currentGameMode);
                player.removeEffect("night_vision");
                player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
                player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true);
                if (targetLeft) return player.sendMessage("§7[§aMatrix§7] §fTarget player has left the game.");
                if (dimensionChange) return player.sendMessage("§7[§aMatrix§7] §fTarget player's dimension has been changed.");
                return;
            }
            const { x, y, z } = targetPlayer.location;
            player.watchPlayerPos = targetPlayer.getHeadLocation();
            switch (player.cameraType) {
                case "head": {
                    const headPos = player.watchPlayerPos;
                    const rotation = targetPlayer.getRotation();
                    player.watchTargetPos = getFrontHeadLocation(headPos, rotation);
                    player.camera.setCamera("minecraft:free", {
                        location: player.watchTargetPos,
                        rotation,
                    });
                    break;
                }
                case "behind": {
                    const headPos = player.watchPlayerPos;
                    player.watchTargetPos = getBehindHeadLocation(headPos, targetPlayer.getRotation())
                    player.camera.setCamera("minecraft:free", {
                        facingLocation: headPos,
                        location: player.watchTargetPos,
                    });
                    break;
                }
                default: {
                    player.watchTargetPos = { x, y: y + 12, z }
                    player.camera.setCamera("minecraft:free", {
                        rotation: { x: 90, y: targetPlayer.getRotation().y },
                        location: player.watchTargetPos,
                    });
                }
            } 
            player.onScreenDisplay.setActionBar(`§gWatching §e${targetPlayer.name} §7| §gRun §ewatch§g command to escape`);
        });
        return { status: 0 };
    }
} as Command;
function getBehindHeadLocation(headPos: Vector3, rotation: Vector2) {
    const yawDegrees = rotation.y;
    const yawRadians = (yawDegrees * Math.PI) / 180;

    // Calculate offset based on yaw only
    const offsetX = -Math.sin(yawRadians) * 3.5;
    const offsetZ = Math.cos(yawRadians) * 3.5;

    return {
        x: headPos.x - offsetX,
        y: headPos.y + 2,
        z: headPos.z - offsetZ
    };
}
function getFrontHeadLocation(headPos: Vector3, rotation: Vector2) {
    const yawDegrees = rotation.y;
    const yawRadians = (yawDegrees * Math.PI) / 180;

    // Calculate offset based on yaw only
    const offsetX = -Math.sin(yawRadians) * 0.5;
    const offsetZ = Math.cos(yawRadians) * 0.5;

    return {
        x: headPos.x + offsetX,
        y: headPos.y,
        z: headPos.z + offsetZ
    };
}