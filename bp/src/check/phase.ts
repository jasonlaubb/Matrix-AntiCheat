    import { GameMode, ItemUseAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import type { PhaseData } from "../../../global";
import { isObstructedBetweenLocations, locEqual } from "../util/util";
import { distance } from "../util/mathUtil";
import { correctY, floorVector, safeGetBlock } from "../util/vectorUtil";

export default {
    property: "antiPhaseEnable",
    enable: () => {
        addCheckInterval("phase", tickEvent);
        world.afterEvents.itemUse.subscribe(itemUse);
    },
    disable: () => {
        removeCheckInterval("phase");
        world.afterEvents.itemUse.unsubscribe(itemUse);
    }
}
function tickEvent (player: Player): any {
    if (player.getGameMode() === GameMode.Spectator) return delete player.phaseData; // Ignore out of boundary
    const fixedPos = correctY(player.location);
    const block = safeGetBlock(player.dimension, fixedPos);
    if (!block) return delete player.phaseData;
    const data: PhaseData = player.phaseData ?? {
        lastNonSolidPos: block.location,
        lastBlockedPos: undefined,
        lastInSolidPos: undefined,
        lastPos: fixedPos,
        lastReset: 0,
        lastFlag: 0,
        isResetDone: true,
        lastThrowEnderpearl: 0
    }
    const velocity = player.getVelocity();
    const now = Date.now();
    if (Math.abs(velocity.x) < 0.05 && Math.abs(velocity.z) < 0.05 && Math.abs(velocity.y) < 0.05 && simpleDistance(data.lastPos, player.location) >= 1) {
        data.lastReset = now;
        data.isResetDone = false;
    }
    const isBlocked = block.isSolid || block.typeId.startsWith("minecraft:") && block.typeId.endsWith("glass");
    let record = true;
    const flooredNonSolidPos = floorVector(data.lastNonSolidPos);
    const isNewSolid = locEqual(flooredNonSolidPos, block.location);
    const bypass = !data.isResetDone && now - data.lastFlag > 500;
    if (!isBlocked) {
        if (!bypass && !isNewSolid && !(data.lastBlockedPos && locEqual(flooredNonSolidPos, data.lastBlockedPos))) {
            const phaseDistance = distance(data.lastNonSolidPos, fixedPos);
            if (phaseDistance <= 16 && phaseDistance >= 1 && isObstructedBetweenLocations(data.lastNonSolidPos, fixedPos, player.dimension)) {
                player.teleport(data.lastNonSolidPos);
                data.lastFlag = now;
                record = false;
                player.flag("Phase", "A", "Movement", { phaseDistance: phaseDistance.toFixed(2) });
                delete data.lastBlockedPos;
            }
        }
        if (record) {
            data.lastNonSolidPos = fixedPos;
            delete data.lastInSolidPos;
        }
        if (now - data.lastReset > 500) data.isResetDone = true;
    } else {
        if (!bypass && data.lastInSolidPos && !isNewSolid && !locEqual(data.lastInSolidPos, block.location)) {
            player.teleport(data.lastNonSolidPos);
            data.lastFlag = now;
            record = false;
            player.flag("Phase", "B", "Movement (NoClip)");
        }
        if (!isNewSolid) data.lastInSolidPos = block.location;
        data.lastBlockedPos = block.location;
    }
    if (record) data.lastPos = fixedPos;
    player.phaseData = data;
}
function simpleDistance ({ x, y, z }: Vector3, { x: x1, y: y1, z: z1 }: Vector3) {
    return Math.abs(x - x1) + Math.abs(z - z1) + Math.abs(y - y1);
}
function itemUse ({ itemStack, source }: ItemUseAfterEvent) {
    if (!source.phaseData || itemStack.typeId !== "minecraft:ender_pearl") return;
    source.phaseData.lastThrowEnderpearl = Date.now();
}