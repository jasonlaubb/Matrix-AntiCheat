import { Player, system, world } from "@minecraft/server";
import { text } from "./text";
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
export function isBanned(playerName: string) {
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
                player.kick(
                    `§7[§aMatrix§7] §f${text("punishmentBanned")}\n§g${text("punishmentReason")}: §e${data.reason}\n§g${text("punishmentExecutor")}: §e${data.executor}\n§g${text("punishmentExpire")}: §e${new Date(data.expire).toLocaleString()}\n§g${text("punishmentDuration")}: §e${convertDurationString(data.expire - now)}`
                );
            } else {
                player.kick(`§7[§aMatrix§7] §f${text("punishmentBanned")}\n§g${text("punishmentReason")}: §e${data.reason}\n§g${text("punishmentExecutor")}: §e${data.executor}`);
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
                player.kick(
                    `§7[§aMatrix§7] §f${text("punishmentBanned")}\n§g${text("punishmentReason")}: §e${data.reason}\n§g${text("punishmentExecutor")}: §e${data.executor}\n§g${text("punishmentExpire")}: §e${new Date(data.expire).toLocaleString()}\n§g${text("punishmentDuration")}: §e${convertDurationString(data.expire - now)}`
                );
            } else {
                player.kick(`§7[§aMatrix§7] §f${text("punishmentBanned")}\n§g${text("punishmentReason")}: §e${data.reason}\n§g${text("punishmentExecutor")}: §e${data.executor}`);
            }
            return;
        }
    }
    const muteData = player.getDynamicProperty("muteData:" + player.id) as number;
    if (muteData) {
        if (muteData !== -1 && now > muteData) {
            player.setDynamicProperty("muteData:" + player.id);
            try {
                player.runCommand("ability @s mute false");
            } catch {}
        } else {
            try {
                player.runCommand("ability @s mute true");
                if (muteData !== -1) {
                    const id = system.runTimeout(
                        () => {
                            if (!player.isValid) return;
                            player.setDynamicProperty("muteData:" + player.id);
                            player.runCommand("ability @s mute false");
                        },
                        Math.ceil((now - muteData) / 50)
                    );
                    const leave = world.afterEvents.playerLeave.subscribe(({ playerId }) => {
                        if (playerId !== player.id) return;
                        system.clearRun(id);
                        world.afterEvents.playerLeave.unsubscribe(leave);
                    });
                }
            } catch {
                console.warn("Punishment :: Failed to mute due to edu not enabled.");
            }
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
