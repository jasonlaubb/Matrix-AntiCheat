import { world, Player, system } from "@minecraft/server";
import { flag, c, isAdmin } from "../../Assets/Util";

/**
 * @author jasonlaubb
 * @description Prevent crasher works
 * @warning This check won't work anymore as Minecraft patched it
 */

function AntiCrasher(player: Player) {
    const config = c();
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

const antiCrasher = () => {
    const players = world.getAllPlayers();
    for (const player of players) {
        AntiCrasher(player);
    }
};

let id: number;

export default {
    enable() {
        id = system.runInterval(antiCrasher, 0);
    },
    disable() {
        system.clearRun(id);
    },
};
