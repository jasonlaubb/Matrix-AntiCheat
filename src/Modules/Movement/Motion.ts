import { world, system, Player, GameMode, Vector3, PlayerLeaveAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c, findWater, inAir } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

const velocityList = new Map<string, number[]>();
const lastSafePosition = new Map<string, Vector3>();

/**
 * @author jasonlaubb
 * @description A movement check that detect fly with lower false positives
 * This check tracking player with un-natural falling movement
*/

async function AntiMotion (player: Player, now: number) {
    const config = c()
    let distribution: number[] = velocityList.get(player.id) ?? [];
    const { x, y, z } = player.getVelocity();

    const lastPos = lastSafePosition.get(player.id) ?? player.location;

    //log the safe position if player is on ground
    if (player.isOnGround && y === 0) {
        lastSafePosition.set(player.id, player.location)
    }

    //end the movement calculation if player is on ground
    if (player.isOnGround || player.isFlying || player.isClimbing || (!player.isOnGround && y === 0 && x === 0 && z === 0)) {
        velocityList.delete(player.id)
        player.lastTouchGround = Date.now()
        return
    }

    //If the distribution data is not enough for calucation, push the velocity and return
    if (distribution.length <= 15) {
        distribution.push(y);
        velocityList.set(player.id, distribution);
        return;
    }

    //remove the first velocity Y and join a new one
    distribution.shift()
    distribution.push(y)
    velocityList.set(player.id, distribution);

    //get the relative velocity by using the distribution data
    const relativeVelocity = distribution.filter(velocity => velocity >= 0).length / distribution.length;

    //if the player is falling, and the last 3 velocity is negative, keep falling
    const keepFalling = y < 0 && distribution.slice(-config.antiMotion.fallingDuration).every(v => v < 0) && player.isFalling;
    
    //log player touch water time
    if (player.isInWater || player.isSwimming || findWater(player)) {
        player.lastTouchWater = now
        return
    }

    //skip check if player is in water in 2 seconds
    if (player.lastTouchWater && now - player.lastTouchWater < 2000) {
        return
    }

    //if the relative velocity is lower than 0.4, flag the player
    if (relativeVelocity <= config.antiMotion.minRelativeY && !keepFalling && !player.hasTag("matrix:levitating") && !inAir(player.dimension, player.location)) {
        //A - false positive: low, efficiency: mid
        flag (player, "Motion", "A", config.antiMotion.maxVL, config.antiMotion.punishment, [lang(">relative") + ":" + relativeVelocity.toFixed(1)])
        if (!config.slient) player.teleport(lastPos)
        velocityList.delete(player.id)
    }
}

const antiMotion = () => {
    const timeNow = Date.now()
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator, GameMode.creative]})
    for (const player of players) {
        if (isAdmin (player)) continue;
        AntiMotion (player, timeNow)
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    velocityList.delete(playerId)
    lastSafePosition.delete(playerId)
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiMotion, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        velocityList.clear()
        lastSafePosition.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
