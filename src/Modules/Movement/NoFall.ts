import { world, GameMode, Player, Vector3, system, PlayerLeaveAfterEvent } from "@minecraft/server";
import { c, flag, isAdmin } from "../../Assets/Util";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

const lastLocation = new Map<string, Vector3>()
const lastFlag = new Map<string, number>()
let playerVL: { [key: string]: number } = {}

/**
 * @author jasonlaubb
 * @description A simple check for nofall hacking
 */

async function AntiNoFall (player: Player, now: number) {
    const config = c ()
    const { id, isFlying, isClimbing, isOnGround, isInWater, isGliding, threwTridentAt, lastExplosionTime } = player;
    const jumpEffect = player.getEffect(MinecraftEffectTypes.JumpBoost)
    const prevLoc = lastLocation.get(id);
    if (player.isOnGround) lastLocation.set(player.id, player.location)
    if (prevLoc === undefined) return;
    const { x, y, z } = player.getVelocity();
    const xz = Math.hypot(x, z)

    //stop false positive
    if (player.hasTag("matrix:dead") || player.hasTag("matrix:riding") || isOnGround || isFlying || isClimbing || isInWater || isGliding || player.hasTag("matrix:levitating") || player.getEffect(MinecraftEffectTypes.Speed) || (jumpEffect && jumpEffect.amplifier > 2) || (threwTridentAt && now - threwTridentAt < 3000) || (lastExplosionTime && now - lastExplosionTime < 5000)) {
        playerVL[player.id] ??= 0
        playerVL[player.id] = 0
        return;
    }

    if (y == 0) {
        playerVL[player.id] ??= 0
        playerVL[player.id]++
    } else playerVL[player.id] = 0

    //velocityY is 0, flag the player
    if (y == 0 && playerVL[player.id] >= config.antiNoFall.float) {
        if (!config.slient) player.teleport(prevLoc);
        const lastflag = lastFlag.get(player.id)
        playerVL[player.id] = 0
        if (lastflag && now - lastflag < 8000) {
            flag (player, "NoFall", "A", config.antiNoFall.maxVL, config.antiNoFall.punishment, [lang(">velocityY") + ":" + + y.toFixed(2), lang(">velocityXZ") + ":" + + xz.toFixed(2)])
        }
        lastFlag.set(player.id, now)
    }
}

const antiNofall = () => {
    const now = Date.now();
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator] })
    for (const player of players) {
        if (isAdmin(player)) continue;
        
        AntiNoFall (player, now)
    }
}

const playerLeave = ({playerId}: PlayerLeaveAfterEvent) => {
    lastLocation.delete(playerId)
    lastFlag.delete(playerId)
    delete playerVL[playerId]
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiNofall, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        lastLocation.clear()
        system.clearRun(id)
        playerVL = {}
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
