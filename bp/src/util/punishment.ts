import { Player, world } from "@minecraft/server";
interface BanData {
    name: string;
    id: string;
    reason: string;
    executor: string;
    expire: number;
}
interface NameBanData {
    name: string;
    reason: string;
    executor: string;
    expire: number;
}
export function ban(player: Player, reason: string, executor: string, expire: number) {
    const now = Date.now();
    if (expire <= now) return;
    world.setDynamicProperty(
        "banData:" + player.id,
        JSON.stringify({
            name: player.name,
            id: player.id, // Prevent name change bypass
            reason,
            executor,
            expire,
        } as BanData)
    );
}
export function banName(name: string, reason: string, executor: string, expire: number) {
    const now = Date.now();
    if (expire <= now) return;
    world.setDynamicProperty(
        "nameBanData:" + name,
        JSON.stringify({
            name,
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
        if (now > data.expire) {
            world.setDynamicProperty("banData:" + player.id);
        } else {
            player.kick(`§7[§aMatrix§7] §fYou are banned from this server!\n§gReason: §e${data.reason}\n§gExecutor: §e${data.executor}\n§gExpire: §e${new Date(data.expire).toLocaleString()}\n§gDuration: ${convertDurationString(data.expire - now)}`);
            return;
        }
    }
    const nameBanString = world.getDynamicProperty("nameBanData:" + player.name) as string;
    if (nameBanString) {
        const data = JSON.parse(nameBanString) as NameBanData;
        if (now > data.expire) {
            world.setDynamicProperty("nameBanData:" + player.name);
        } else {
            player.kick(`§7[§aMatrix§7] §fYou are banned from this server!\n§gReason: §e${data.reason}\n§gExecutor: §e${data.executor}\n§gExpire: §e${new Date(data.expire).toLocaleString()}\n§gDuration: ${convertDurationString(data.expire - now)}`);
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
