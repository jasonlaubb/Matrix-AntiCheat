import { PlayerPlaceBlockBeforeEvent, world, Block, system } from "@minecraft/server";
import { locEqual } from "../util/util";
import { calculateRelativeViewAngle, distanceXZ } from "../util/mathUtil";
export default {
    enable() {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace);
    }
}

function blockPlace(event: PlayerPlaceBlockBeforeEvent) {
    const { block, player } = event;
    const height = player.location.y - block.location.y;
    if (height < 1 || height >= 2) return;
    const { x: pitch, y: yaw } = player.getRotation();
    const inputMode = player.inputInfo.lastInputModeUsed;
    system.run(() => player.sendMessage(`Scaffold: Height: ${height.toFixed(2)}, Pitch: ${pitch}, Loc: ${getOnlyTouchBlock(block) && locEqual(getOnlyTouchBlock(block)!.location, player.scaffoldLastPlaceLoc)}`));
    const touchingBlock = getOnlyTouchBlock(block);
    const isNormalScaffold = touchingBlock && locEqual(touchingBlock.location, player.scaffoldLastPlaceLoc);
    if (player.scaffoldLastPlaceLoc && pitch < (inputMode === "Touch" ? 45 : 30) && isNormalScaffold) {
        event.cancel = true;
        system.run(() =>player.flag("Scaffold", "A", "Player", { height, pitch: pitch.toFixed(2) }));
    }
    player.scaffoldIntPitch ??= 0;
    if (pitch % 1 === 0) {
        player.scaffoldIntPitch++;
        event.cancel = true;
        if (player.scaffoldIntPitch >= 3) {
            system.run(() => player.flag("Scaffold", "B", "Player", { pitch }));
        }
    } else player.scaffoldIntPitch = 0;
    const centerLoc = block.center()
    ,angle = calculateRelativeViewAngle(player.location, centerLoc, yaw)
    ,distance = distanceXZ(player.location, centerLoc);
    system.run(() => player.sendMessage(`Scaffold: Angle: ${angle.toFixed(2)}, Distance: ${distance.toFixed(2)}`));
    player.scaffoldBackwardFlag ??= 0;
    if (distance > (inputMode === "Touch" ? 2 : 1.2) && angle > (inputMode === "Touch" ? 120 : 45)) {
        event.cancel = true;
        player.scaffoldBackwardFlag++;
        if (player.scaffoldBackwardFlag >= 3) {
            system.run(() => player.flag("Scaffold", "C", "Player", { angle: angle.toFixed(2), distance: distance.toFixed(2) }));
        }
    } else player.scaffoldBackwardFlag = 0;
    if (pitch > 85 && player.inputInfo.getMovementVector().y > 0 && player.scaffoldLastPlace && Date.now() - player.scaffoldLastPlace < 400) {
        player.scaffoldDownFlag++;
        if (player.scaffoldDownFlag >= 2) event.cancel = true;
        if (player.scaffoldDownFlag >= 3) {
            system.run(() => player.flag("Scaffold", "D", "Player", { pitch: pitch.toFixed(2) }));
        }
    } else player.scaffoldDownFlag = 0;
    if (!event.cancel) {
        player.scaffoldLastPlaceLoc = block.location;
        player.scaffoldLastPlace = Date.now();
    }
}

function getOnlyTouchBlock (block: Block) {
    const blocks = [block.below(), block.above(), block.north(), block.south(), block.west(), block.east()];
    let touchingBlock: Block | undefined;
    for (const b of blocks) {
        if (b && b.isValid && !b.isAir) {
            if (touchingBlock && !locEqual(touchingBlock.location, b.location)) return undefined;
            touchingBlock = b;
        }
    }
    return touchingBlock;
}