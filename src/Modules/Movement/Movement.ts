import { world, Player, system, GameMode } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import lang from "../../Data/Languages/lang";

interface Horizontal {
    x: number,
    z: number
}

const lastXZ = new Map<string, Horizontal>()

/**
 * @author 4urxa
 * @link https://github.com/Dream23322/Isolate-Anticheat
 * @license GPLv3
 * @description edit by jasonlaubb
 */

async function Movement (player: Player, now: number) {
    const velocity = player.getVelocity()
    const { x: x1, z: z1 }: Horizontal = player.getVelocity();

    //get and set the new data
    const lastVelocity = lastXZ.get(player.id)
    lastXZ.set(player.id, velocity)

    //to prevent bug, stop check in first tick
    if (lastVelocity === undefined) return;
    const { x: x2, z: z2 }: Horizontal = lastVelocity

    //calulate the horizontal velocity
    const hVelocity = Math.hypot(x1, z1)

    //check if player get damamged
    const damaged = player.lastExplosionTime && now - player.lastExplosionTime >= 2000
    if (player.isJumping /*|| player.hasTag("nostrafe")*/ || damaged ||player.isFlying) return;

    //state the difference of X and Z
    const difference: Horizontal = {
        x: Math.abs(x2 - x1),
        z: Math.abs(z2 - z1)
    }

    //flag the player
    if(hVelocity > config.antiMovement.maxHorizontalVelocity && (difference.x > config.antiMovement.maxDifferent || difference.z > config.antiMovement.maxDifferent)) {
        flag (player, "Movement", "A", config.antiMovement.maxVL, config.antiMovement.punishment, [lang(">velocityXZ") + ":" + hVelocity])
        if (!config.slient) player.teleport(player.location)
    }
}

system.runInterval(() => {
    const toggle: boolean = world.getDynamicProperty("antiMovement") as boolean ?? config.antiMovement.enabled

    if (toggle !== true) return

    const DateNow = Date.now()
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator]} )
    for (const player of players) {
        if (isAdmin(player)) continue;
        Movement (player, DateNow)
    }
}, 0)