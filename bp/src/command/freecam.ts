import { InputPermissionCategory, Player, system } from "@minecraft/server";
import type { Command } from "../main";
import { getXZVectorSpeed } from "../util/mathUtil";
import { text } from "../util/text";
import english from "../data/languages/english";
const BPT = 0.4;
export const freecam = {
    name: "freecam",
    description: "Move your camera around freely",
    requireOp: true,
    optionalParameters: [
        {
            name: "player",
            type: "player",
        },
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
        target ? (player.freecamCameraPosition = target.location) : (player.freecamCameraPosition = player.location);
        system.run(() => setMovement(player, false));
        const event = system.runInterval(() => {
            if (!player || !player.isValid || !player?.freecamCameraPosition) return system.clearRun(event);
            const speed = (player.getDynamicProperty("freecamSpeed") as number) ?? 1;
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
                z: cameraPos.z + z,
            };
            player.onScreenDisplay.setActionBar("§gType §e/freecam §gto exit freecam mode.");
            player.camera.setCamera("minecraft:free", {
                rotation: rot,
                location: player.freecamCameraPosition,
            });
        });
        return { status: 0, message: "§7[§aMatrix§7] §fFreecam mode activated. Use WASD to move, Space to go up, and Shift to go down." };
    },
} as Command;
export const freecamtp = {
    name: "freecamtp",
    description: english.commandFreecamTpDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandFreecamTp",
        description: "commandFreecamTpDescription"
    },
    execute: (player) => {
        if (!player?.freecamCameraPosition) {
            return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandFreecamTpNotInMode") };
        }

        const cameraPos = player.freecamCameraPosition;
        system.run(() => {
            player.teleport(cameraPos);
            setMovement(player, true);
            player.camera.clear();
        });

        delete player.freecamCameraPosition;
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandFreecamTpSuccess") };
    },
} as Command;
export const freecamspeed = {
    name: "freecamspeed",
    description: english.commandFreecamSpeedDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandFreecamSpeed",
        description: "commandFreecamSpeedDescription",
        optionalParam: ["commandFreecamSpeedValue"]
    },
    optionalParameters: [
        { type: "integer", name: "speed", min: 1, max: 8 },
    ],
    execute: (player, [speed]) => {
        if (!speed) {
            const currentSpeed = player.getDynamicProperty("freecamSpeed") as number;
            if (currentSpeed) {
                player.setDynamicProperty("freecamSpeed");
                return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandFreecamSpeedReset") };
            }
            return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandFreecamSpeedNotSet") };
        }

        player.setDynamicProperty("freecamSpeed", speed);
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandFreecamSpeedSet", speed) };
    },
} as Command;
function setMovement(player: Player, value: boolean) {
    player.inputPermissions.setPermissionCategory(InputPermissionCategory.LateralMovement, value);
}
