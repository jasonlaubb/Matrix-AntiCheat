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
    const pitch = player.getRotation().x;
    const data: typeof player.scaffoldData = player.scaffoldData ?? {};
    const now = Date.now();
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
    player.sendMessage(String(data.turnAmount / data.quickPlaceAmount) + " | " + pitch + "|" + interval + " | " + isSafeBridge(faceLocation));
    const safeBridge = isSafeBridge(faceLocation); // A method to bridge with only hold instead of fast click
    if (data.quickPlaceAmount > 8) {
        const steeringRate = data.turnAmount / data.quickPlaceAmount;
        if (steeringRate > 0.4 || steeringRate > 0.25 && safeBridge) {
            system.run(() => player.flag("Scaffold", "A", "Block"));
        }
    }
    const input = player.inputInfo;
    const hasCrosshair = input.lastInputModeUsed !== InputMode.Touch || input.touchOnlyAffectsHotbar;
    if (safeBridge) {
        data.startSafeBridgeDirection = face;
        data.startSafeBridgePitch = pitch;
        if (hasCrosshair && pitch < 17) {
            system.run(() => player.flag("Scaffold", "B", "Block", { deltaPitch: fastAbs(data.startSafeBridgePitch - pitch) }));
        }
    } else if (data.startSafeBridgeDirection !== face || fastAbs(data.startSafeBridgePitch - pitch) > 20) {
        system.run(() => player.flag("Scaffold", "C", "Block", { deltaPitch: fastAbs(data.startSafeBridgePitch - pitch) }));
    }
    if (hasCrosshair && pitch < 49 && !safeBridge && isForwardScaffold(getBlockFaceXZ(block, face), player.location, face)) {
        system.run(() => player.flag("Scaffold", "D", "Block", { pitch }));
    }
    data.lastPlace = now;
    data.lastPitch = pitch;
    player.scaffoldData = data;
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