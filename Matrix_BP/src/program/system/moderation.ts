import { Player, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { rawtext, rawtextTranslate, rawtextTranslateRawText } from "../../util/rawtext";
import { MinecraftDimensionTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { Module } from "../../matrixAPI";
new Module()
    .lockModule()
    .addCategory("system")
    .onModuleEnable(() => {
        world.afterEvents.playerSpawn.subscribe(onPlayerSpawn);
    })
    .register();
export type Punishment = "tempKick" | "kick" | "softBan" | "ban" | "freeze" | "mute";
export function tempKick(player: Player) {
    if (player.hasTag("punishmentResistance") && player.safeIsOp()) return;
    player.triggerEvent("matrix:tempkick");
}
export function ban (player: Player, duration: number) {
    if (player.hasTag("punishmentResistance") && player.safeIsOp()) return;
    const obj = world.scoreboard.getObjective(`matrix:banRecord`);
    if (!obj) {
        world.scoreboard.addObjective(`matrix:banRecord`, "Matrix AntiCheat");
        return ban(player, duration);
    }
    obj.setScore("::" + player.name, 0);
    player.setDynamicProperty("isBanned", duration == -1 ? -1 : Date.now() + duration);
    kickForBan(player, duration);
}
export function unBan (playerName: string) {
    const obj = world.scoreboard.getObjective(`matrix:unBanRequest`);
    if (!obj) {
        world.scoreboard.addObjective(`matrix:unBanRequest`, "Matrix AntiCheat");
        return unBan(playerName);
    }
    if (obj.getScore("::" + playerName)) return false;
    if (!world.scoreboard.getObjective(`matrix:banRecord`)?.getScore("::" + playerName)) return null;
    obj.setScore("::" + playerName, 0);
    return true;
}
/**
 * @description Prevent anti kick from stopping the kick.
 */
export function strengthenKick(player: Player, reason: string = "§cNo reason provided") {
    if (player.hasTag("punishmentResistance") && player.safeIsOp()) return;
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
    if (player.hasTag("punishmentResistance") && player.safeIsOp()) return;
    if (duration == -1) {
        player.setDynamicProperty("isSoftBanned", -1);
    } else {
        player.setDynamicProperty("isSoftBanned", Date.now() + duration);
    }
}
/**
 * @param player
 * @param duration Accept ms, 1000ms = 1 second, Input -1 to set mute to permanent
 */
export function mute (player: Player, duration: number) {
    if (player.hasTag("punishmentResistance") && player.safeIsOp()) return;
    player.setDynamicProperty("isMuted", duration == -1 ? -1 : Date.now() + duration);
    try {
        player.runCommand(`ability @s mute true`);
        return true;
    } catch {
        return false;
    }
}
export function unMute (player: Player) {
    player.setDynamicProperty("isMuted");
    player.runCommand(`ability @s mute false`);
}
export function freeze (player: Player, duration: number) {
    if (player.hasTag("punishmentResistance") && player.safeIsOp()) return;
    player.setDynamicProperty("isFrozen", duration == -1 ? -1 : Date.now() + duration);
    player.inputPermissions.movementEnabled = false;
    player.inputPermissions.cameraEnabled = false;
}
function onPlayerSpawn ({ player, initialSpawn }: PlayerSpawnAfterEvent) {
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
        const unBanRequest = world.scoreboard.getObjective("matrix:unBanRequest");
        const isUnBanned = !!unBanRequest?.getScore("::" + player.name);
        if (isUnBanned || player.getDynamicProperty("isSoftBanned") || (banStatus != -1 && Date.now() > banStatus)) {
            player.setDynamicProperty("isBanned");
            if (isUnBanned) {
                unBanRequest!.removeParticipant("::" + player.name);
            }
            const banRecord = world.scoreboard.getObjective(`matrix:banRecord`);
            if (banRecord && banRecord.getScore("::" + player.name)) {
                banRecord.removeParticipant("::" + player.name);
            }
        } else {
            kickForBan(player, banStatus);
        }
    }
    const muteStatus = player.getDynamicProperty("isMuted") as number;
    if (muteStatus) {
        if (muteStatus != -1 && Date.now() > muteStatus) {
            player.setDynamicProperty("isMuted");
            player.runCommand(`ability @s mute false`);
        } else {
            player.runCommand(`ability @s mute true`);
        }
    }
    const freezeStatus = player.getDynamicProperty("isFrozen") as number;
    if (freezeStatus) {
        if (freezeStatus != -1 && Date.now() > freezeStatus) {
            player.setDynamicProperty("isFrozen");
            player.inputPermissions.movementEnabled = true;
            player.inputPermissions.cameraEnabled = true;
        } else {
            player.inputPermissions.movementEnabled = false;
            player.inputPermissions.cameraEnabled = false;
        }
    }
}

function kickForBan (player: Player, banStatus: number) {
    if (player.hasTag("punishmentResistance") && player.safeIsOp()) return;
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