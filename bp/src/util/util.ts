import { Entity, Player, Vector3 } from "@minecraft/server";
import { min2 } from "./mathUtil";
import { get } from "./database";

export function addHP(entity: Entity, hp: number): void {
    if (!entity || !entity.isValid) return;
    const health = entity.getComponent("health")!;
    health.setCurrentValue(min2(health.currentValue + hp, health.effectiveMax));
}

export function locEqual(loc1: Vector3, loc2: Vector3): boolean {
    return loc1.x === loc2.x && loc1.y === loc2.y && loc1.z === loc2.z;
}
export function getPlayerRank (player: Player) {
    const rankPrefix = get("chatRankTagPrefix");
    const tags = player.getTags().filter((tag) => tag.startsWith(rankPrefix) && tag.slice(rankPrefix.length).match(/^[^:]+::[0-9]+$/)).map((tag) => {
        const [rank, tier] = tag.slice(rankPrefix.length).split("::");
        return { rank, tier: parseInt(tier, 10) };
        });
    return tags.length > 0 ? tags.sort((a, b) => 
        b.tier - a.tier || a.rank.localeCompare(b.rank)
    )[0].rank : get("chatRankDefaultRank") as string;
}