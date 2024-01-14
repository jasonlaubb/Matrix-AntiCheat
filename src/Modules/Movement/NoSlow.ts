import {
    Player,
    system,
    world,
    Effect,
    Vector3,
    GameMode
} from "@minecraft/server";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { flag, isAdmin, c } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

function getSpeedIncrease (speedEffect: Effect | undefined) {
    if (speedEffect === undefined) return 0;
    return (speedEffect?.amplifier + 1) * 0.0476
}

const lastPosition = new Map<string, Vector3>();
//const lastflag = new Map<string, number>()

/**
 * @author RaMiGamerDev
 * @description A strong check for no slow, it detect no slow in a high accuracy
 */

async function AntiNoSlow (player: Player) {
    const config = c()
    //get the player location
    const playerLocation = player.location;

    //get the last position
    const playerLastPos = lastPosition.get(player.id) ?? player.location;

    //get the velocity
    const { x: velocityX, z: velocityZ } = player.getVelocity();

    //check if the player's is in the Web
    const headWeb: boolean = player.dimension.getBlock({
        x: Math.floor(player.location.x),
        y: Math.floor(player.location.y) + 1,
        z: Math.floor(player.location.z)
    })?.typeId === MinecraftBlockTypes.Web
    const bodyWeb: boolean = player.dimension.getBlock({
        x: Math.floor(player.location.x),
        y: Math.floor(player.location.y),
        z: Math.floor(player.location.z)
    })?.typeId === MinecraftBlockTypes.Web

    //if the player isn't in the web, set the last position
    if (!headWeb && !bodyWeb) {
        lastPosition.set(player.id, playerLocation);
    }

    //get the player speed
    const playerSpeed: number = Math.hypot(velocityX, velocityZ);

    //get the limit increase from the speed effect
    const limitIncrease = getSpeedIncrease(player.getEffect(MinecraftEffectTypes.Speed));

    //check if the player is in the web and the player speed is lower than the max speed
    if (headWeb === true || bodyWeb === true) {
        if (playerSpeed <= (0.09 + limitIncrease)) {
            lastPosition.set(player.id, playerLocation);
        } else {
            //flag the player, if the buffer is higher than the max buffer, teleport the player back
            if (!(player.lastExplosionTime && Date.now() - player.lastExplosionTime < 1000) && !player.isFlying) {
                //A - false positive: very low, efficiency: high
                flag (player, "NoSlow", "A" ,config.antiNoSlow.maxVL,config.antiNoSlow.punishment, [`${lang(">playerSpeed")}:${playerSpeed.toFixed(2)}`])
                if (!config.slient) player.teleport(playerLastPos)
            }
        }
    }

    /* disable until fixed
    //check if player speed while using item is too high
    if (!player.getEffect(MinecraftEffectTypes.Speed) && player.lastItemUsed && Date.now() - player.lastItemUsed >= config.antiNoSlow.itemUseTime && playerSpeed > config.antiNoSlow.maxUsingItemTherehold && player.isOnGround && !player.isGliding && !(player.lastExplosionTime && Date.now() - player.lastExplosionTime < 1000)) {
        const isIceBelow = player.dimension.getBlock({
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y) - 1,
            z: Math.floor(player.location.z)
        })?.typeId === MinecraftBlockTypes.Ice

        if (!isIceBelow) {
            player.teleport(player.location)
            const lastFlag = lastflag.get(player.id)
            if (lastFlag && Date.now() - lastFlag < 400) {
                player.addTag("matrix:item-disabled")
                system.runTimeout(() => player.removeTag("matrix:item-disabled"), config.antiNoSlow.timeout)
                //B- false positive: low, efficiency: mid
                flag (player, "NoSlow", "B", config.antiNoSlow.maxVL, config.antiNoSlow.punishment, [`${lang(">playerSpeed")}:${playerSpeed.toFixed(2)}`])
            }
            lastflag.set(player.id, Date.now())
        }
    }*/
}

const antiNoSlow = () => {
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator, GameMode.creative]})
    for (const player of players) {
        if (isAdmin (player)) continue;
        AntiNoSlow(player);
    }
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiNoSlow)
    },
    disable () {
        lastPosition.clear()
        system.clearRun(id)
    }
}
