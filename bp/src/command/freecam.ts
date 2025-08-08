import { InputPermissionCategory, Player, system } from "@minecraft/server";
import type { Command } from "../main";
import { getXZVectorSpeed } from "../util/mathUtil";
const BPT = 0.4;
export const freecam = {
    name: "freecam",
    description: "Move your camera around freely",
    requireOp: true,
    optionalParameters: [
        {
            name: "player",
            type: "player",
        }
    ],
    execute: (player, [target]) => {
        if (player?.freecamCameraPosition) {
            if (target) {
                player.freecamCameraPosition = target.location;
                return { status: 0, message: "§7[§aMatrix§7] §fCamera teleported to target's location" };
            }
            delete player.freecamCameraPosition;
            system.run(() => {
                player.camera.clear();
                setMovement(player, true);
            });
            return { status: 0, message: "§7[§aMatrix§7] §fEscaped from freecam mode." };
        }
        target ? player.freecamCameraPosition = target.location :
            player.freecamCameraPosition = player.location;
        system.run(() => setMovement(player, false));
        const event = system.runInterval(() => {
            if (!player || !player.isValid || !player?.freecamCameraPosition) return system.clearRun(event);
            const speed = player.getDynamicProperty("freecamSpeed") as number ?? 1;
            const cameraPos = player.freecamCameraPosition;
            const rot = player.getRotation();
            const inputInfo = player.inputInfo;
            const movementSpeed = speed * BPT;
            const { x, z } = getXZVectorSpeed(rot.y, inputInfo.getMovementVector(), movementSpeed);
            let y = 0;
            if (player.isJumping) y += movementSpeed;
            if (player.isSneaking) y -= movementSpeed;
            player.freecamCameraPosition = {
                x: cameraPos.x + x,
                y: cameraPos.y + y,
                z: cameraPos.z + z
            }
            player.camera.setCamera("minecraft:free", {
                rotation: rot,
                location: player.freecamCameraPosition,
            });
        });
        return { status: 0, message: "§7[§aMatrix§7] §fFreecam mode activated. Use WASD to move, Space to go up, and Shift to go down." };
    }
} as Command;
export const freecamtp = {
    name: "freecamtp",
    description: "Teleport to the freecam position",
    requireOp: true,
    execute: (player) => {
        if (!player?.freecamCameraPosition) return { status: 1, message: "§7[§aMatrix§7] §fYou are not in freecam mode." };
        const cameraPos = player.freecamCameraPosition;
        system.run(() => {
            player.teleport(cameraPos);
            setMovement(player, true);
            player.camera.clear();
        });
        delete player.freecamCameraPosition;
        return { status: 0, message: "§7[§aMatrix§7] §fTeleported to freecam position." };
    }
} as Command;
export const freecamspeed = {
    name: "freecamspeed",
    description: "Adjust the freecam speed",
    optionalParameters: [
        {
            type: "integer",
            name: "speed",
            min: 1,
            max: 8,
        }
    ],
    requireOp: true,
    execute: (player, [speed]) => {
        if (!speed) {
            const currentSpeed = player.getDynamicProperty("freecamSpeed") as number;
            if (currentSpeed) {
                player.setDynamicProperty("freecamSpeed");
                return { status: 0, message: `§7[§aMatrix§7] §fFreecam speed reset to default.` };
            }
            return { status: 1, message: `§7[§aMatrix§7] §fFreecam speed has not been adjusted.` };
        } else {
            player.setDynamicProperty("freecamSpeed", speed);
            return { status: 0, message: `§7[§aMatrix§7] §fFreecam speed set to §e${speed}x§f sucessfully.` };
        }
    }
} as Command;
function setMovement (player: Player, value: boolean) {
    player.inputPermissions.setPermissionCategory(InputPermissionCategory.LateralMovement, value);
}