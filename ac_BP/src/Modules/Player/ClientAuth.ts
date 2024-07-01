import { GameMode, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { c, flag, isAdmin } from "../../Assets/Util";

/**
 * @author jasonlaubb
 * @description A simple client authentication to detect bot client
 */
async function clientAuth({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || isAdmin(player) || player.getGameMode() == GameMode.spectator || player.isFlying) return;
    const config = c();
    player.teleport({ x: player.location.x, y: player.location.y + config.clientAuth.tpOffset, z: player.location.z });
    await sleep();
    // Log the location
    const spawnLocation = JSON.stringify(player.location);
    await sleep();
    let isBotClient = true;
    for (let i = 0; i < config.clientAuth.checkForTick; i++) {
        if (JSON.stringify(player.location) != JSON.stringify(spawnLocation)) {
            isBotClient = false;
            break;
        }
        await sleep();
    }
    if (isBotClient) {
        flag(player, "Bad Client", "A", config.clientAuth.maxVL, config.clientAuth.punishment, undefined);
    }
}
export default {
    enable() {
        world.afterEvents.playerSpawn.subscribe(clientAuth);
    },
    disable() {
        world.afterEvents.playerSpawn.unsubscribe(clientAuth);
    },
};
function sleep(): Promise<void> {
    return new Promise((resolve) => system.run(() => resolve()));
}
