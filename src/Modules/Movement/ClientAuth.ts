import { GameMode, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { isAdmin, kick } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb
 * @description A simple client authentication to detect bot client
 */
function clientAuth({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || isAdmin(player) || player.getGameMode() == GameMode.spectator) return;
    // Apply a small knockback to the player
    player.teleport({ x: player.location.x, y: player.location.y + 1, z: player.location.z });
    const currentLocation = JSON.stringify({ x: player.location.x, y: player.location.y + 1, z: player.location.z });
    system.runTimeout(() => {
        const locationNow = JSON.stringify(player.location);
        if (locationNow == currentLocation) {
            kick(player, "Client authentication failed", lang(".Bot.by"));
            console.warn(`ClientAuth :: ${player.name} >> Bot client is blocked`);
        }
    }, 5);
}
export default {
    enable() {
        world.afterEvents.playerSpawn.subscribe(clientAuth);
    },
    disable() {
        world.afterEvents.playerSpawn.unsubscribe(clientAuth);
    },
};
