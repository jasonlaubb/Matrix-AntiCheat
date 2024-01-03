import { world, GameMode, Player, Vector3, system, PlayerLeaveAfterEvent } from "@minecraft/server";
import { c, flag, isAdmin, inAir } from "../../Assets/Util";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

const lastLocation = new Map<string, Vector3>()

/**
 * @author jasonlaubb
 * @description A simple check for nofall hacking
 */

async function AntiNoFall (player: Player, now: number) {
    const config = c ()
    const { id, isFlying, isClimbing, isOnGround, isInWater, isGliding, threwTridentAt, lastExplosionTime } = player;
    const jumpEffect = player.getEffect(MinecraftEffectTypes.JumpBoost)
    const prevLoc = lastLocation.get(id);
    lastLocation.set(player.id, player.location)
    if (prevLoc === undefined) return;
    const { x, y, z } = player.getVelocity();
    const xz = Math.hypot(x, z)

    //stop false positive
    if (isOnGround || isFlying || isClimbing || isInWater || isGliding || player.hasTag("matrix:levitating") || player.getEffect(MinecraftEffectTypes.Speed) || (jumpEffect && jumpEffect.amplifier > 2) || (threwTridentAt && now - threwTridentAt < 3000) || (lastExplosionTime && now - lastExplosionTime < 5000)) {
        return;
    }

    //velocityY is 0 and velocityXZ is higher than 0.3, flag the player
    if (y === 0 && xz > config.antiNoFall.float && inAir(player.dimension, player.location)) {
        if (!config.slient) player.teleport(prevLoc);
        const lastflag = lastFlag.get(player.id)
        if (lastflag && now - lastflag < 2500) {
            flag (player, "NoFall", "A", config.antiNoFall.maxVL, config.antiNoFall.punishment, [lang(">velocityY") + ":" + + y.toFixed(2), lang(">velocityXZ") + ":" + + xz.toFixed(2)])
        }
        lastFlag.set(player.id, now)
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
    lastLocation.delete(playerId)
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiNofall, 10)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        lastLocation.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
