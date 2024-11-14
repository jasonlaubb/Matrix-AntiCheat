import { Player, system, world } from "@minecraft/server";
import { rawtext, rawtextTranslate, rawtextTranslateRawText } from "./rawtext";
import { MinecraftDimensionTypes, MinecraftEffectTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
export function setupModeration() {
    world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
        if (!initialSpawn) return;
        const softBanStatus = player.getDynamicProperty("isSoftBanned") as number;
        if (softBanStatus) {
            if (softBanStatus != -1 && Date.now() > softBanStatus) {
                player.setDynamicProperty("isSoftBanned");
                player.teleport(player.getSpawnPoint() ?? world.getDefaultSpawnLocation(), { dimension: world.getDimension(MinecraftDimensionTypes.Overworld) });
            } else {
                const id = system.runInterval(() => {
                    player.inputPermissions.movementEnabled = false;
                    player.inputPermissions.cameraEnabled = false;
                    if (player.location.y != 350) {
                        player.teleport({ x: player.location.x, y: 350, z: player.location.z });
                    }
                    if (player.getEffect(MinecraftEffectTypes.Blindness)?.duration ?? 0 < 160) {
                        player.addEffect(MinecraftEffectTypes.Blindness, 300, { showParticles: false });
                    }
                    const untilTime = softBanStatus == -1 ? rawtextTranslate("moderation.permanent") : rawtext({ text: new Date(softBanStatus).toUTCString() });
                    player.onScreenDisplay.updateSubtitle(rawtextTranslateRawText("moderation.softban.until", untilTime));
                    player.onScreenDisplay.setTitle(rawtextTranslate("moderation.softban.until"), { stayDuration: 10, fadeInDuration: 0, fadeOutDuration: 0 });
                }, 5);
                const leaveEvent = world.afterEvents.playerLeave.subscribe(({ playerId }) => {
                    if (player.id != playerId) return;
                    system.clearRun(id);
                    world.afterEvents.playerLeave.unsubscribe(leaveEvent);
                });
            }
        }
        const banStatus = player.getDynamicProperty("isBanned") as number;
        if (banStatus) {
            if (banStatus != -1 && Date.now() > banStatus) {
                player.setDynamicProperty("isBanned");
            } else {
                let message = "§aBan handled by Matrix AntiCheat\n";
                if (banStatus == -1) {
                    message += "§gRegretfully, you have been§e banned permanently§g on this server. If you think there is a mistake or you want to appeal, please contact the operator of the current server.";
                } else {
                    message += "§gYou have been§e banned§g from the server, this ban will be valid until §e" + new Date(banStatus).toUTCString();
                }
                player
                    .runCommandAsync(`kick "${player.name}" ${message}`)
                    .then((commandResult) => {
                        if (commandResult.successCount != 1) {
                            tempKick(player);
                        }
                    })
                    .catch(() => {
                        tempKick(player);
                    });
            }
        }
    });
}
export function tempKick(player: Player) {
    player.triggerEvent("matrix:tempkick");
}
/**
 * @description Prevent anti kick from stopping the kick.
 */
export function strengthenKick(player: Player, reason: string = "§cNo reason provided") {
    player
        .runCommandAsync(`kick "${player.name}" §aKick handled by Matrix AntiCheat\n§gReason: §e${reason}`)
        .then((commandResult) => {
            if (commandResult.successCount != 1) {
                tempKick(player);
            }
        })
        .catch(() => {
            tempKick(player);
        });
}
/**
 * @param player
 * @param duration Accept ms, 1000ms = 1 second, Input -1 to set softban to permanent
 */
export function softBan(player: Player, duration: number) {
    if (duration == -1) {
        player.setDynamicProperty("isSoftBanned", -1);
    } else {
        player.setDynamicProperty("isSoftBanned", Date.now() + duration);
    }
}
