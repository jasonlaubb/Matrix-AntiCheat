import { Player, world } from "@minecraft/server";
export interface BanData {
    name: string;
    reason: string;
    executor: string;
    expire?: number;
}
interface NameBanData {
    name: string;
    reason: string;
    executor: string;
    expire?: number;
}
export function ban(player: Player, reason: string, executor: string, expire?: number) {
    const now = Date.now();
    if (expire && expire <= now) return;
    world.setDynamicProperty(
        "banData:" + player.id,
        JSON.stringify({
            reason,
            name: player.name,
            executor,
            expire,
        } as BanData)
    );
}
export function isBanned (playerName: string) {
    const ids = world.getDynamicPropertyIds();
    for (const id of ids) {
        if (!id.startsWith("banData:")) continue;
        const data = JSON.parse(world.getDynamicProperty(id) as string) as BanData;
        if (data.name === playerName) return id;
    }
    return undefined;
}
export function banName(name: string, reason: string, executor: string, expire?: number) {
    const now = Date.now();
    if (expire && expire <= now) return;
    world.setDynamicProperty(
        "nameBanData:" + name,
        JSON.stringify({
            reason,
            executor,
            expire,
        } as NameBanData)
    );
}
export function checkPunish(player: Player) {
    const banString = world.getDynamicProperty("banData:" + player.id) as string;
    const now = Date.now();
    if (banString) {
        const data = JSON.parse(banString) as BanData;
        if (data.expire && now > data.expire) {
            world.setDynamicProperty("banData:" + player.id);
        } else {
            if (data.expire) {
                player.kick(`§7[§aMatrix§7] §fYou are banned from this server!\n§gReason: §e${data.reason}\n§gExecutor: §e${data.executor}\n§gExpire: §e${new Date(data.expire).toLocaleString()}\n§gDuration: §e${convertDurationString(data.expire - now)}`);
            } else {
                player.kick(`§7[§aMatrix§7] §fYou are banned from this server!\n§gReason: §e${data.reason}\n§gExecutor: §e${data.executor}`);
            }
            return;
        }
    }
    const nameBanString = world.getDynamicProperty("nameBanData:" + player.name) as string;
    if (nameBanString) {
        const data = JSON.parse(nameBanString) as NameBanData;
        if (data.expire && now > data.expire) {
            world.setDynamicProperty("nameBanData:" + player.name);
        } else {
            ban(player, data.reason, data.executor, data.expire);
            world.setDynamicProperty("nameBanData:" + player.name);
            if (data.expire) {
                player.kick(`§7[§aMatrix§7] §fYou are banned from this server!\n§gReason: §e${data.reason}\n§gExecutor: §e${data.executor}\n§gExpire: §e${new Date(data.expire).toLocaleString()}\n§gDuration: §e${convertDurationString(data.expire - now)}`);
            } else {
                player.kick(`§7[§aMatrix§7] §fYou are banned from this server!\n§gReason: §e${data.reason}\n§gExecutor: §e${data.executor}`);
            }
            return;
        }
    }
}
function convertDurationString(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}
