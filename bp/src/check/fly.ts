import { Dimension, EquipmentSlot, GameMode, PistonActivateAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import { fastSurround, isRiding } from "../util/util";

const MAX_VELOCITY_Y = 0.7;
const MIN_REQUIRED_REPEAT_AMOUNT = 6;
const HIGH_VELOCITY_Y = 22;
const MAX_BDS_PREDICTION = 20;
const START_SKIP_CHECK = 6000;
const TYPE1_MAX_FLAG = 2;

function initPlayerData(player: Player) {
    player.flyData = {
        lastOnGroundLocation: player.location,
        velocityYList: new Array(60).fill(0),
        lastFlaggedLocation: player.location,
        flagAmount: 0,
        lastFlagTimestamp: 0,
        lastVelocityY: 0,
        hasStarted: Date.now(),
    };
}

function tick(player: Player) {
    if (!player.flyData) initPlayerData(player);
    const data = player.flyData;
    const now = Date.now();

    const velocityY = player.getVelocity().y;
    const surroundAir = !player.isOnGround && isSurroundedByAir(player.location, player.dimension);
    const playerStarted = now - data.hasStarted > START_SKIP_CHECK;
    const isPlayerNotCreative = player.getGameMode() !== GameMode.Creative;
    const pistonNotPushed = now - (player.flyLastPistonPush ?? 0) > 4000;
    const previousVelY = data.velocityYList[1];
    const jumpBoost = player.getEffect("jump_boost")?.amplifier ?? -1;
    const levitationWithInAllowRange = (player.getEffect("levitation")?.amplifier ?? -1) < 13;
    if (player.isOnGround && velocityY === 0) {
        data.lastOnGroundLocation = player.location;
    } else if (
        playerStarted &&
        pistonNotPushed &&
        now - player.lastKnockback > 2000 &&
        now - player.lastRiptide > 5000 &&
        jumpBoost < 2 &&
        (previousVelY < 0 || (previousVelY < 0 && velocityY === 0) || (velocityY > 0 && previousVelY / velocityY > 4 && previousVelY > 2.5 && Math.abs((player.flyData.lastVelocityY ?? 0) - velocityY) < 0.5)) &&
        !isRiding(player) &&
        !player.isFlying &&
        !player.isGliding &&
        !player.isInWater &&
        isPlayerNotCreative &&
        levitationWithInAllowRange &&
        !data.velocityYList.some((yV) => yV === HIGH_VELOCITY_Y)
    ) {
        if (velocityY > MAX_VELOCITY_Y) {
            data.flagAmount += surroundAir ? 1 : 0.5;
            data.lastFlagTimestamp = now;

            if (data.flagAmount >= TYPE1_MAX_FLAG) {
                data.flagAmount = 0;
                player.teleport(data.lastOnGroundLocation);
                player.flag("Fly", "A", "Movement", { velocityY });
            }
        }
    }

    if (data.flagAmount >= 0.05 && ((now - data.lastFlagTimestamp > 6000 && player.isOnGround) || (surroundAir && Math.abs(velocityY) < MAX_VELOCITY_Y && now - data.lastFlagTimestamp > 1200))) {
        data.flagAmount -= 0.05;
    }

    if (pistonNotPushed && playerStarted && velocityY > HIGH_VELOCITY_Y && now - (player.lastKnockback ?? 0) > 2000 && !player.isGliding && jumpBoost <= 205) {
        player.teleport(data.lastOnGroundLocation);
        player.flag("Fly", "B", "Movement", { velocityY });
    }
    if (levitationWithInAllowRange) {
        data.velocityYList.unshift(player.isFlying ? HIGH_VELOCITY_Y : velocityY);
        data.velocityYList.pop();
    }

    const minAmount = Math.min(...data.velocityYList);
    const maxAmount = Math.max(...data.velocityYList);
    const bdsPrediction = calculateBdsPrediction(data.velocityYList);

    if (levitationWithInAllowRange && pistonNotPushed && playerStarted && isPlayerNotCreative && !player.isOnGround && data.velocityYList.length >= 60 && bdsPrediction >= MAX_BDS_PREDICTION && !isRiding(player)) {
        const { highestRepeatedVelocity, highestRepeatedAmount } = repeatChecks(data.velocityYList);

        if (highestRepeatedAmount >= MIN_REQUIRED_REPEAT_AMOUNT && highestRepeatedVelocity > MAX_VELOCITY_Y && minAmount <= -MAX_VELOCITY_Y && maxAmount < HIGH_VELOCITY_Y) {
            player.teleport(data.lastOnGroundLocation);
            player.flag("Fly", "C", "Movement", { hrA: highestRepeatedAmount, hrV: highestRepeatedVelocity, minAmount, maxAmount });
        }
    }
    if (player.isGliding && now - data.lastFlagTimestamp > 500) {
        const item = player.getComponent("equippable")!.getEquipment(EquipmentSlot.Chest);
        if (!item || item.typeId !== "minecraft:elytra") {
            data.lastFlagTimestamp = now;
            player.flag("Fly", "D", "Movement (GlideTag)");
        }
    }
    data.lastVelocityY = velocityY;
    player.flyData = data;
}

function repeatChecks(list: number[]) {
    const count: Record<number, number> = {};
    let highestRepeatedVelocity = 0;
    let highestRepeatedAmount = 0;

    for (const velocityY of list) {
        if (velocityY === 0) continue;
        const rounded = Math.round(velocityY * 1000) / 1000;
        count[rounded] = (count[rounded] ?? 0) + 1;
        if (count[rounded] > highestRepeatedAmount) {
            highestRepeatedVelocity = rounded;
            highestRepeatedAmount = count[rounded];
        }
    }

    return { highestRepeatedVelocity, highestRepeatedAmount };
}

function calculateBdsPrediction(list: number[]) {
    return list.reduce((acc, yV) => {
        return acc + (yV < -MAX_VELOCITY_Y || yV > MAX_VELOCITY_Y ? 1 : -1);
    }, 0);
}
function onPistonPush({ dimension, isExpanding, piston }: PistonActivateAfterEvent) {
    if (!isExpanding) return;
    const now = Date.now();
    const allAffectedBlockLocation = piston.getAttachedBlocksLocations();
    allAffectedBlockLocation.push(piston.block.location);
    const playerNearby = [] as Player[];
    allAffectedBlockLocation.forEach((location) => {
        playerNearby.push(
            ...dimension.getPlayers({
                maxDistance: 2,
                minDistance: 0,
                location,
            })
        );
    });
    new Set(playerNearby).forEach((player) => {
        player.flyLastPistonPush = now;
    });
}
function isSurroundedByAir(centerLocation: Vector3, dimension: Dimension): boolean {
    const surroundedBlocks = fastSurround(centerLocation, dimension);
    if (!surroundedBlocks) return !!surroundedBlocks;
    return surroundedBlocks.every((block) => block?.isAir);
}
export default {
    property: "antiFlyEnable",
    enable: () => {
        addCheckInterval("fly", tick);
        world.afterEvents.pistonActivate.subscribe(onPistonPush);
    },
    disable: () => {
        removeCheckInterval("fly");
        world.afterEvents.pistonActivate.unsubscribe(onPistonPush);
    },
};
