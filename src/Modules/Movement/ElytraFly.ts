import { world, Player, system, GameMode, PlayerLeaveAfterEvent, ItemUseAfterEvent, Vector3, PlayerSpawnAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c, getPing } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";
import { MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

const fallDistances = new Map<string, number[]>();
const lastLocation = new Map<string, Vector3>();

/**
 * @author jasonlaubb
 * @description Check if player change speed with a high range while high speed
 */

async function ElytraFly (player: Player, now: number) {
    const config = c()
    const data = fallDistances.get(player.id) ?? []
    const lastPos = lastLocation.get(player.id)
    lastLocation.set(player.id, player.location)
    if (!lastPos) return
    data.push(player.fallDistance)

    const { y: velocity } = player.getVelocity()

    if (player.isGliding) {
        if (data.length > config.antiElytraFly.fallDiscycle) {  
            data.shift()
            if (getPing(player) < 4 && !player.hasTag("matrix:stop-gliding") && data.every(f => player.fallDistance == f) && player.fallDistance !== 1 && player.fallDistance <= config.antiElytraFly.maxFallDis && velocity < -0.01) {
                if (!config.slient) {
                    player.teleport(lastPos)
                }
                player.addTag("matrix:stop-gliding")
                system.runTimeout(() => player.removeTag("matrix:stop-gliding"), 10)
                flag (player, "Elytra Fly", "A", config.antiElytraFly.maxVL, config.antiElytraFly.punishment, [lang(">velocityY") + ":" + + velocity.toFixed(2)])
            }
        } else {
            fallDistances.set(player.id, data)
        }

        const ratio = player.fallDistance / (velocity ** 2) * player.getRotation().x ** 2 / 56000

        if (!player.hasTag("matrix:stop-gliding") && ratio > config.antiElytraFly.maxRatio && ratio !== Infinity && player.fallDistance !== 1 && player.lastGliding && now - player.lastGliding > 1000 && !(player.lastGlidingFire && now - player.lastGlidingFire < 7000)) {
            system.run(() => {
                if (player.lastGlidingFire && now - player.lastGlidingFire < 90) return
                if (!config.slient)
                    player.teleport(lastPos)
                player.addTag("matrix:stop-gliding")
                system.runTimeout(() => player.removeTag("matrix:stop-gliding"), 10)
                flag (player, "Elytra Fly", "B", config.antiElytraFly.maxVL, config.antiElytraFly.punishment, [lang(">Ratio") + ":" + + ratio.toFixed(2)])
            })
        }
    } else {
        fallDistances.set(player.id, undefined)
        player.lastGliding = now
    }
}

const elyraFly = () => {
    const DateNow = Date.now()
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator]} )
    for (const player of players) {
        if (isAdmin(player)) continue;
        ElytraFly (player, DateNow)
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    fallDistances.delete(playerId)
}

const playerSpawn = ({ player }: PlayerSpawnAfterEvent) => {
    player.removeTag("matrix:stop-gliding")
}

const itemUseAfter = ({ source: player, itemStack: { typeId }}: ItemUseAfterEvent) => player.isGliding && typeId === MinecraftItemTypes.FireworkRocket && (player.lastGlidingFire = Date.now())

let id: number

export default {
    enable () {
        id = system.runInterval(elyraFly)
        world.afterEvents.playerLeave.subscribe(playerLeave)
        world.afterEvents.itemUse.subscribe(itemUseAfter)
        world.afterEvents.playerSpawn.subscribe(playerSpawn)
    },
    disable () {
        fallDistances.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
        world.afterEvents.itemUse.unsubscribe(itemUseAfter)
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn)
    }
}
