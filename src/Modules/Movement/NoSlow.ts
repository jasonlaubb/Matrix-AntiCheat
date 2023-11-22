import {
    Player,
    system,
    world,
    Effect,
    Vector3
} from "@minecraft/server";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import lang from "../../Data/Languages/lang";

function getSpeedIncrease (speedEffect: Effect | undefined) {
    if (speedEffect === undefined) return 0;
    return (speedEffect?.amplifier + 1) * 0.0476
}

const lastPosition = new Map<string, Vector3>();

/**
 * @author RaMiGamerDev
 * @description A strong check for no slow, it detect no slow in a high accuracy
 */

async function antiNoSlow (player: Player) {
    //get the player location
    const playerLocation = player.location;

    //get the last position
    const playerLastPos = lastPosition.get(player.id) ?? player.location;

    //get the velocity
    const { x: velocityX, z: velocityZ } = player.getVelocity();

    //get the no slow buffer
    const buffer: number = (player.noSlowBuffer ?? 0) as number;

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
            player.noSlowBuffer = 0
        } else {
            //flag the player, if the buffer is higher than the max buffer, teleport the player back
            player.noSlowBuffer++
            if (buffer + 1 > config.antiNoSlow.maxNoSlowBuff) {
                player.noSlowBuffer = 0
                flag (player, "NoSlow", config.antiNoSlow.maxVL,config.antiNoSlow.punishment, [`${lang(">playerSpeed")}:${playerSpeed.toFixed(2)}`])
                player.teleport(playerLastPos)
            }
        }
    } else {
        if (buffer > 0) {
            player.noSlowBuffer = 0
            lastPosition.set(player.id, playerLocation);
        }
    }

    //log down the player's last item used
    if (player.hasTag("matrix:using_item") && player.lastItemUsed === undefined) {
        player.lastItemUsed = Date.now();
    } else if (!player.hasTag("matrix:using_item")) {
        player.lastItemUsed = undefined;
    }

    //check if player speed while using item is too high
    if (!player.getEffect(MinecraftEffectTypes.Speed) && player.lastItemUsed && Date.now() - player.lastItemUsed >= config.antiNoSlow.itemUseTime && playerSpeed > config.antiNoSlow.maxUsingItemTherehold && player.isOnGround) {
        const isIceBelow = player.dimension.getBlock({
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y) - 1,
            z: Math.floor(player.location.z)
        })?.typeId === MinecraftBlockTypes.Ice

        if (!isIceBelow) {
            player.teleport(player.location)
            player.addTag("matrix:item-disabled")
            system.runTimeout(() => player.removeTag("matrix:item-disabled"), config.antiNoSlow.timeout)
            flag (player, "NoSlow", config.antiNoSlow.maxVL,config.antiNoSlow.punishment, [`${lang(">playerSpeed")}:${playerSpeed.toFixed(2)}`])
        }
    }
}

system.runInterval(() => {
    const toggle = (world.getDynamicProperty("antiNoSlow") ?? config.antiNoSlow.enabled) as boolean;
    if (toggle !== true) return;
    const players = world.getAllPlayers()
    for (const player of players) {
        if (isAdmin (player)) continue;
        antiNoSlow(player);
    }
}, 1)