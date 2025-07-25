import { Player, world } from "@minecraft/server";
import { addPlayerInterval } from "../util/tick";
import { get } from "../util/database";
import { fastAbs } from "../util/mathUtil";

export function worldBorderOn () {
    addPlayerInterval(tickEvent);
}
export function worldBorderOff () {

}
const particleId = "minecraft:raid_omen_emitter";
function tickEvent (player: Player) {
    const size = get("worldBorderSize") as number;
    const { x: x1, y, z: z1 } = player.location;
    const spawnLoc = world.getDefaultSpawnLocation();
    const { x: x2, z: z2 } = spawnLoc;
    const xDiff = fastAbs(x1 - x2);
    const zDiff = fastAbs(z1 - z2)
    const x = xDiff > size;
    const z = zDiff > size;
    player.lastSafeLocation ??= spawnLoc;
    if (x || z) {
        if (fastAbs(x2 - player.lastSafeLocation.x) <= size && fastAbs(z2 - player.lastSafeLocation.z)) {
            player.teleport(player.lastSafeLocation);
        } else player.teleport(spawnLoc);
    } else {
        player.lastSafeLocation = player.location;
    }
    if (get("worldBorderEffect")) {
        if (xDiff <= 7) {
            const targetX = x1 + size;
            const startZ = z1 - 5;
            for (let i = 0; i < 10; i++) {
                player.dimension.spawnParticle(particleId, { x: targetX, y, z: startZ + i });
            }
        }
        if (zDiff <= 7) {
            const targetZ = z1 + size;
            const startX = x1 - 5;
            for (let x = 0; x < 10; x++) {
                player.dimension.spawnParticle(particleId, { x: startX + x, y, z: targetZ });
            }
        }
    }
}