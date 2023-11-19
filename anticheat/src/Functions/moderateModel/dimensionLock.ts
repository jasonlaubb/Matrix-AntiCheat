import { world } from "@minecraft/server";
import { isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import lang from "../../Data/Languages/lang";

world.afterEvents.playerDimensionChange.subscribe(event => {
    const { player, toDimension, fromDimension } = event;
    const toggle: boolean = (world.getDynamicProperty("dimensionLock") ?? config.dimensionLock.enabled) as boolean;
    if (!toggle || isAdmin(player)) return
    if (toDimension.id !== "minecraft:overworld") {
        player.teleport(world.getDefaultSpawnLocation(),
        {
            dimension: world.getDimension("minecraft:overworld"),
            checkForBlocks: false
        })
    } else if (fromDimension.id !== "minecraft:overworld") {
        player.sendMessage("§bMatrix §7>§c " + lang(".dimensionLock.stop"))
    }
})

world.afterEvents.playerSpawn.subscribe(event => {
    const { player, initialSpawn } = event;
    const toggle: boolean = (world.getDynamicProperty("dimensionLock") ?? config.dimensionLock.enabled) as boolean;
    if (!toggle || !initialSpawn || isAdmin (player)) return

    const dimension = player.dimension

    if (dimension.id !== "minecraft:overworld") {
        player.teleport(world.getDefaultSpawnLocation(),
        {
            dimension: world.getDimension("minecraft:overworld"),
            checkForBlocks: false
        })
    }
})