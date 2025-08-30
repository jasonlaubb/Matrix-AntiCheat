import { Block, Direction, InputMode, PlayerPlaceBlockBeforeEvent, system, Vector3, VectorXZ, world } from "@minecraft/server";
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
function onblockPlace (event: PlayerPlaceBlockBeforeEvent) {
    const { player, face, faceLocation, block } = event;
    const height = player.location.y - block.location.y;
    const { x: pitch, y: yaw }= player.getRotation();
    const data: typeof player.scaffoldData = player.scaffoldData ?? {};
    const now = Date.now();
    const isScaffold = height >= 0.98 && height < 2;
    const interval = data.lastPlace ? now - data.lastPlace : 3000;
    if (interval < 350) {
        data.quickPlaceAmount++;
        if (data.lastPlaceDirection !== face) {
            data.turnAmount++;
        }
    } else {
        data.quickPlaceAmount = 0;
        data.turnAmount = 0;
    }
    const blockFacePos = getBlockFaceXZ(block, face);
    const forwardScaffold = isForwardScaffold(blockFacePos, player.location, face);
    const safeBridge = isSafeBridge(faceLocation); // A method to bridge with only hold instead of fast click
    if (data.quickPlaceAmount > 8) {
        const steeringRate = data.turnAmount / data.quickPlaceAmount;
        if (steeringRate > 0.4 || steeringRate > 0.25 && safeBridge) {
            system.run(() => player.flag("Scaffold", "A", "Block"));
        }
    }
    const input = player.inputInfo;
    const hasCrosshair = input.lastInputModeUsed !== InputMode.Touch || input.touchOnlyAffectsHotbar ;
    if (!safeBridge) {
        data.startSafeBridgeDirection = face;
        data.startSafeBridgePitch = pitch;
        if (isScaffold && hasCrosshair && pitch < 17 && data.quickPlaceAmount >= 3) {
            system.run(() => player.flag("Scaffold", "B", "Block", { pitch }));
        }
    } else if (!hasCrosshair || data.startSafeBridgeDirection !== face || fastAbs(data.startSafeBridgePitch - pitch) > 20) {
        system.run(() => player.flag("Scaffold", "C", "Block", { deltaPitch: fastAbs(data.startSafeBridgePitch - pitch) }));
    }
    const isClickScaffold = !safeBridge && forwardScaffold;
    const extender = getExtender(face, player.location, blockFacePos);
    if (isScaffold) {
    if (isClickScaffold) {
        if (pitch < (hasCrosshair ? 44 : 30) && data.quickPlaceAmount >= 3) {
            system.run(() => player.flag("Scaffold", "D", "Block", { pitch })); // Ignore touch as it is not possible to check for looking down for touch input
        }
        if (pitch > 60 && extender >= 2 || extender >= 2.5) {
            system.run(() => player.flag("Scaffold", "E", "Block", { pitch, extender }));
        }
    }
    if (fastAbs(pitch) > 89.91 || pitch % 1 === 0 || yaw % 1 === 0) {
        system.run(() => player.flag("Scaffold", "F", "Block", { pitch }));
    }
    if (data.lastPlacePos && data.lastPlacePos.x === block.location.x && data.lastPlacePos.z === block.location.z && block.location.y - data.lastPlacePos.y === 1 && height < 1.3 && interval < 400 && player.isJumping) {
        system.run(() => player.flag("Scaffold", "G", "Block", { height, interval }));
    }
    }
    player.sendMessage("" + height + " | " + interval);
    if (!event.cancel) {
        data.lastPlace = now;
        data.lastPitch = pitch;
        data.lastPlaceDirection = face;
        data.lastPlacePos = block.location;
    }
    player.scaffoldData = data;
}
function getExtender (face: Direction, { x: x1, z: z1 }: VectorXZ, { x: x2, z: z2 }: VectorXZ) {
    switch (face) {
        case Direction.East:
        case Direction.West: return fastAbs(x1 - x2);
        default: return fastAbs(z1 - z2);
    }
}
function isSafeBridge ({ x, y, z }: Vector3) {
    return x === 0 && y === 0 && z === 0;
}
function isForwardScaffold(facePos: VectorXZ, playerPos: Vector3, faceDirection: Direction) {
    const dx = playerPos.x - facePos.x;
    const dz = playerPos.z - facePos.z;
    switch (faceDirection) {
        case Direction.North: return dz > 0;
        case Direction.South: return dz < 0;
        case Direction.East:  return dx < 0;
        case Direction.West:  return dx > 0;
        default: return false;
    }
}
function getBlockFaceXZ (block: Block, blockFace: Direction): VectorXZ {
    const { x, z } = block.center()
    switch (blockFace) {
        case Direction.North: return { x, z: z - 0.5 };
        case Direction.South: return { x, z: z + 0.5 };
        case Direction.East: return { x: x + 0.5, z };
        case Direction.West: return { x: x - 0.5, z };
    }
    return { x, z };
}