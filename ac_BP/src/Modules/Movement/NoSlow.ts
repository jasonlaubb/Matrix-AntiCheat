import { Player, Effect, Vector3, GameMode } from "@minecraft/server";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { bypassMovementCheck, flag } from "../../Assets/Util";
import { configi, registerModule } from "../Modules";

function getSpeedIncrease(speedEffect: Effect | undefined) {
    if (speedEffect === undefined) return 0;
    return (speedEffect?.amplifier + 1) * 0.0476;
}

const lastPosition = new Map<string, Vector3>();
const lastflag = new Map<string, number>();
const lastflag2 = new Map<string, number>();
//const lastflag = new Map<string, number>()

/**
 * @author RaMiGamerDev
 * @description A strong check for no slow, it detect no slow in a high accuracy
 */

async function AntiNoSlow(player: Player, config: configi, now: number) {
    //get the player location
    const playerLocation = player.location;

    //get the last position
    const playerLastPos = lastPosition.get(player.id) ?? player.location;

    //get the velocity
    const { x: velocityX, z: velocityZ } = player.getVelocity();

    //check if the player's is in the Web
    const headWeb: boolean =
        player.dimension.getBlock({
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y) + 1,
            z: Math.floor(player.location.z),
        })?.typeId === MinecraftBlockTypes.Web;
    const bodyWeb: boolean =
        player.dimension.getBlock({
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z),
        })?.typeId === MinecraftBlockTypes.Web;

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
        if (playerSpeed <= config.antiNoSlow.maxWebSpeed + limitIncrease) {
            lastPosition.set(player.id, playerLocation);
        } else {
            // flag the player
            if (!bypassMovementCheck(player) && !(player.lastExplosionTime && now - player.lastExplosionTime < 1000) && !player.isFlying && !player.isGliding) {
                const lastFlag = lastflag.get(player.id);
                if (lastFlag && now - lastFlag < 3500) {
                    //A - false positive: very low, efficiency: high
                    flag(player, "NoSlow", "A", config.antiNoSlow.maxVL, config.antiNoSlow.punishment, ["playerSpeed" + ":" + playerSpeed.toFixed(2)]);
                    player.teleport(playerLastPos);
                }
                lastflag.set(player.id, now);
            }
        }
    }
    /* This check too sus
    //check if player speed while using item is too high
    if (!player.getEffect(MinecraftEffectTypes.Speed) && player.lastItemUsed && now - player.lastItemUsed >= config.antiNoSlow.itemUseTime && playerSpeed > config.antiNoSlow.maxItemSpeed && player.isOnGround && !player.isJumping && !player.isGliding && !(player.lastExplosionTime && now - player.lastExplosionTime < 1000)) {
        const isIceBelow = player.dimension.getBlock({
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y) - 1,
            z: Math.floor(player.location.z)
        })?.typeId === MinecraftBlockTypes.Ice

        if (!isIceBelow) {
            player.teleport(player.location)
            const lastFlag = lastflag2.get(player.id)
            if (lastFlag && now - lastFlag < 400) {
                player.addTag("matrix:item-disabled")
                system.runTimeout(() => player.removeTag("matrix:item-disabled"), config.antiNoSlow.timeout)
                //B- false positive: low, efficiency: mid
                flag (player, "NoSlow", "B", config.antiNoSlow.maxVL, config.antiNoSlow.punishment, [`${lang(">playerSpeed")}:${playerSpeed.toFixed(2)}`])
            }
            lastflag2.set(player.id, now)
        }
    }*/
}

registerModule("antiNoSlow", false, [lastPosition, lastflag, lastflag2], {
    intick: async (config, player) => AntiNoSlow(player, config, Date.now()),
    tickInterval: 1,
    tickOption: { excludeGameModes: [GameMode.spectator, GameMode.creative] },
});
