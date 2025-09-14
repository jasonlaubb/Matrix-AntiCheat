import { Block, Dimension, Direction, Entity, HudVisibility, Player, Vector3, world } from "@minecraft/server";
import { get } from "./database";
import { deltaVector, floorVector, safeGetBlock, safeGetBlockNear } from "./vectorUtil";

export function addHP(entity: Entity, hp: number): void {
    if (!entity.isValid) return;
    const health = entity.getComponent("health");
    if (health) health.setCurrentValue(Math.min(health.currentValue + hp, health.effectiveMax));
}
export function banAttack(player: Player, duration: number) {
    player.addEffect("minecraft:weakness", duration, { amplifier: 150, showParticles: false });
}
export function locEqual(loc1: Vector3, loc2: Vector3): boolean {
    return loc1.x === loc2.x && loc1.y === loc2.y && loc1.z === loc2.z;
}
export function getPlayerRank(player: Player) {
    const rankPrefix = get("chatRankTagPrefix");
    const tags = player
        .getTags()
        .filter((tag) => tag.startsWith(rankPrefix) && tag.slice(rankPrefix.length).match(/^[^:]+::[0-9]+$/))
        .map((tag) => {
            const [rank, tier] = tag.slice(rankPrefix.length).split("::");
            return { rank, tier: parseInt(tier, 10) };
        });
    return tags.length > 0 ? tags.sort((a, b) => b.tier - a.tier || a.rank.localeCompare(b.rank))[0].rank : (get("chatRankDefaultRank") as string);
}
export function parseTime(timeUnit: string, value: number) {
    switch (timeUnit) {
        case "s":
        case "second": {
            return Math.floor(value * 1000);
        }
        case "m":
        case "minute": {
            return Math.floor(value * 60000);
        }
        case "h":
        case "hour": {
            return Math.floor(value * 3600000);
        }
        case "d":
        case "day": {
            return Math.floor(value * 86400000);
        }
        case "w":
        case "week": {
            return Math.floor(value * 604800000);
        }
        case "mo":
        case "month": {
            return Math.floor(value * 2592000000);
        }
        case "y":
        case "year": {
            return Math.floor(value * 31536000000);
        }
        default: {
            return 0;
        }
    }
}
export function stringXyz(location: Vector3) {
    return Object.values(location).join(",");
}
const surroundOffsets: [number, number, number][] = [
    // Layer below (-1)
    [-1, -1, -1],
    [0, -1, -1],
    [1, -1, -1],
    [-1, -1, 0],
    [0, -1, 0],
    [1, -1, 0],
    [-1, -1, 1],
    [0, -1, 1],
    [1, -1, 1],
    // Layer center (0)
    [-1, 0, -1],
    [0, 0, -1],
    [1, 0, -1],
    [-1, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
    [-1, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    // Layer above (+1)
    [-1, 1, -1],
    [0, 1, -1],
    [1, 1, -1],
    [-1, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
    [-1, 1, 1],
    [0, 1, 1],
    [1, 1, 1],
];

export function fastSurround(centerLocation: Vector3, dimension: Dimension): (Block | undefined)[] | undefined {
    return surroundOffsets.map(([dx, dy, dz]) => {
        const pos: Vector3 = {
            x: centerLocation.x + dx,
            y: centerLocation.y + dy,
            z: centerLocation.z + dz,
        };
        return safeGetBlock(dimension, pos);
    });
}
export function isRiding(player: Player) {
    return !!player.getComponent("minecraft:riding")?.entityRidingOn;
}
export function getSurround(block: Block) {
    return Object.values(Direction).map((direction) => safeGetBlockNear(block, direction));
}
export function hasEducationalFeature() {
    return world.educationalFeaturesEnabled ?? false;
}
export function isFamily(entity: Entity, family: string) {
    return entity.runCommand(`testfor @s[family=${family}]`).successCount > 0;
}
export function isAlive(entity: Entity) {
    return (entity.getComponent("health")?.currentValue ?? 20) > 0;
}
export function isObstructedBetweenLocations(start: Vector3, end: Vector3, dimension: Dimension, stepSize: number = 0.5): boolean {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dz = end.z - start.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const steps = Math.floor(distance / stepSize);
    const stepX = dx / steps;
    const stepY = dy / steps;
    const stepZ = dz / steps;
    for (let i = 0; i <= steps; i++) {
        const blockLocation = floorVector(deltaVector(start, stepX * i, stepY * i, stepZ * i));
        const block = safeGetBlock(dimension, blockLocation);
        if (block && (block.isSolid || (block.typeId.startsWith("minecraft:") && block.typeId.endsWith("glass")))) {
            return true;
        }
    }
    return false;
}
export function hideHud (player: Player) {
    player.onScreenDisplay.setHudVisibility(HudVisibility.Hide);
}
export function showHud (player: Player) {
    player.onScreenDisplay.setHudVisibility(HudVisibility.Reset)
}