import { Player, world } from "@minecraft/server";
export interface BanData {
    name: string;
    id: string;
    reason: string;
    executor: string;
    expire: number;
    time: number;
}
export interface NameBanData {
    name: string;
    reason: string;
    executor: string;
    expire: number;
    time: number;
}
export function ban (player: Player, reason: string, expire: number) {
    const now = Date.now();
    if (expire <= now) return;
    world.setDynamicProperty("banData:" + player.id, JSON.stringify({
        name: player.name,
        id: player.id, // Prevent name change bypass
        reason,
        executor: player.name,
        expire,
        time: now
    }));
}
export function banName (name: string, reason: string, executor: string, expire: number) {
    const now = Date.now();
    if (expire <= now) return;
    world.setDynamicProperty("nameBanData:" + name, JSON.stringify({
        name,
        reason,
        executor,
        expire,
        time: now
    }));
}