import { Block, Dimension, Entity, Player, Vector3 } from "@minecraft/server";
import { min2 } from "./mathUtil";
import { get } from "./database";

export function addHP(entity: Entity, hp: number): void {
    if (!entity || !entity.isValid) return;
    const health = entity.getComponent("health")!;
    health.setCurrentValue(min2(health.currentValue + hp, health.effectiveMax));
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
export function fastSurround(centerLocation: Vector3, dimension: Dimension): (Block | undefined)[] | undefined {
    try {
        const block = dimension.getBlock(centerLocation);
        // directions
        const d = block!.below();
        const u = block!.above();
        const w = block!.west();
        const e = block!.east();
        const s = block!.south();
        const n = block!.north();
        const nw = n!.west();
        const ne = n!.east();
        const sw = s!.west();
        const se = s!.east();
        const uw = u!.west();
        const ue = u!.east();
        const us = u!.south();
        const un = u!.north();
        const dw = d!.west();
        const de = d!.east();
        const ds = d!.south();
        const dn = d!.north();
        const unw = un!.west();
        const une = un!.east();
        const usw = us!.west();
        const use = us!.east();
        const dsw = ds!.west();
        const dse = ds!.east();
        const dnw = dn!.west();
        const dne = dn!.east();
        return [d, u, w, e, s, n, nw, ne, sw, se, uw, ue, us, un, dw, de, ds, dn, unw, une, usw, use, dsw, dse, dnw, dne];
    } catch {
        return undefined;
    }
}
export function isRiding(player: Player) {
    return !!player.getComponent("minecraft:riding")?.entityRidingOn;
}
