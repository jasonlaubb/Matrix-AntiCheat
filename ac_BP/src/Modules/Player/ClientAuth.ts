import { PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { isAdmin, rawstr } from "../../Assets/Util";
import { configi, registerModule } from "../Modules";
import { Action } from "../../Assets/Action";

/**
 * @author jasonlaubb
 * @description A simple client authentication to detect bot client
 */

async function clientAuth (config: configi, { player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || player.isFlying || player.isGliding || isAdmin(player)) return;
    player.teleport({ x: player.location.x, y: player.location.y + 1, z: player.location.z });
    await system.waitTicks(1);
    if (player.isOnGround) return;
    const currentLocation = JSON.stringify(player.location);
    await system.waitTicks(1);
    const badClientState = await new Promise<boolean>((resolve) => {
        system.runInterval(() => {
            let i = 0;
            const id = system.runInterval(() => {
                if (JSON.stringify(player.location) != currentLocation || player.isOnGround) {
                    resolve(false);
                    system.clearRun(id);
                } else if (i > config.clientAuth.trackTicks) {
                    resolve(true);
                    system.clearRun(id);
                }
                i++;
            }, 1);
        }, 1);
    })
    if (badClientState) {
        player.kill();
        Action.tempkick(player);
        world.sendMessage(new rawstr(true, "g").tra("clientauth.kicked", player.name).parse());
    }
}
registerModule("antiClientAuth", false, [],
    {
        worldSignal: world.afterEvents.playerSpawn,
        then: async (config, event: PlayerSpawnAfterEvent) => clientAuth(config, event)
    }
)