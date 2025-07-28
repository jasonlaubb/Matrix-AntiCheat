import { PlayerDimensionChangeAfterEvent, PlayerSpawnAfterEvent, world } from "@minecraft/server";
import { get } from "../util/database";
export function endNetherLockOn () {
    world.afterEvents.playerDimensionChange.subscribe(onDimensionChange);
    world.afterEvents.playerSpawn.subscribe(onJoin);
}
export function endNetherLockOff () {
    world.afterEvents.playerDimensionChange.unsubscribe(onDimensionChange);
    world.afterEvents.playerSpawn.unsubscribe(onJoin);
}
export function checkNetherEnd () {
    const lockEnd = get("endLock");
    const lockNether = get("netherLock");
    const overworld = world.getDimension("minecraft:overworld");
    world.getAllPlayers().forEach((player) => {
        const dimension = player.dimension.id;
        if (lockNether && dimension === "minecraft:nether" || lockEnd && dimension === "minecraft:the_end") {
            player.teleport(world.getDefaultSpawnLocation(), {
                dimension: overworld,
            });
        }
    })
}
function onDimensionChange ({ toDimension: { id }, player }: PlayerDimensionChangeAfterEvent) {
    if (get("netherLock") && id === "minecraft:nether" || get("endLock") && id === "minecraft:the_end") {
        player.teleport(world.getDefaultSpawnLocation(), {
            dimension: world.getDimension("minecraft:overworld"),
        });
    }
}
function onJoin ({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn) return;
    const dimension = player.dimension.id;
    if (get("netherLock") && dimension === "minecraft:nether" || get("endLock") && dimension === "minecraft:the_end") {
        player.teleport(world.getDefaultSpawnLocation(), {
            dimension: world.getDimension("minecraft:overworld"),
        });
    }
}