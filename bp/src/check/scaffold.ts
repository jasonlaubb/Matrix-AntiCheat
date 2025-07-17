import { PlayerPlaceBlockBeforeEvent, world, Block, system, GameMode } from "@minecraft/server";
import { locEqual } from "../util/util";
import { calculateRelativeViewAngle, distanceXZ } from "../util/mathUtil";
export default {
    property: "antiScaffoldEnable",
    enable() {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace);
    },
    disable() {
        world.beforeEvents.playerPlaceBlock.unsubscribe(blockPlace);
    },
};

function blockPlace(event: PlayerPlaceBlockBeforeEvent) {
    const { block, player } = event;
    const height = player.location.y - block.location.y;
    if (player.isOp() || player.isFlying || player.getGameMode() === GameMode.Creative || height < 1 || height >= 2) return;
    const { x: pitch, y: yaw } = player.getRotation();
    const isTouchInput = player.inputInfo.lastInputModeUsed === "Touch";
    const touchingBlock = getOnlyTouchBlock(block);
    const centerLoc = block.center(),
        angle = calculateRelativeViewAngle(player.location, centerLoc, yaw),
        distance = distanceXZ(player.location, centerLoc);
    const isNormalScaffold = touchingBlock && player.scaffoldLastPlaceLoc && locEqual(touchingBlock.location, player.scaffoldLastPlaceLoc);
    player.scaffoldNoRotationFlag ??= 0;
    if (player.scaffoldLastPlaceLoc && pitch < (isTouchInput ? 45 : 30) && isNormalScaffold && (distance <= 2.5 || distanceXZ(touchingBlock.center(), event.player.location) <= distance)) {
        player.scaffoldNoRotationFlag++;
        if (player.scaffoldNoRotationFlag >= 3) {
            event.cancel = true;
            system.run(() => player.flag("Scaffold", "A", "Block", { height, pitch: pitch.toFixed(2) }));
        }
    } else player.scaffoldNoRotationFlag = 0;
    player.scaffoldIntPitch ??= 0;
    if (pitch % 1 === 0) {
        player.scaffoldIntPitch++;
        event.cancel = true;
        if (player.scaffoldIntPitch >= 3) {
            system.run(() => player.flag("Scaffold", "B", "Block", { pitch }));
        }
    } else player.scaffoldIntPitch = 0;
    player.scaffoldBackwardFlag ??= 0;
    if (distance > (isTouchInput ? 2 : 1.2) && angle > (isTouchInput ? 120 : 45)) {
        event.cancel = true;
        player.scaffoldBackwardFlag++;
        if (player.scaffoldBackwardFlag >= 3) {
            system.run(() => player.flag("Scaffold", "C", "Player", { angle: angle.toFixed(2), distance: distance.toFixed(2) }));
        }
    } else player.scaffoldBackwardFlag = 0;
    const now = Date.now();
    if (pitch > 85 && player.inputInfo.getMovementVector().y > 0 && player.scaffoldLastPlace && now - player.scaffoldLastPlace < 400) {
        player.scaffoldDownFlag++;
        if (player.scaffoldDownFlag >= 2) event.cancel = true;
        if (player.scaffoldDownFlag >= 3) {
            system.run(() => player.flag("Scaffold", "D", "Player", { pitch: pitch.toFixed(2) }));
        }
    } else player.scaffoldDownFlag = 0;
    const strightX = player.scaffoldLastPlaceLoc?.x === block.location.x;
    const strightZ = player.scaffoldLastPlaceLoc?.z === block.location.z;
    if (((strightX && player.scaffoldStrightXZ === "x") || (strightZ && player.scaffoldStrightXZ === "z")) && block.location.y === player.scaffoldLastPlaceLoc?.y) {
        player.scaffoldStraightCount++;
    } else {
        player.scaffoldStraightCount = 0;
        player.scaffoldStrightXZ = strightX ? "x" : "z";
    }
    //player.sendMessage(`Scaffold: StrightXZ: ${player.scaffoldStrightXZ}, StraightCount: ${player.scaffoldStraightCount}, DiagFlag: ${player.scaffoldDiagFlag}, Interval: ${player.scaffoldLastPlace && now - player.scaffoldLastPlace}, Pitch: ${pitch}, Distance: ${distance}`);
    player.scaffoldDiagFlag ??= 0;
    if (player.scaffoldLastPlace && now - player.scaffoldLastPlace < 500 && player.scaffoldStraightCount < 5) {
        player.scaffoldDiagFlag++;
        if (player.scaffoldDiagFlag >= 6) {
            event.cancel = true;
            system.run(() => player.flag("Scaffold", "E", "Player", { diagCount: player.scaffoldDiagFlag }));
        }
    } else player.scaffoldDiagFlag = 0;
    player.scaffoldExtenderFlag ??= 0;
    if (!isTouchInput && pitch > 45 && distance > 2) {
        player.scaffoldExtenderFlag++;
        if (player.scaffoldExtenderFlag >= 3) {
            event.cancel = true;
            system.run(() => player.flag("Scaffold", "F", "Player", { pitch: pitch.toFixed(2), distance: distance.toFixed(2) }));
        }
    } else player.scaffoldExtenderFlag = 0;
    if (!event.cancel) {
        player.scaffoldLastPlaceLoc = block.location;
        player.scaffoldLastPlace = now;
    }
}

function getOnlyTouchBlock(block: Block) {
    try {
        const blocks = [block.below(), block.above(), block.north(), block.south(), block.west(), block.east()];
        let touchingBlock: Block | undefined;
        for (const b of blocks) {
            if (b && b.isValid && !b.isAir) {
                if (touchingBlock && !locEqual(touchingBlock.location, b.location)) return undefined;
                touchingBlock = b;
            }
        }
        return touchingBlock;
    } catch {
        return undefined;
    }
}
