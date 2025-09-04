import { GameMode, Player, Vector3 } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import type { PhaseData } from "../../../global";
import { isObstructedBetweenLocations, locEqual } from "../util/util";
import { distance, fastAbs } from "../util/mathUtil";

export default {
    property: "antiPhaseEnable",
    enable: () => {
        addCheckInterval("phase", tickEvent);
    },
    disable: () => {
        removeCheckInterval("phase");
    }
}
function tickEvent (player: Player): any {
    if (player.isOp() || player.getGameMode() === GameMode.Spectator || player.location.y < -64 || player.location.y > 320) return delete player.phaseData; // Ignore out of boundary
    const block = player.dimension.getBlock(player.location);
    if (!block) return delete player.phaseData;
    const data: PhaseData = player.phaseData ?? {
        lastNonSolidPos: block.location,
        lastBlockedPos: block.location,
        lastPos: player.location,
        lastReset: 0
    }
    const velocity = player.getVelocity();
    const now = Date.now();
    if (fastAbs(velocity.x) < 0.05 && fastAbs(velocity.z) < 0.05 && fastAbs(velocity.y) < 1 && simpleDistance(data.lastPos, player.location) > 0.3) {
        data.lastReset = now;
    }
    const isBlocked = block.isSolid;
    if (!isBlocked) {
        if (now - data.lastReset >= 300 && !locEqual(data.lastNonSolidPos, block.location) && !locEqual(data.lastNonSolidPos, data.lastBlockedPos)) {
            const phaseDistance = distance(data.lastNonSolidPos, block.location);
            if (phaseDistance < 7 && phaseDistance >= 1 && isObstructedBetweenLocations(data.lastNonSolidPos, block.location, player.dimension)) {
                player.teleport(centerPos(data.lastNonSolidPos));
                data.lastReset = now;
            }
        }
        data.lastNonSolidPos = block.location;
    } else {
        data.lastBlockedPos = block.location;
    }
    data.lastPos = player.location;
    player.phaseData = data;
}
function centerPos ({ x, y, z }: Vector3) {
    return { x: Math.floor(x) + 0.5, y: Math.floor(y), z: Math.floor(z) + 0.5 };
}
function simpleDistance ({ x, y, z }: Vector3, { x: x1, y: y1, z: z1 }: Vector3) {
    return fastAbs(x - x1) + fastAbs(z - z1) + fastAbs(y - y1);
}