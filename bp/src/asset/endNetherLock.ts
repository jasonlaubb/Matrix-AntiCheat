import { PlayerDimensionChangeAfterEvent, world } from "@minecraft/server";
import { get } from "../util/database";
export function endNetherLockOn () {
    world.afterEvents.playerDimensionChange.subscribe(onDimensionChange);
}
export function endNetherLockOff () {
    world.afterEvents.playerDimensionChange.unsubscribe(onDimensionChange);
}
function onDimensionChange ({ toDimension, player }: PlayerDimensionChangeAfterEvent) {
    if (get("netherLock") && toDimension.id === "minecraft:nether" || get("endLock") && toDimension.id === "minecraft:the_end") {
        player.teleport(world.getDefaultSpawnLocation(), {
            dimension: world.getDimension("minecraft:overworld"),
        });
    }
}