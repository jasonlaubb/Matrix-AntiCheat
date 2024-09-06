import { GameMode, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { c, isAdmin, rawstr } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { Action } from "../../Assets/Action";

/**
 * @author jasonlaubb
 * @description A simple client authentication to detect bot client
 */

async function firstEvent(_config: configi, { player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || isAdmin(player) || player.getGameMode() == GameMode.spectator || player.isFlying) return;
    const config = c();
    // Apply a small knockback to the player
    player.teleport({ x: player.location.x, y: player.location.y + config.clientAuth.teleportHeight, z: player.location.z });
    await system.waitTicks(1);
    if (player.isOnGround) return;
    const playerlocation = JSON.stringify(player.location);
    await system.waitTicks(1);
    // Check if the player is bad client
    const isBadClient = await new Promise<boolean>((resolve) => {
        let i = 0;
        const id = system.runInterval(() => {
            if (JSON.stringify(player.location) != playerlocation || player.isOnGround) {
                resolve(false);
                system.clearRun(id);
            } else if (i > config.clientAuth.trackTicks) {
                resolve(true);
                system.clearRun(id);
            }
            i++;
        }, 1);
    });
    if (isBadClient) {
        player.kill();
        Action.tempkick(player);
        world.sendMessage(new rawstr(true, "g").tra("clientauth.kicked", player.name).parse());
    }
}

registerModule("clientAuth", false, [], {
    worldSignal: world.afterEvents.playerSpawn,
    playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
    then: async (config: configi, event: PlayerSpawnAfterEvent) => {
        firstEvent(config, event);
    },
});
