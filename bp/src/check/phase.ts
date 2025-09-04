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
    const fixedPos = autoAbove(player.location);
    const block = player.dimension.getBlock(fixedPos);
    if (!block) return delete player.phaseData;
    const data: PhaseData = player.phaseData ?? {
        lastNonSolidPos: block.location,
        lastBlockedPos: undefined,
        lastInSolidPos: undefined,
        lastPos: fixedPos,
        lastReset: 0
    }
    const velocity = player.getVelocity();
    const now = Date.now();
    if (fastAbs(velocity.x) < 0.05 && fastAbs(velocity.z) < 0.05 && fastAbs(velocity.y) < 1 && simpleDistance(data.lastPos, player.location) > 0.3) {
        data.lastReset = now;
    }
    const isBlocked = block.isSolid || block.typeId.startsWith("minecraft:") && block.typeId.endsWith("glass");
    let record = true;
    const flooredNonSolidPos = floorPos(data.lastNonSolidPos);
    const isNewSolid = locEqual(flooredNonSolidPos, block.location);
    if (!isBlocked) {
        if (now - data.lastReset >= 100 && !isNewSolid && !(data.lastBlockedPos && locEqual(flooredNonSolidPos, data.lastBlockedPos))) {
            const phaseDistance = distance(data.lastNonSolidPos, fixedPos);
            if (phaseDistance <= 16 && phaseDistance >= 1 && isObstructedBetweenLocations(data.lastNonSolidPos, fixedPos, player.dimension)) {
                player.teleport(data.lastNonSolidPos);
                record = false;
                player.flag("Phase", "A", "Movement", { phaseDistance: phaseDistance.toFixed(2) });
                delete data.lastBlockedPos;
            }
        }
        if (record) {
            data.lastNonSolidPos = fixedPos;
            delete data.lastInSolidPos;
        }
    } else {
        if (now - data.lastReset >= 100) {
            if (data.lastInSolidPos && !isNewSolid && !locEqual(data.lastInSolidPos, block.location)) {
                player.teleport(data.lastNonSolidPos);
                record = false;
                player.flag("Phase", "B", "Movement (NoClip)");
            }
        }
        if (!isNewSolid) data.lastInSolidPos = block.location;
        data.lastBlockedPos = block.location;
    }
    if (record) data.lastPos = fixedPos;
    player.phaseData = data;
}
function floorPos ({ x, y, z }: Vector3) {
    return { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) }
}
function simpleDistance ({ x, y, z }: Vector3, { x: x1, y: y1, z: z1 }: Vector3) {
    return fastAbs(x - x1) + fastAbs(z - z1) + fastAbs(y - y1);
}
function autoAbove ({ x, y, z }: Vector3) {
    if (fastAbs(y) % 1 > 0.99) {
        return { x, y: Math.ceil(y), z };
    }
    return { x, y, z };
}