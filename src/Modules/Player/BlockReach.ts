import { world, system, PlayerBreakBlockBeforeEvent, Player, PlayerPlaceBlockBeforeEvent, Vector3, GameMode } from "@minecraft/server";
import { flag } from "../../Assets/Util";
import { configi, registerModule } from "../Modules";

/**
 * @author jasonlaubb
 * @description A simple checks for block reach, detect low range of blockReach clients
 */

async function AntiBlockReachA(event: PlayerBreakBlockBeforeEvent, player: Player, config: configi) {
    if (player.hasTag("matrix:break-disabled") || player.getGameMode() == GameMode.creative) return;
    const headLoc = player.getHeadLocation();
    const absCenL = absCentrePos(event.block.location);
    const distance = Math.hypot(headLoc.x - absCenL.x, headLoc.z - absCenL.z);

    //if the distance is higher than the max distance, flag the player
    if (distance > config.antiBlockReach.maxBreakDistance) {
        event.cancel = true;
        system.run(() => {
            if (player.hasTag("matrix:break-disabled")) return;
            if (!config.slient) {
                player.addTag("matrix:break-disabled");
                system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiBlockReach.timeout);
            }
            //A - false positive: low, efficiency: high
            flag(player, "BlockReach", "A", config.antiBlockReach.maxVL, config.antiBlockReach.punishment, ["Reach" + ":" + distance.toFixed(2), "Mode" + ":" + "Break"]);
        });
    }
}

async function AntiBlockReachB(event: PlayerPlaceBlockBeforeEvent, player: Player, config: configi) {
    if (player.hasTag("matrix:place-disabled") || player.getGameMode() == GameMode.creative) return;
    const headLoc = player.getHeadLocation();
    const absCenL = absCentrePos(event.block.location);
    const distance = Math.hypot(headLoc.x - absCenL.x, headLoc.z - absCenL.z);

    //if the distance is higher than the max distance, flag the player
    if (distance > config.antiBlockReach.maxPlaceDistance) {
        event.cancel = true;
        system.run(() => {
            if (player.hasTag("matrix:place-disabled")) return;
            if (!config.slient) {
                player.addTag("matrix:place-disabled");
                system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiBlockReach.timeout);
            }
            //B - false positive: low, efficiency: high
            flag(player, "BlockReach", "B", config.antiBlockReach.maxVL, config.antiBlockReach.punishment, ["Reach" + ":" + distance.toFixed(2), "Mode" + ":" + "Place"]);
        });
    }
}

function absCentrePos(pos: Vector3) {
    return { x: pos.x - 0.5, y: pos.y - 0.5, z: pos.z - 0.5 } as Vector3;
}

registerModule("antiBlockReach", false, [],
    {
        worldSignal: world.beforeEvents.playerBreakBlock,
        then: async (config, event) => AntiBlockReachA(event as PlayerBreakBlockBeforeEvent, event.player, config),
    },
    {
        worldSignal: world.beforeEvents.playerPlaceBlock,
        then: async (config, event) => AntiBlockReachB(event as PlayerPlaceBlockBeforeEvent, event.player, config),
    }
)