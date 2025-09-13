import { system } from "@minecraft/server";
import type { Command } from "../main";
import { get } from "../util/database";
import english from "../data/languages/english";
import { text } from "../util/text";
export const rankadd = {
    name: "rankadd",
    description: english.commandRankAddDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandRankAdd",
        description: "commandRankAddDescription",
        param: ["commandRankAddTarget", "commandRankAddName"],
        optionalParam: ["commandRankAddTier"],
    },
    parameters: [
        { name: "player", type: "player" },
        { name: "rank", type: "string" },
    ],
    optionalParameters: [{ name: "tier", type: "integer" }],
    execute: (_player, [target, rank, tier]) => {
        if (rank.includes(":")) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandRankInvalidSymbol") };
        const tag = `${get("chatRankTagPrefix")}${rank}::${tier ?? 0}`;
        if (target.getTags().includes(tag)) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandRankAlreadyHas", rank),
            };
        }
        system.run(() => target.addTag(tag));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandRankAddSuccess", rank, tier ?? 0, target.name),
        };
    },
} as Command;

export const rankremove = {
    name: "rankremove",
    description: english.commandRankRemoveDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandRankRemove",
        description: "commandRankRemoveDescription",
        param: ["commandRankRemoveTarget", "commandRankRemoveName"],
    },
    parameters: [
        { name: "player", type: "player" },
        { name: "rank", type: "string" },
    ],
    execute: (_player, [target, rank]) => {
        const targetTags = (target.getTags() as string[]).filter((t) => t.startsWith(`${get("chatRankTagPrefix")}${rank}::`));
        if (targetTags.length === 0) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandRankNotFound", rank),
            };
        }
        system.run(() => targetTags.forEach((tag) => target.removeTag(tag)));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandRankRemoveSuccess", rank, target.name),
        };
    },
} as Command;

export const ranklist = {
    name: "ranklist",
    description: english.commandRankListDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandRankList",
        description: "commandRankListDescription",
        param: ["commandRankListTarget"],
    },
    parameters: [{ name: "player", type: "player" }],
    execute: (_player, [target]) => {
        const rankPrefix = get("chatRankTagPrefix");
        const ranks = (target.getTags() as string[])
            .filter((tag) => tag.startsWith(rankPrefix) && tag.slice(rankPrefix.length).match(/^[^:]+::[0-9]+$/))
            .map((tag) => {
                const [rank, tier] = tag.slice(rankPrefix.length).split("::");
                return { rank, tier: parseInt(tier, 10) };
            })
            .sort((a, b) => b.tier - a.tier || a.rank.localeCompare(b.rank));

        if (ranks.length === 0) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandRankListEmpty", target.name),
            };
        }

        const formatted = ranks.map(({ rank, tier }) => `§r${rank} §r§7(${tier})§r`).join(", ");
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandRankListSuccess", target.name, formatted),
        };
    },
} as Command;

export const rankset = {
    name: "rankset",
    description: english.commandRankSetDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandRankSet",
        description: "commandRankSetDescription",
        param: ["commandRankSetTarget", "commandRankSetName"],
        optionalParam: ["commandRankSetTier"],
    },
    parameters: [
        { name: "player", type: "player" },
        { name: "rank", type: "string" },
    ],
    optionalParameters: [{ name: "tier", type: "integer" }],
    execute: (_player, [target, rank, tier]) => {
        if (rank.includes(":")) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandRankInvalidSymbol") };
        const prefix = get("chatRankTagPrefix");
        const tag = `${prefix}${rank}::${tier ?? 0}`;
        const targetTags = (target.getTags() as string[]).filter((t) => t.startsWith(prefix));
        system.run(() => {
            targetTags.forEach((tag) => target.removeTag(tag));
            target.addTag(tag);
        });
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandRankSetSuccess", rank, tier ?? 0, target.name),
        };
    },
} as Command;

export const rankclear = {
    name: "rankclear",
    description: english.commandRankClearDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandRankClear",
        description: "commandRankClearDescription",
        param: ["commandRankClearTarget"],
    },
    parameters: [{ name: "player", type: "player" }],
    execute: (_player, [target]) => {
        const prefix = get("chatRankTagPrefix");
        const targetTags = (target.getTags() as string[]).filter((t) => t.startsWith(prefix));
        if (targetTags.length === 0) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandRankListEmpty", target.name),
            };
        }
        system.run(() => targetTags.forEach((tag) => target.removeTag(tag)));
        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandRankClearSuccess", target.name),
        };
    },
} as Command;
