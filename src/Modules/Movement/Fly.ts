import { world, system, GameMode, Player, Vector3, PlayerLeaveAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c, inAir, getGamemode } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

const previousLocations = new Map<string, Vector3>();
let velocityLog: { [key: string]: number } = {};
const lastVelocity = new Map<string, number>();
const lastFlag = new Map<string, number>();

/**
 * @author jasonlaubb && rami
 * @description This checks if a player velocity is too high.
 */

async function AntiFly (player: Player, now: number) {
    const config = c()
    //constant the infomation
    const { id, isOnGround } = player;

    //get the previous location
    const prevLoc = previousLocations.get(id);

    //get the velocity
    const { x, z, y: velocity } = player.getVelocity();

    //if player is on ground and velocity is 0, set the previous location
    if (isOnGround && velocity === 0) {
        previousLocations.set(id, player.location);
    }

    const jumpBoost = player.getEffect(MinecraftEffectTypes.JumpBoost)
    const levitation = player.getEffect(MinecraftEffectTypes.Levitation)

    velocityLog[player.id] ??= 0

    if (prevLoc) {
        if ((jumpBoost?.amplifier > 2) || levitation?.amplifier > 2) return 
        if (velocity > 0.7) {
            ++velocityLog[player.id]
            lastVelocity.set(id, velocity)
        } else if (velocity > 0)
            velocityLog[player.id] = 0
        const flyMovement = (velocityLog[player.id] > 0 && velocity <= 0) || (velocity < 0.7 && player.fallDistance < -1.5) || (Math.hypot(x, z) > 1 && velocity < 0.7 && velocity > 0 && !player.isJumping)
        
        if (flyMovement && !(player.lastExplosionTime && now - player.lastExplosionTime < 5500) && !(player.threwTridentAt && now - player.threwTridentAt < 5000) && !player.isFlying && !player.hasTag("matrix:slime") && !player.isGliding && !(jumpBoost && jumpBoost?.amplifier > 2) && !(levitation && levitation?.amplifier > 2) && velocity != 1) {
            player.teleport(prevLoc);
            const lastflag = lastFlag.get(id)
            if (lastflag && now - lastflag <= 1500 && now - lastflag >= 60){
                flag(player, "Fly", "A", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + +lastVelocity.get(id).toFixed(2)]);
            }
            velocityLog[player.id] = 0
            lastVelocity.set(id, undefined)
            lastFlag.set(id, now) 
        }
    }

    if (player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z)})?.typeId == MinecraftBlockTypes.Ladder && velocity > 0.3 && Math.hypot(x, z) < 0.3 && !jumpBoost) {
        if (!(player.threwTridentAt && now - player.threwTridentAt < 4500) && !player.hasTag("matrix:knockback")) {
            if (!config.slient) player.teleport(prevLoc)
            player.applyDamage(8)
            flag (player, "Fly", "B", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + velocity.toFixed(2)])
        }
    }
}
async function AntiNoFall (player: Player, now: number) {
    const config = c ()
    const { id, isFlying, isClimbing, isOnGround, isInWater, isGliding, threwTridentAt, lastExplosionTime } = player;
    const jumpEffect = player.getEffect(MinecraftEffectTypes.JumpBoost)
    const prevLoc = previousLocations.get(id);
    const { x, y, z } = player.getVelocity();
    const xz = Math.hypot(x, z)

    /*
    if (player.isFlying && !player.hasTag("matrix:may_fly") && ![1,3].includes(getGamemode(player.name))) {
        if (!config.slient) player.teleport(prevLoc);
        flag (player, "Fly", "C", config.antiFly.maxVL, config.antiFly.punishment, undefined)
    }*/

    //stop false positive
    if (isOnGround || isFlying || isClimbing || isInWater || isGliding || player.hasTag("matrix:levitating") || player.getEffect(MinecraftEffectTypes.Speed) || (jumpEffect && jumpEffect.amplifier > 2) || (threwTridentAt && now - threwTridentAt < 3000) || (lastExplosionTime && now - lastExplosionTime < 5000)) {
        return;
    }

    //velocityY is 0 and velocityXZ is higher than 0.15, flag the player
    if (y === 0 && xz > 0.04 && inAir(player.dimension, player.location)) {
        const jumpBoost = player.getEffect(MinecraftEffectTypes.JumpBoost)
        const levitate = player.getEffect(MinecraftEffectTypes.Levitation)
        if (jumpBoost && jumpBoost?.amplifier > 2 || levitate && levitate?.amplifier > 2) return;

        if (!config.slient) player.teleport(prevLoc);
        flag (player, "Fly", "D", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + + y.toFixed(2), lang(">velocityXZ") + ":" + + xz.toFixed(2)])
    }
}

const antiFly = () => {
    const now = Date.now();
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator] })
    for (const player of players) {
        if (isAdmin(player)) continue;

        AntiFly (player, now)
    }
}

const antiNofall = () => {
    const now = Date.now();
    for (const player of world.getPlayers({ excludeGameModes: [GameMode.spectator] })) {
        if (isAdmin(player)) continue;
        
        AntiNoFall (player, now)
    }
}

const playerLeave = ({playerId}: PlayerLeaveAfterEvent) => {
    previousLocations.delete(playerId)
    lastVelocity.delete(playerId)
    lastFlag.delete(playerId)
    delete velocityLog[playerId]
}

let id: { [key: string]: number }

export default {
    enable () {
        id = {
            a: system.runInterval(antiFly, 1),
            b: system.runInterval(antiNofall, 20)
        }
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        previousLocations.clear()
        lastVelocity.clear()
        lastFlag.clear()
        velocityLog = {}
        system.clearRun(id.a)
        system.clearRun(id.b)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
