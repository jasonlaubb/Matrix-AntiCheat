import { GameMode, system } from "@minecraft/server";
import type { Command } from "../main";
import english from "../data/languages/english";
import { text } from "../util/text";
export const gma = {
    requireOp: true,
    name: "gma",
    description: english.commandGmaDescription,
    translationDef: {
        actionName: "commandGma",
        description: "commandGmaDescription",
    },
    execute: (player) => {
        system.run(() => player.setGameMode(GameMode.Adventure));
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandGmaSuccess") };
    },
} as Command;

export const gmc = {
    requireOp: true,
    name: "gmc",
    description: english.commandGmcDescription,
    translationDef: {
        actionName: "commandGmc",
        description: "commandGmcDescription",
    },
    execute: (player) => {
        system.run(() => player.setGameMode(GameMode.Creative));
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandGmcSuccess") };
    },
} as Command;

export const gms = {
    requireOp: true,
    name: "gms",
    description: english.commandGmsDescription,
    translationDef: {
        actionName: "commandGms",
        description: "commandGmsDescription",
    },
    execute: (player) => {
        system.run(() => player.setGameMode(GameMode.Survival));
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandGmsSuccess") };
    },
} as Command;

export const gmsp = {
    requireOp: true,
    name: "gmsp",
    description: english.commandGmspDescription,
    translationDef: {
        actionName: "commandGmsp",
        description: "commandGmspDescription",
    },
    execute: (player) => {
        system.run(() => player.setGameMode(GameMode.Spectator));
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandGmspSuccess") };
    },
} as Command;
