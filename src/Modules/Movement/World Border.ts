import { PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityBeforeEvent, PlayerPlaceBlockBeforeEvent, Vector3, system, world } from "@minecraft/server"
import { c, isAdmin } from "../../Assets/Util"

// delcare the variable
let radius: number
let centerX: number
let centerZ: number
let spawn: Vector3

const lastSafePos = new Map<string, Vector3>()

const worldBorder = () => {
    const players = world.getAllPlayers()
    const config = c()
    radius = world.getDynamicProperty("worldBorderSize") as number ?? config.worldBorder.radius
    spawn = world.getDefaultSpawnLocation()
    centerX = config.worldBorder.centerX ?? spawn.x
    centerZ = config.worldBorder.centerZ ?? spawn.z

    for (const player of players) {
        if (config.worldBorder.stopAdmin && isAdmin(player)) continue
        const { x, z } = player.location
        if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
            const teleportShould = lastSafePos.get(player.id)
            if (!teleportShould || Math.abs(teleportShould.x - centerX) > radius || Math.abs(teleportShould.z - centerZ) > radius)
                player.teleport(spawn)
            else player.teleport(teleportShould)
            player.sendMessage(`§bMatrix §7>§c You cannot access that location, you have reached the world border.`)
        }
    }
}
const blockCancel = (event: PlayerBreakBlockBeforeEvent | PlayerPlaceBlockBeforeEvent) => {
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return
    const { x, z } = event.block.location
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        event.cancel = true
        system.run(() => event.player.sendMessage(`§bMatrix §7>§c You cannot access a location which is outside the world border.`))
    }
}

const playerInteractBlock = (event: PlayerInteractWithBlockBeforeEvent) => {
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return
    const { block: { location: { x, z } } } = event
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        event.cancel = true
        system.run(() => event.player.sendMessage(`§bMatrix §7>§c You cannot interact with a block or entity which is outside the world border.`))
    }
}

const playerInteractEntity = (event: PlayerInteractWithEntityBeforeEvent) => {
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return
    const { target: { location: { x, z } } } = event
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        event.cancel = true
        system.run(() => event.player.sendMessage(`§bMatrix §7>§c You cannot interact with a block or entity which is outside the world border.`))
    }
}

let id: number

export default {
    enable () {
        id = system.runInterval(worldBorder, c().worldBorder.checkEvery)
        world.beforeEvents.playerBreakBlock.subscribe(blockCancel)
        world.beforeEvents.playerPlaceBlock.subscribe(blockCancel)
        world.beforeEvents.playerInteractWithBlock.subscribe(playerInteractBlock)
        world.beforeEvents.playerInteractWithEntity.subscribe(playerInteractEntity)
    },
    disable () {
        lastSafePos.clear()
        system.clearRun(id)
        world.beforeEvents.playerBreakBlock.subscribe(blockCancel)
        world.beforeEvents.playerPlaceBlock.subscribe(blockCancel)
        world.beforeEvents.playerInteractWithBlock.subscribe(playerInteractBlock)
        world.beforeEvents.playerInteractWithEntity.subscribe(playerInteractEntity)
    }
}