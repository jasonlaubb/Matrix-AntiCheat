import { GameMode, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { isAdmin, kick } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

/**
 * @author jasonlaubb
 * @description A simple client authentication to detect bot client
 */


async function firstEvent(_config: configi, { player, initialSpawn }: PlayerSpawnAfterEvent, i = 0) {
    if (!initialSpawn || isAdmin(player) || player.getGameMode() == GameMode.spectator) return;
    // Apply a small knockback to the player
    const tpState = player.tryTeleport({ x: player.location.x, y: player.location.y + 1, z: player.location.z });
    await sleep();
    // Max 20 tries to teleport the player
    if (i > 20) return;
    if (!tpState) {
        // Try again
        firstEvent (_config, { player, initialSpawn: true }, i + 1);
        return;
    }
    const currentLocation = JSON.stringify({ x: player.location.x, y: player.location.y + 1, z: player.location.z });
    await sleep();
    const locationNow = JSON.stringify(player.location);
    if (locationNow == currentLocation) {
        kick(player, "Client authentication failed", "Matrix AntiCheat");
        console.warn(`ClientAuth :: ${player.name} :: Bot client is blocked`);
    }
}

async function sleep () {
    return new Promise<void>((resolve) => system.run(() => resolve()));
}

registerModule("clientAuth", false, [], {
    worldSignal: world.afterEvents.playerSpawn,
    playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
    then: async (config: configi, event: PlayerSpawnAfterEvent) => {
        firstEvent(config, event);
    },
});
