import { Player, PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockBeforeEvent, PlayerPlaceBlockBeforeEvent, world } from "@minecraft/server";
import { addPlayerInterval, removePlayerInterval } from "../util/tick";
import { get } from "../util/database";
import { fastAbs } from "../util/mathUtil";

export function worldBorderOn() {
    addPlayerInterval(tickEvent);
    world.beforeEvents.playerBreakBlock.subscribe(blockChange);
    world.beforeEvents.playerPlaceBlock.subscribe(blockChange);
    world.beforeEvents.playerInteractWithBlock.subscribe(blockChange);
}
export function worldBorderOff() {
    removePlayerInterval(tickEvent);
    world.beforeEvents.playerBreakBlock.unsubscribe(blockChange);
    world.beforeEvents.playerPlaceBlock.unsubscribe(blockChange);
    world.beforeEvents.playerInteractWithBlock.unsubscribe(blockChange);
}
const particleId = "minecraft:note_particle";
function tickEvent(player: Player) {
    const size = get("worldBorderSize") as number;
    const { x: x1, y, z: z1 } = player.location;
    const spawnLoc = world.getDefaultSpawnLocation();
    const { x: x2, z: z2 } = spawnLoc;
    const xDiff = fastAbs(x1 - x2);
    const zDiff = fastAbs(z1 - z2);
    const x = xDiff > size;
    const z = zDiff > size;
    player.lastSafeLocation ??= spawnLoc;
    player.lastDimension ??= "minecraft:overworld";
    if (x || z) {
        if (fastAbs(x2 - player.lastSafeLocation.x) <= size && fastAbs(z2 - player.lastSafeLocation.z)) {
            player.teleport(player.lastSafeLocation, { dimension: world.getDimension(player.lastDimension) });
        } else player.teleport(spawnLoc, { dimension: world.getDimension("minecraft:overworld") }); // Nearly impossible situration but possible when admin change border size
    } else {
        player.lastSafeLocation = player.location;
        player.lastDimension = player.dimension.id;
    }
    if (get("worldBorderEffect")) {
    const xDist = fastAbs(size - xDiff);
    const zDist = fastAbs(size - zDiff);

    const nearX = xDist <= 7;
    const nearZ = zDist <= 7;

    if (nearX && nearZ) {
        const targetX = x1 > x2 ? x2 + size : x2 - size;
        const targetZ = z1 > z2 ? z2 + size : z2 - size;

        // L-shape: vertical line along Z
        for (let dz = 0; dz < 20; dz++) {
            player.dimension.spawnParticle(particleId, { x: targetX, y, z: targetZ - (z1 > z2 ? dz : -dz) });
        }

        // L-shape: horizontal line along X
        for (let dx = 0; dx < 20; dx++) {
            player.dimension.spawnParticle(particleId, { x: targetX - (x1 > x2 ? dx : -dx), y, z: targetZ });
        }
    } else if (nearX) {
        const targetX = x1 > x2 ? x2 + size : x2 - size;
        const startZ = z1 - 10;
        for (let i = 0; i < 20; i++) {
            player.dimension.spawnParticle(particleId, { x: targetX, y, z: startZ + i });
        }
    } else if (nearZ) {
        const targetZ = z1 > z2 ? z2 + size : z2 - size;
        const startX = x1 - 10;
        for (let x = 0; x < 20; x++) {
            player.dimension.spawnParticle(particleId, { x: startX + x, y, z: targetZ });
        }
    }
}
}
function blockChange(event: PlayerBreakBlockBeforeEvent | PlayerPlaceBlockBeforeEvent | PlayerInteractWithBlockBeforeEvent) {
    const { x, z } = event.block.location;
    const { x: x2, z: z2 } = world.getDefaultSpawnLocation();
    const size = get("worldBorderSize") as number;
    if (fastAbs(x - x2) >= size || fastAbs(z - z2) >= size) {
        event.cancel = true;
    }
}
