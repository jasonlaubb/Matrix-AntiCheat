import {
    LocationInUnloadedChunkError,
    PlayerBreakBlockBeforeEvent,
    PlayerInteractWithBlockBeforeEvent,
    PlayerPlaceBlockBeforeEvent,
    Vector3,
    world
} from "@minecraft/server";
import { addInterval, removeInterval } from "../util/tick";
import { get } from "../util/database";
import { fastAbs } from "../util/mathUtil";

export function worldBorderOn() {
    addInterval(tickEvent);
    world.beforeEvents.playerBreakBlock.subscribe(blockChange);
    world.beforeEvents.playerPlaceBlock.subscribe(blockChange);
    world.beforeEvents.playerInteractWithBlock.subscribe(blockChange);
}

export function worldBorderOff() {
    removeInterval(tickEvent);
    world.beforeEvents.playerBreakBlock.unsubscribe(blockChange);
    world.beforeEvents.playerPlaceBlock.unsubscribe(blockChange);
    world.beforeEvents.playerInteractWithBlock.unsubscribe(blockChange);
}

let steps = 0;
function tickEvent() {
    const players = world.getAllPlayers();
    steps++;
    const size: number = get("worldBorderSize") as number;
    const spawnLoc = world.getDefaultSpawnLocation();
    const addEffect: boolean = get("worldBorderEffect");
    const wallLength: number = get("worldBorderEffectLength");
    const wallHeight: number = get("worldBorderEffectHeight");
    const yOffset: number = get("worldBorderYOffset");
    const particleId: string = get("worldBorderParticle");
    if (size < 10) return;
    for (const player of players) {
    const { x: x1, y: y1, z: z1 } = player.location;
    const baseY = Math.floor(y1) - yOffset;
    const { x: x2, z: z2 } = spawnLoc;

    const xDiff = fastAbs(Math.floor(x1) - x2);
    const zDiff = fastAbs(Math.floor(z1) - z2);
    const outOfBoundsX = xDiff > size;
    const outOfBoundsZ = zDiff > size;

    player.lastSafeLocation ??= spawnLoc;
    player.lastDimension ??= "minecraft:overworld";

    if (outOfBoundsX || outOfBoundsZ) {
        const safeX = fastAbs(x2 - player.lastSafeLocation.x) <= size;
        const safeZ = fastAbs(z2 - player.lastSafeLocation.z) <= size;
        if (safeX && safeZ) {
            player.teleport(middleLoc(player.lastSafeLocation), {
                dimension: world.getDimension(player.lastDimension)
            });
        } else {
            player.teleport(spawnLoc, {
                dimension: world.getDimension("minecraft:overworld")
            });
        }
    } else {
        player.lastSafeLocation = { x: Math.floor(x1), y: y1, z: Math.floor(z1) };
        player.lastDimension = player.dimension.id;
    }

    if (steps === 10 && addEffect) {
        const xDist = fastAbs(size - xDiff);
        const zDist = fastAbs(size - zDiff);
        const nearX = xDist <= 12;
        const nearZ = zDist <= 12;

        const targetX = x1 > x2 ? x2 + size : x2 - size;
        const targetZ = z1 > z2 ? z2 + size : z2 - size;
        const dxDir = x1 > x2 ? -1 : 1;
        const dzDir = z1 > z2 ? -1 : 1;
        const zOffset = x1 > x2 && z1 > z2 ? 1 : 0;
        try {
        if (nearX && nearZ) {
            // L-shape corner wall
            for (let i = 0; i < wallLength; i++) {
                for (let dy = 0; dy < wallHeight; dy++) {
                    const spawnY = baseY + dy;
                    if (spawnY > 320 || spawnY < -64) continue;
                    player.dimension.spawnParticle(particleId, {
                        x: x1 > x2 ? targetX + 1 : targetX,
                        y: spawnY,
                        z: targetZ + i * dzDir + zOffset,
                    });
                }
            }
            for (let i = 0; i < wallLength; i++) {
                for (let dy = 0; dy < wallHeight; dy++) {
                    const spawnY = baseY + dy;
                    if (spawnY > 320 || spawnY < -64) continue
                    player.dimension.spawnParticle(particleId, {
                        x: targetX + i * dxDir,
                        y: spawnY,
                        z: z1 > z2 ? targetZ + 1 : targetZ,
                    });
                }
            }
        } else if (nearX) {
            for (let i = 0; i < wallLength; i++) {
                for (let dy = 0; dy < wallHeight; dy++) {
                    const spawnY = baseY + dy;
                    if (spawnY > 320 || spawnY < -64) continue;
                    player.dimension.spawnParticle(particleId, {
                        x: x1 > x2 ? targetX + 1 : targetX,
                        y: spawnY,
                        z: Math.floor(z1) - wallLength * .5 + i,
                    });
                }
            }
        } else if (nearZ) {
            for (let i = 0; i < wallLength; i++) {
                for (let dy = 0; dy < wallHeight; dy++) {
                    const spawnY = baseY + dy;
                    if (spawnY > 320 || spawnY < -64) continue;
                    player.dimension.spawnParticle(particleId, {
                        x: Math.floor(x1) - wallLength * .5 + i,
                        y: spawnY,
                        z: z1 > z2 ? targetZ + 1 : targetZ,
                    });
                }
            }
        }
        } catch (error) {
            if (error instanceof LocationInUnloadedChunkError) return; // Ignore this error
            throw error;
        }
    }
    }
    if (steps >= 10) steps = 0;
}

function blockChange(
    event:
        | PlayerBreakBlockBeforeEvent
        | PlayerPlaceBlockBeforeEvent
        | PlayerInteractWithBlockBeforeEvent
) {
    const { x, z } = event.block.location;
    const { x: x2, z: z2 } = world.getDefaultSpawnLocation();
    const size = get("worldBorderSize") as number;
    if (fastAbs(x - x2) > size || fastAbs(z - z2) > size) {
        event.cancel = true;
    }
}

function middleLoc ({ x, y, z }: Vector3) {
    return { x: x + .5, y, z: z + .5 };
}