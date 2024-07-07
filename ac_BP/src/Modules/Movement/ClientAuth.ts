import { GameMode, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { isAdmin } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { Action } from "../../Assets/Action";

/**
 * @author jasonlaubb
 * @description A simple client authentication to detect bot client
 */

async function firstEvent(_config: configi, { player, initialSpawn }: PlayerSpawnAfterEvent, i = 0) {
    if (!initialSpawn || isAdmin(player) || player.getGameMode() == GameMode.spectator) return;
    // Apply a small knockback to the player
    const tpState = player.tryTeleport({ x: player.location.x, y: player.location.y + 1, z: player.location.z });
    await system.waitTicks(1);
    // Max 20 tries to teleport the player
    if (i > 20) return;
    if (!tpState) {
        // Try again
        firstEvent(_config, { player, initialSpawn: true }, i + 1);
        return;
    }
    const currentLocation = JSON.stringify({ x: player.location.x, y: player.location.y + 1, z: player.location.z });
    await system.waitTicks(1);
    const locationNow = JSON.stringify(player.location);
    if (locationNow == currentLocation) {
        Action.kick(player, "Client authentication failed", "Matrix AntiCheat");
        console.warn(`ClientAuth :: ${player.name} :: Bot client is blocked`);
    }
}

registerModule("clientAuth", false, [], {
    worldSignal: world.afterEvents.playerSpawn,
    playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
    then: async (config: configi, event: PlayerSpawnAfterEvent) => {
        firstEvent(config, event);
    },
});
