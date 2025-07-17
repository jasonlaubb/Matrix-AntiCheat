import { system } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
export const rankadd = {
    name: "rankadd",
    description: "Add a rank to a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "player",
        },
        {
            name: "rank",
            type: "string",
        },
    ],
    optionalParameters: [
        {
            name: "tier",
            type: "integer",
        },
    ],
    execute: (_player, [target, rank, tier]) => {
        if (rank.includes(":")) return { status: 1, message: "§7[§aMatrix§7] §fRank cannot contain ':'" };
        const tag = `${get("chatRankTagPrefix")}${rank}::${tier ?? 0}`;
        if (target.getTags().includes(tag)) return { status: 1, message: `§7[§aMatrix§7] §fPlayer already has the rank ${rank} with same tier.` };
        system.run(() => target.addTag(tag));
        return { status: 0, message: `§7[§aMatrix§7] §fAdded rank ${rank}§r§f with tier ${tier ?? 0} to player ${target.name}.` };
    },
} as Command;
export const rankremove = {
    name: "rankremove",
    description: "Remove a rank from a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "player",
        },
        {
            name: "rank",
            type: "string",
        },
    ],
    execute: (_player, [target, rank]) => {
        const targetTags = (target.getTags() as string[]).filter((t) => t.startsWith(`${get("chatRankTagPrefix")}${rank}::`));
        if (targetTags.length === 0) return { status: 1, message: `§7[§aMatrix§7] §fPlayer does not have the rank ${rank}.` };
        system.run(() => targetTags.forEach((tag) => target.removeTag(tag)));
        return { status: 0, message: `§7[§aMatrix§7] §fRemoved rank ${rank}§r§f from player ${target.name}.` };
    },
} as Command;
export const ranklist = {
    name: "ranklist",
    description: "List all ranks of a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "player",
        },
    ],
    execute: (_player, [target]) => {
        const rankPrefix = get("chatRankTagPrefix");
        const ranks = (target.getTags() as string[])
            .filter((tag) => tag.startsWith(rankPrefix) && tag.slice(rankPrefix.length).match(/^[^:]+::[0-9]+$/))
            .map((tag) => {
                const [rank, tier] = tag.slice(rankPrefix.length).split("::");
                return { rank, tier: parseInt(tier, 10) };
            })
            .sort((a, b) => b.tier - a.tier || a.rank.localeCompare(b.rank));
        if (ranks.length === 0) return { status: 1, message: `§7[§aMatrix§7] §fPlayer ${target.name} has no ranks.` };
        return { status: 0, message: `§7[§aMatrix§7] §fPlayer ${target.name} has ranks (sorted): ${ranks.join(", ")}` };
    },
} as Command;
export const rankset = {
    name: "rankset",
    description: "Remove all ranks of a player and set a new one",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "player",
        },
        {
            name: "rank",
            type: "string",
        },
    ],
    optionalParameters: [
        {
            name: "tier",
            type: "integer",
        },
    ],
    execute: (_player, [target, rank, tier]) => {
        if (rank.includes(":")) return { status: 1, message: "§7[§aMatrix§7] §fRank cannot contain ':'" };
        const prefix = get("chatRankTagPrefix");
        const tag = `${prefix}${rank}::${tier ?? 0}`;
        const targetTags = (target.getTags() as string[]).filter((t) => t.startsWith(prefix));
        system.run(() => {
            targetTags.forEach((tag) => target.removeTag(tag));
            target.addTag(tag);
        });
        return { status: 0, message: `§7[§aMatrix§7] §fSet rank ${rank}§r§f with tier ${tier ?? 0} to player ${target.name}.` };
    },
} as Command;
export const rankclear = {
    name: "rankclear",
    description: "Remove all ranks of a player",
    requireOp: true,
    parameters: [
        {
            name: "player",
            type: "player",
        },
    ],
    execute: (_player, [target]) => {
        const prefix = get("chatRankTagPrefix");
        const targetTags = (target.getTags() as string[]).filter((t) => t.startsWith(prefix));
        if (targetTags.length === 0) return { status: 1, message: `§7[§aMatrix§7] §fPlayer ${target.name} has no ranks.` };
        system.run(() => targetTags.forEach((tag) => target.removeTag(tag)));
        return { status: 0, message: `§7[§aMatrix§7] §fRemoved all ranks from player ${target.name}.` };
    },
} as Command;
