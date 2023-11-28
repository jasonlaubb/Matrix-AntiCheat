import { world, system, Player, GameMode, Vector3 } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import lang from "../../Data/Languages/lang";

const velocityList = new Map<string, number[]>();
const lastSafePosition = new Map<string, Vector3>();

/**
 * @author jasonlaubb
 * @description A movement check that detect fly with lower false positives
 * This check tracking player with un-natural falling movement
*/

async function antiMotion (player: Player) {
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
        player.lastTouchWater = Date.now()
        return
    }

    //skip check if player is in water in 2 seconds
    if (player.lastTouchWater && Date.now() - player.lastTouchWater < 2000) {
        return
    }

    //if the relative velocity is lower than 0.6, flag the player
    if (relativeVelocity <= config.antiMotion.minRelativeY && !keepFalling && !player.hasTag("matrix:levitating")) {
        flag (player, "Motion", "A", config.antiMotion.maxVL, config.antiMotion.punishment, [lang(">relative") + ":" + relativeVelocity.toFixed(1)])
        if (!config.slient) player.teleport(lastPos)
        velocityList.delete(player.id)
    }
}

function findWater (player: Player) {
    const pos = { x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z)}
    return [-1,0,1].some(x => [-1,0,1].some(z => [-1,0,1].some(y => player.dimension.getBlock({ x: pos.x + x, y: pos.y + y, z: pos.z + z})?.isLiquid)))
}

system.runInterval(() => {
    const toggle: boolean = Boolean(world.getDynamicProperty("antiMotion")) ?? config.antiMotion.enabled;
    if (toggle !== true) return;
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator, GameMode.creative]})
    for (const player of players) {
        if (isAdmin (player)) continue;
        antiMotion (player)
    }
}, 1)

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    velocityList.delete(playerId)
    lastSafePosition.delete(playerId)
})