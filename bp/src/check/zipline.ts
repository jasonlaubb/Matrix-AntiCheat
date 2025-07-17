import { GameMode, PlayerPlaceBlockBeforeEvent, world } from "@minecraft/server";
import { distanceXZ } from "../util/mathUtil";
export default {
    enable() {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace);
    },
    disable() {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace);
    },
    property: "antiZiplineEnable",
};
function blockPlace(event: PlayerPlaceBlockBeforeEvent) {
    const { block, player } = event;
    const height = block.location.y - player.location.y;
    if (player.isOp() || height < 1.8 || height > 2 || player.getGameMode() === GameMode.Creative) return;
    const now = Date.now();
    player.ziplineLastPlace ??= 0;
    if (player.ziplineLastLoc && now - player.ziplineLastPlace < 400 && player.inputInfo.getMovementVector().y > 0) {
        if (distanceXZ(player.ziplineLastLoc, player.location) < distanceXZ(player.location, block.location)) {
            event.cancel = true;
            player.ziplineFlag ??= 0;
            player.ziplineFlag++;
            if (player.ziplineFlag > 3) {
                player.flag("Zipline", "A", "Block", { height: height.toFixed(2) });
                player.ziplineFlag = 0;
            }
        } else if (player.ziplineFlag >= 0.5) player.ziplineFlag -= 0.5;
    } else player.ziplineFlag = 0;
    player.ziplineLastPlace = now;
    player.ziplineLastLoc = block.location;
}
