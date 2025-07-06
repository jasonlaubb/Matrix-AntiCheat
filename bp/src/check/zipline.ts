import { PlayerPlaceBlockBeforeEvent, world } from "@minecraft/server";
export default {
    enable() {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace)
    },
    disable() {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace)
    }
}
function blockPlace (event: PlayerPlaceBlockBeforeEvent) {
    const { block, player } = event;
    const height = block.location.y - player.location.y;
    if (player.isOp() || height < 1.8 || height > 2) return;
    const now = Date.now();
    player.ziplineLastPlace ??= 0;
    player.sendMessage("" + (now - player.ziplineLastPlace < 200))
    if (now - player.ziplineLastPlace < 200 && player.inputInfo.getMovementVector().x < 0) {
        player.flag("Zipline", "A", "Player", { interval: now - player.ziplineLastPlace });
    }
    player.ziplineLastPlace = now;
}