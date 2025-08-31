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
    const isScaffold = height >= 0.98 && height < 2.5; // In a height that is possible to use scaffold hack
    const isSpeedBridge = data.lastPlace ? now - data.lastPlace < 350 : face; // Place in a short period
    const blockFacePos = getBlockFaceXZ(block, face); // To get the actual extender instead of getting the extender from center pos which is not accurate
    const extender = getExtender(face, player.location, blockFacePos);
    const safeBridge = isSafeBridge(faceLocation); // A method to bridge with only hold instead of fast click
    const horizontalBridge = data.lastPlacePos?.y === block.location.y;
    const upScaffold = face === Direction.Up && data.lastPlacePos?.y && block.location.y > data.lastPlacePos.y
    if (horizontalBridge && isBlockTouched(block.location, data.lastPlacePos) && isScaffold) {
        const blockBelow = below(block);
        const notVoidScaffold = blockBelow && !blockBelow.isLiquid && !blockBelow.isAir;
        if (notVoidScaffold) {
            data.voidSafeBridge = false;
        } else if (!safeBridge && !data.voidSafeBridge) data.voidSafeBridge = true;
    }
    // Extender > 2 is used to prevent 0 extender bypass
    if (isSpeedBridge && isScaffold && !(data.lastForwardScaffold && now - data.lastForwardScaffold > 2000 && extender > 2)) {
        data.quickPlaceAmount++;
        if (data.lastPlaceDirection !== face && (face !== Direction.Up || upScaffold)) {
            data.turnAmount++; // Direction change then add turn amount
        }
    } else {
        data.quickPlaceAmount = 0;
        data.turnAmount = 0;
    }
    const forwardScaffold = isForwardScaffold(blockFacePos, player.location, face);
    if (forwardScaffold) data.lastForwardScaffold = now;
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
    } else if (hasCrosshair && pitch < 0 || data.startSafeBridgeDirection !== face && (face !== Direction.Up || upScaffold)) {
        event.cancel = true;
        system.run(() => player.flag("Scaffold", "C", "Block", { pitch, lastDir: data.startSafeBridgeDirection, face }));
    }
    if (isScaffold) {
        // Check if the scaffold is a forward bridge that by 1-click (not by hold)
        if (!safeBridge && forwardScaffold && data.voidSafeBridge) {
            if (pitch < (hasCrosshair ? 44 : 30) && data.quickPlaceAmount >= 3) {
                // Check if a player looking too high :doge:
                event.cancel = true;
                system.run(() => player.flag("Scaffold", "D", "Block", { pitch })); // Ignore touch as it is not possible to check for looking down for touch input
            }
            if (data.lastHorizontalBridge && horizontalBridge && ((pitch > 60 && extender >= 2) || extender >= 2.5)) {
                // Check for high extender bridge or looking too down with mid-high extender
                event.cancel = true;
                system.run(() => player.flag("Scaffold", "E", "Block", { pitch, extender }));
            }
        }
        // Check for tower (quickly building up)
        const lastHeight = player.location.y - data.lastPlacePos?.y;
        if (!player.isInWater && face === Direction.Up && data.lastPlacePos && data.lastPlacePos.x === block.location.x && data.lastPlacePos.z === block.location.z && block.location.y - data.lastPlacePos.y === 1 && height >= 0.98 && height < 1.5 && lastHeight >= 0.98 && lastHeight < 1.5 && isSpeedBridge && player.isJumping) {
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
        data.lastHorizontalBridge = horizontalBridge;
    }
    player.scaffoldData = data;
}
function below (block: Block) {
    if (block.location.y === 64) return undefined; // Out of border
    return block.below();
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
// For normal building backward or from other direction, anti scaffold will ignore them
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
function isBlockTouched({ x, y, z }: Vector3, { x: x1, y: y1, z: z1 }: Vector3) {
    const dx = fastAbs(x - x1);
    const dz = fastAbs(z - z1);
    const dy = fastAbs(y - y1);
    return dx + dz + dy === 1;
}
