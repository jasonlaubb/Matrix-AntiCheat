import { Player, Vector2, Vector3 } from "@minecraft/server";
import { get } from "../util/database";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
export default {
    property: "antiFreecamEnable",
    enable: () => {
        addCheckInterval(tickEvent);
    },
    disable: () => {
        removeCheckInterval(tickEvent);
    },
}
function tickEvent (player: Player) {
    const movementVector = player.inputInfo.getMovementVector();
    const now = Date.now();
    player.freecamLastMoved ??= now;
    player.onScreenDisplay.setActionBar(`${movementVector.x} && ${movementVector.y}`)
    if (movementVector.x === 0 && movementVector.y === 0 && now - player.freecamLastMoved > get("antiFreecamLockCameraOn") && !player.isGliding && !player.isSleeping) {
        const riding = player.getComponent("riding")?.entityRidingOn?.typeId;
        if (!riding || riding === "minecraft:minecart" || isNonZero(player.getVelocity())) {
            if (!player.freecamLastMoved && get("antiFreecamNotify")) player.sendMessage("§7[§aAnti Freecam§7] §fYour camera entered calibration state, move to unlock.");
            player.freecamCameraModified = true;
            const rot = player.getRotation();
            player.camera.setCamera("minecraft:free", {
                rotation: rot,
                location: getFirstPerson(player.getHeadLocation(), rot),
            }); // Forced to lock the camera
        }
    } else {
        player.freecamLastMoved = now;
        if (player.freecamCameraModified) {
            player.freecamCameraModified = false;
            player.camera.clear();
        }
    }
}
function isNonZero ({ x, z }: Vector3) {
    return x !== 0 || z !== 0
}
function getFirstPerson(headPos: Vector3, rotation: Vector2) {
    const yawDegrees = rotation.y;
    const yawRadians = (yawDegrees * Math.PI) / 180;
    const pitch = rotation.x;
    const distanceBuffer = pitch > 5 ? 0.5 : 0.25;
    // Calculate offset based on yaw only
    const offsetX = -Math.sin(yawRadians) * distanceBuffer;
    const offsetZ = Math.cos(yawRadians) * distanceBuffer;

    return {
        x: headPos.x + offsetX,
        y: headPos.y,
        z: headPos.z + offsetZ,
    };
}
