import { Block, Dimension, Player, Vector3 } from "@minecraft/server";
import type { EntityFlyData } from "../../../global";
import { pythag } from "../util/mathUtil";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
const SPEED_THRESHOLD = 0.35;
const LOWEST_Y_THRESHOLD = 0.25;
const MIN_COMBO_BEFORE_FLAG = 10;
const NORMAL_SPEED = 0.25;
const MIN_SUPER_COMBO = 20;
const FACTOR_MIN_FLAG_AMOUNT = 4;
const MIN_REPEAT_COUNT = 3;
const FACTOR = 100;
function tickEvent(player: Player) {
    const isRiding = player.getComponent("riding")?.entityRidingOn;
    const data: EntityFlyData = player.entityFlyData ?? {
        pastVelocityY: new Array(10).fill(0),
        lastNotRidingLocation: player.location,
        prefectCombo: 0,
        superCombo: 0,
        illegalFactorAmount: 0,
    };
    const { x, y: velocityY, z } = player.getVelocity();
    data.pastVelocityY.push(velocityY);
    data.pastVelocityY.shift();
    if (!isRiding) {
        data.lastNotRidingLocation = player.location;
        data.prefectCombo = 0;
    } else if (isRiding.typeId.startsWith("minecraft:") && player.isOnGround) {
        if (!data.pastVelocityY.includes(0) && Math.abs(velocityY) > LOWEST_Y_THRESHOLD) {
            const repeated = checkRepetition(data.pastVelocityY);
            if (repeated > MIN_REPEAT_COUNT) {
                player.teleport(data.lastNotRidingLocation);
                player.flag("EntityFly", "A", "Movement", { repeated });
                data.pastVelocityY = new Array(10).fill(0);
            }
        }
        const horizontalSpeed = pythag(x, z);
        if (velocityY === 0 && horizontalSpeed > SPEED_THRESHOLD && !isRiding.isOnGround && player.isOnGround) {
            data.prefectCombo++;
            if (data.prefectCombo >= MIN_COMBO_BEFORE_FLAG) {
                player.teleport(data.lastNotRidingLocation);
                player.flag("EntityFly", "B", "Movement", { horizontalSpeed });
                data.prefectCombo = 0;
            }
        } else data.prefectCombo = 0;
        if (isRiding.typeId.includes("boat") && horizontalSpeed > NORMAL_SPEED) {
            const stringPoint = player.location.y.toFixed(3);
            const isOnGround = stringPoint.endsWith(".225") || stringPoint.endsWith(".725");
            if (isOnGround) {
                const actualLocation = { x: player.location.x, y: player.location.y + 0.225, z: player.location.z };
                const blockBelow = fastBelow(actualLocation, isRiding.dimension);
                const isAllNonIce = blockBelow ? blockBelow.every((block) => (block ? !block.typeId?.includes("ice") : true)) : false;
                if (isAllNonIce && isOnGround) {
                    data.superCombo++;
                    if (data.superCombo >= MIN_SUPER_COMBO) {
                        player.teleport(data.lastNotRidingLocation);
                        player.flag("EntityFly", "C", "Movement", { horizontalSpeed });
                        data.superCombo = 0;
                    }
                } else if (data.superCombo > 0) data.superCombo -= 1;
            } else if (data.superCombo > 0) data.superCombo -= 1;
        } else data.superCombo = 0;
        if (isRiding.typeId !== "minecraft:minecart" && velocityY !== 0 && Number.isInteger(velocityY * FACTOR)) {
            data.illegalFactorAmount++;
            if (data.illegalFactorAmount >= FACTOR_MIN_FLAG_AMOUNT) {
                player.teleport(data.lastNotRidingLocation);
                player.flag("EntityFly", "D", "Movement", { velocityY });
                data.illegalFactorAmount = 0;
            }
        } else if (data.illegalFactorAmount) data.illegalFactorAmount -= 0.5;
    }
    player.entityFlyData = data;
}
function checkRepetition(arr: number[]) {
    const alreadyList: { [key: number]: number } = {};
    arr.forEach((value) => {
        alreadyList[value] ??= 0;
        alreadyList[value]++;
    });
    return Math.max(...Object.values(alreadyList));
}
function fastBelow(centerLocation: Vector3, dimension: Dimension): (Block | undefined)[] | undefined {
    try {
        const block = dimension.getBlock(centerLocation);
        // directions
        const blockBelow = block?.below();
        if (!blockBelow) return undefined;
        const blockBelowNorth = blockBelow.north();
        const blockBelowSouth = blockBelow.south();
        return [block, blockBelowNorth, blockBelow.east(), blockBelowSouth, blockBelow.west(), blockBelowNorth?.east(), blockBelowNorth?.west(), blockBelowSouth?.east(), blockBelowSouth?.west()];
    } catch {
        return undefined;
    }
}
export default {
    property: "antiEntityFlyEnable",
    enable: () => {
        addCheckInterval("entityFly", tickEvent);
    },
    disable: () => {
        removeCheckInterval("entityFly");
    },
};
