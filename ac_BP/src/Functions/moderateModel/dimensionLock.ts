import { world, system } from "@minecraft/server";
import { c, isAdmin, rawstr } from "../../Assets/Util";
import { MinecraftDimensionTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
world.afterEvents.playerDimensionChange.subscribe((event) => {
    const { player, toDimension, fromDimension } = event;
    const config = c();
    const toggle: boolean = (world.getDynamicProperty("dimensionLock") ?? config.dimensionLock.enabled) as boolean;
    if (!toggle || isAdmin(player)) return;
    if (toDimension.id !== MinecraftDimensionTypes.Overworld) {
        system.run(() =>
            player.teleport(world.getDefaultSpawnLocation(), {
                dimension: world.getDimension(MinecraftDimensionTypes.Overworld),
                checkForBlocks: false,
            })
        );
    } else if (fromDimension.id !== MinecraftDimensionTypes.Overworld) {
        player.sendMessage(rawstr.new(true, "c").tra("dimensionlock.stop").parse());
    }
});

world.afterEvents.playerSpawn.subscribe((event) => {
    const { player, initialSpawn } = event;
    const config = c();
    const toggle: boolean = (world.getDynamicProperty("dimensionLock") ?? config.dimensionLock.enabled) as boolean;
    if (!toggle || !initialSpawn || isAdmin(player)) return;

    const dimension = player.dimension;

    if (dimension.id !== MinecraftDimensionTypes.Overworld) {
        system.run(() =>
            player.teleport(world.getDefaultSpawnLocation(), {
                dimension: world.getDimension(MinecraftDimensionTypes.Overworld),
                checkForBlocks: false,
            })
        );
    }
});
