import { GameMode, system } from "@minecraft/server";
import type { Command } from "../main";
export const gma = {
    requireOp: true,
    name: "gma",
    description: "Switch your gamemode to advanture mode",
    execute: (player) => {
        system.run(() => player.setGameMode(GameMode.Adventure));
        return { status: 0, message: "§7[§aMatrix§7] §fSwitched your gamemode to advanture." };
    }
} as Command;
export const gmc = {
    requireOp: true,
    name: "gmc",
    description: "Switch your gamemode to creative mode",
    execute: (player) => {
        system.run(() => player.setGameMode(GameMode.Creative));
        return { status: 0, message: "§7[§aMatrix§7] §fSwitched your gamemode to creative." };
    }
} as Command;
export const gms = {
    requireOp: true,
    name: "gms",
    description: "Switch your gamemode to survival mode",
    execute: (player) => {
        system.run(() => player.setGameMode(GameMode.Survival));
        return { status: 0, message: "§7[§aMatrix§7] §fSwitched your gamemode to survival." };
    }
} as Command;
export const gmsp = {
    requireOp: true,
    name: "gmsp",
    description: "Switch your gamemode to spectator mode",
    execute: (player) => {
        system.run(() => player.setGameMode(GameMode.Creative));
        return { status: 0, message: "§7[§aMatrix§7] §fSwitched your gamemode to spectator." };
    }
} as Command;