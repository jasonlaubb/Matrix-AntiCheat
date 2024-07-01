import { Player, system } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";

/**
 * @author jasonlaubb
 * @description Prevent crasher works
 * @warning This check won't work anymore as Minecraft patched it
 */

function intickEvent(config: configi, player: Player) {
    const { x, y, z } = player.location;
    const max = 30000000;

    // if the player location is out of the range, flag them
    if (Math.abs(x) > max || Math.abs(y) > max || Math.abs(z) > max || typeof x !== "number" || typeof y !== "number" || typeof z !== "number") {
        player.teleport({ x: 0, y: 0, z: 0 });
        if (!player.hasTag("matrix:crasher")) {
            player.addTag("matrix:crasher");
            system.runTimeout(() => {
                player.removeTag("matrix:crasher");
            });

            if (isAdmin(player) !== true) {
                flag(player, "Crasher", "A", config.antiCrasher.maxVL, config.antiCrasher.punishment, undefined);
            }
        }
    }
}

registerModule("antiCrasher", false, [], {
    intick: async (config, player) => intickEvent(config, player),
    tickInterval: 1,
});
