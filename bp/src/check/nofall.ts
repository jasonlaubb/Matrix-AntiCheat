import { Player } from "@minecraft/server";
import { addCheckInterval } from "../util/tick";
export default {
    enable() {
        addCheckInterval(tick);
    }
}
function tick (player: Player) {
    if (!player.isFalling && player.nofallLastFallState) {
        player.sendMessage(`Fall for ` + (player.nofallLastOnGroundLocation.y - player.location.y) + ` block(s)`);
    }
    player.nofallLastFallState = player.isFalling;
    if (player.isOnGround) player.nofallLastOnGroundLocation = player.location;
}