import { InputPermissionCategory, Player, system, Vector2, Vector3 } from "@minecraft/server";
import type { Command } from "../main";
import english from "../data/languages/english";
import { text } from "../util/text";
export const cameraTypes = ["down", "head", "behind"];
export const watchtp = {
    name: "watchtp",
    description: english.commandWatchTpDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandWatchTp",
        description: "commandWatchTpDescription",
    },
    execute: (player) => {
        if (!player?.isWatching || !player.watchTargetPos) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandWatchTpNotWatching"),
            };
        }

        system.run(() => {
            delete player.isWatching;
            delete player.watchPlayerPos;
            delete player.watchTargetPos;
            player.camera.clear();
            player.removeEffect("night_vision");
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true);
            player.addEffect("invisible", 100, { showParticles: false });
            player.removeEffect("night_vision");
            player.addEffect("night_vision", 1200, { showParticles: false });
            player.teleport(player.watchTargetPos!, {
                facingLocation: player.watchPlayerPos,
            });
        });

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandWatchTpSuccess"),
        };
    },
} as Command;
export default {
    name: "watch",
    description: english.commandWatchDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandWatch",
        description: "commandWatchDescription",
        optionalParam: ["commandWatchType", "commandWatchTarget"],
    },
    optionalParameters: [
        { name: "viewType", type: "enum" },
        { name: "player", type: "playerTarget" },
    ],
    execute: (player, [type, target]) => {
        if (player.isWatching) {
            if (type) {
                player.cameraType = type;
                return {
                    status: 0,
                    message: "§7[§aMatrix§7] §f" + text("commandWatchSwitchType", type),
                };
            } else {
                player.isWatching = false;
                return {
                    status: 0,
                    message: "§7[§aMatrix§7] §f" + text("commandWatchExit"),
                };
            }
        }

        if (!target) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandWatchMissingTarget"),
            };
        }

        if (type) {
            player.cameraType = type;
        }

        const targetPlayer = target as Player;
        if (targetPlayer.dimension.id !== player.dimension.id) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandWatchDifferentDimension"),
            };
        }

        player.isWatching = true;

        system.run(() => {
            player.addEffect("night_vision", 20000000, { showParticles: false });
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, false);
        });

        const id = system.runInterval(() => {
            if (!player || !player.isValid) return system.clearRun(id);

            const targetLeft = !targetPlayer || !targetPlayer.isValid;
            const dimensionChange = !targetLeft && targetPlayer.dimension.id !== player.dimension.id;

            if (targetLeft || dimensionChange || !player.isWatching) {
                system.clearRun(id);
                delete player.isWatching;
                delete player.watchPlayerPos;
                delete player.watchTargetPos;
                player.camera.clear();
                player.removeEffect("night_vision");
                player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
                player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true);

                if (targetLeft) return player.sendMessage("§7[§aMatrix§7] §f" + text("commandWatchTargetLeft"));
                if (dimensionChange) return player.sendMessage("§7[§aMatrix§7] §f" + text("commandWatchTargetDimensionChanged"));
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
                    player.watchTargetPos = getBehindHeadLocation(headPos, targetPlayer.getRotation());
                    player.camera.setCamera("minecraft:free", {
                        facingLocation: headPos,
                        location: player.watchTargetPos,
                    });
                    break;
                }
                default: {
                    player.watchTargetPos = { x, y: y + 12, z };
                    player.camera.setCamera("minecraft:free", {
                        rotation: { x: 90, y: targetPlayer.getRotation().y },
                        location: player.watchTargetPos,
                    });
                }
            }

            player.onScreenDisplay.setActionBar(text("commandWatchActionBar", targetPlayer.name));
        });

        return { status: 0 };
    },
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
        z: headPos.z - offsetZ,
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
        z: headPos.z + offsetZ,
    };
}
