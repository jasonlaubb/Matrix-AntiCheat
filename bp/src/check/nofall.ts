import { EntityDamageCause, Player } from "@minecraft/server";
import { addCheckInterval } from "../util/tick";
import { max2 } from "../util/mathUtil";
export default {
    enable() {
        addCheckInterval(tick);
    }
}
function tick (player: Player) {
    if (!player.isFalling && player.nofallLastFallState) {
        const fallDistance = player.nofallLastOnGroundLocation.y - player.location.y;
        player.sendMessage(`Fall for ` + (player.nofallLastOnGroundLocation.y - player.location.y) + ` block(s)`);
        player.applyDamage(max2(0, fallDistance - 3), {
            cause: EntityDamageCause.fall,
        });
    }
    player.nofallLastFallState = player.isFalling;
    if (player.isOnGround) player.nofallLastOnGroundLocation = player.location;
}