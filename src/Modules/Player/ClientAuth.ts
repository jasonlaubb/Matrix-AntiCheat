import { GameMode, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { isAdmin, kick } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb
 * @description A simple client authentication to detect bot client
 */
function clientAuth({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || isAdmin(player) || player.getGameMode() == GameMode.spectator) return;
    const currentLocation = JSON.stringify(player.location);
    // Apply a small knockback to the player
    player.applyKnockback(0, -1.5, 0, 1);
    system.run(() => {
        const locationNow = JSON.stringify(player.location);
        if (locationNow == currentLocation) {
            kick(player, "Client authentication failed", lang(".Bot.by"));
            console.warn(`ClientAuth :: ${player.name} >> Bot client is blocked`);
        }
    });
}
export default {
    enable() {
        world.afterEvents.playerSpawn.subscribe(clientAuth);
    },
    disable() {
        world.afterEvents.playerSpawn.unsubscribe(clientAuth);
    },
};
