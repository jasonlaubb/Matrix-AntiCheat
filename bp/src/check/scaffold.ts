import { PlayerPlaceBlockBeforeEvent, world, Block } from "@minecraft/server";
import { distanceXZ } from "../util/mathUtil";
import { locEqual } from "../util/util";
export default {
    enable() {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace);
    }
}

function blockPlace(event: PlayerPlaceBlockBeforeEvent) {
    const { block, player } = event;
    const height = player.location.y - block.location.y;
    if (height < 1 || height > 2) return;
    const { x: pitch } = player.getRotation();
    const inputMode = player.inputInfo.lastInputModeUsed;
    if (player.scaffoldLastPlaceLoc && pitch < (inputMode === "Touch" ? 30 : 60) && distanceXZ(player.location, block.location) > distanceXZ(player.location, player.scaffoldLastPlaceLoc)) {
        const touchingBlock = getOnlyTouchBlock(block);
        if (touchingBlock && locEqual(touchingBlock.location, player.scaffoldLastPlaceLoc)) {
            event.cancel = true;
            player.flag("Scaffold", "A", "Player", { height, pitch: pitch.toFixed(2) });
        }
    }
    if (pitch === 60) {
        event.cancel = true;
        player.flag("Scaffold", "B", "Player", { pitch: pitch.toFixed(2) });
    }
    player.scaffoldLastPlaceLoc = block.location;
    player.scaffoldLastPlace = Date.now();
}

function getOnlyTouchBlock (block: Block) {
    const blocks = [block.below(), block.above(), block.north(), block.south(), block.west(), block.east()];
    let touchingBlock: Block | undefined;
    for (const b of blocks) {
        if (touchingBlock) return undefined;
        if (b) touchingBlock = b;
    }
    return touchingBlock;
}