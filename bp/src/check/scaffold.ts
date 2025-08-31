import { Block, Direction, GameMode, InputMode, PlayerPlaceBlockBeforeEvent, system, Vector3, VectorXZ, world } from "@minecraft/server";
import { fastAbs } from "../util/mathUtil";
export default {
    property: "antiScaffoldEnable",
    enable() {
        world.beforeEvents.playerPlaceBlock.subscribe(onblockPlace);
    },
    disable() {
        world.beforeEvents.playerPlaceBlock.unsubscribe(onblockPlace);
    },
};
function onblockPlace(event: PlayerPlaceBlockBeforeEvent) {
    const { player, face, faceLocation, block } = event;
    const gamemode = player.getGameMode();
    if (player.isOp() || [GameMode.Creative, GameMode.Spectator].includes(gamemode) || player.isFlying) return;
    const height = player.location.y - block.location.y;
    const { x: pitch, y: yaw } = player.getRotation();
    const data: typeof player.scaffoldData = player.scaffoldData ?? {};
    const now = Date.now();
    const isScaffold = height >= 0.98 && height < 2.5;
    const isSpeedBridge = data.lastPlace ? now - data.lastPlace < 350 : face;
    const blockFacePos = getBlockFaceXZ(block, face);
    const extender = getExtender(face, player.location, blockFacePos);
    // Extender > 2 is used to prevent 0 extender bypass
    if (isSpeedBridge && isScaffold && !(data.lastForwardScaffold && now - data.lastForwardScaffold > 2000 && extender > 2)) {
        data.quickPlaceAmount++;
        if (data.lastPlaceDirection !== face) {
            data.turnAmount++;
        }
    } else {
        data.quickPlaceAmount = 0;
        data.turnAmount = 0;
    }
    const forwardScaffold = isForwardScaffold(blockFacePos, player.location, face);
    if (forwardScaffold) data.lastForwardScaffold = now;
    const safeBridge = isSafeBridge(faceLocation); // A method to bridge with only hold instead of fast click
    if (data.quickPlaceAmount > 7) {
        const steeringRate = data.turnAmount / data.quickPlaceAmount; // Checks for unnatural turn while fast bridging
        if (steeringRate > 0.4 || (steeringRate > 0.25 && safeBridge)) {
            // For safe bridge, it is not possible to turn, so we taka a lower value
            event.cancel = true;
            system.run(() => player.flag("Scaffold", "A", "Block", { steeringRate }));
        }
    }
    const input = player.inputInfo;
    const hasCrosshair = input.lastInputModeUsed !== InputMode.Touch || input.touchOnlyAffectsHotbar; // Touch input is difficult to make an actual aim check, so we ignore them for some of the check
    data.startSafeBridgePitch ??= pitch;
    if (!safeBridge) {
        data.startSafeBridgeDirection = face;
        data.startSafeBridgePitch = pitch;
        if (isScaffold && hasCrosshair && pitch < 17 && data.quickPlaceAmount >= 3) {
            // If not a safe bridge, player can only place in a low pitch
            event.cancel = true;
            system.run(() => player.flag("Scaffold", "B", "Block", { pitch }));
        }
        // Safe bridge cannot work if pitch change too much or make a turn, also touch input cannot use fast bridge (as hold = break)
    } else if (!hasCrosshair || data.startSafeBridgeDirection !== face || fastAbs(data.startSafeBridgePitch - pitch) > 20) {
        system.run(() => player.flag("Scaffold", "C", "Block", { deltaPitch: fastAbs(data.startSafeBridgePitch - pitch) }));
    }
    const isClickScaffold = !safeBridge && forwardScaffold; // Check if the scaffold is a forward bridge that by 1-click (not by hold)
    if (isScaffold) {
        if (isClickScaffold) {
            if (pitch < (hasCrosshair ? 44 : 30) && data.quickPlaceAmount >= 3) {
                // Check if a player looking too high :doge:
                event.cancel = true;
                system.run(() => player.flag("Scaffold", "D", "Block", { pitch })); // Ignore touch as it is not possible to check for looking down for touch input
            }
            if ((pitch > 60 && extender >= 2) || extender >= 2.5) {
                // Check for high extender bridge or looking too down with mid-high extender
                event.cancel = true;
                system.run(() => player.flag("Scaffold", "E", "Block", { pitch, extender }));
            }
        }
        // Check for tower (quickly building up)
        if (face === Direction.Up && data.lastPlacePos && data.lastPlacePos.x === block.location.x && data.lastPlacePos.z === block.location.z && block.location.y - data.lastPlacePos.y === 1 && height < 1.3 && isSpeedBridge && player.isJumping) {
            event.cancel = true;
            system.run(() => player.flag("Scaffold", "G", "Block", { height }));
        }
    }
    if (fastAbs(pitch) > 89.91 || pitch % 1 === 0 && pitch !== 0 || yaw % 1 === 0 && yaw !== 0) {
        // Check for flat pitch or yaw. Also impossible high-abs pitch while placing...
        event.cancel = true;
        system.run(() => player.flag("Scaffold", "F", "Block", { pitch }));
    }
    if (!event.cancel) {
        data.lastPlace = now;
        data.lastPitch = pitch;
        data.lastPlaceDirection = face;
        data.lastPlacePos = block.location;
    }
    player.scaffoldData = data;
}
function getExtender(face: Direction, { x: x1, z: z1 }: VectorXZ, { x: x2, z: z2 }: VectorXZ) {
    switch (face) {
        case Direction.East:
        case Direction.West:
            return fastAbs(x1 - x2);
        default:
            return fastAbs(z1 - z2);
    }
}
function isSafeBridge({ x, y, z }: Vector3) {
    return x === 0 && y === 0 && z === 0;
}
function isForwardScaffold(facePos: VectorXZ, playerPos: Vector3, faceDirection: Direction) {
    const dx = playerPos.x - facePos.x;
    const dz = playerPos.z - facePos.z;
    switch (faceDirection) {
        case Direction.North:
            return dz > 0;
        case Direction.South:
            return dz < 0;
        case Direction.East:
            return dx < 0;
        case Direction.West:
            return dx > 0;
        default:
            return false;
    }
}
function getBlockFaceXZ(block: Block, blockFace: Direction): VectorXZ {
    const { x, z } = block.center();
    switch (blockFace) {
        case Direction.North:
            return { x, z: z - 0.5 };
        case Direction.South:
            return { x, z: z + 0.5 };
        case Direction.East:
            return { x: x + 0.5, z };
        case Direction.West:
            return { x: x - 0.5, z };
    }
    return { x, z };
}
