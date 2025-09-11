import { Player, world, PlayerPermissionLevel, InputMode, PlatformType, system } from "@minecraft/server";
import { get } from "../util/database";
import { ban, checkPunish } from "../util/punishment";
import { text } from "../util/text";
export const messageTarget = ["any", "all", "operator", "admin", "exclude", "bypass", "tag"];
export const punishmentType = ["none", "tempkick", "kick", "ban"];
Player.prototype.isOp = function () {
    return this.commandPermissionLevel >= 1 || this.playerPermissionLevel === PlayerPermissionLevel.Operator;
};
Player.prototype.flag = function (id: string, type: string, category: string, data?: { [key: string]: string | number }) {
    const flagMessage = `§7[§aMatrix§7] §f${text("flagDetected", this.name + "§r")} §7<${category}> §c[${id}/${type}]${data ? ` §9(${Object.entries(data).map(([k, v]) => `${k}=${v}§r§9`)})` : ""}`;
    const flagType = get("flagMessageTarget");
    let flagTarget: Player[] = [];
    switch (flagType) {
        case "any":
        case "all": {
            flagTarget = world.getAllPlayers();
            break;
        }
        case "operator":
        case "admin": {
            flagTarget = world.getAllPlayers().filter((player) => player.isOp());
            break;
        }
        case "exclude":
        case "bypass": {
            flagTarget = world.getPlayers({
                excludeNames: [this.name],
            });
            break;
        }
        case "tag": {
            const notifyTag = get("notifyTag");
            flagTarget = world.getPlayers({ tags: [notifyTag] });
            break;
        }
    }
    if (flagTarget.length > 0) {
        flagTarget.forEach((player) => player.sendMessage(flagMessage));
    }
    const punishmentType = get("flagPunishmentType");
    world.setDynamicProperty("flagrecord:" + Date.now(), `§7[${new Date(Date.now()).toUTCString()}] §f${this.name} §r§8| §f${id}/${type} §8| §f${punishmentType}`);
    const record = world.getDynamicPropertyIds().filter((id) => id.startsWith("flagrecord:"));
    if (record.length > get("maxRecordAmount")) {
        const deleteId = record.sort()[0];
        world.setDynamicProperty(deleteId); // Delete the last record.
    }
    if (get("enablePunishmentIgnoreTag") && this.hasTag("matrix:ignore")) return;
    system.run(() => {
        const disconnectReason = get("specificReasonOnPunishment") ? `Unfair Advantage [${id}/${type}]` : "Unfair Advantage";
        switch (punishmentType) {
            case "kick": {
                this.kick(disconnectReason);
                break;
            }
            case "ban": {
                ban(this, disconnectReason, "Matrix AntiCheat", Date.now() + get("flagBanDuration"));
                checkPunish(this);
                break;
            }
            case "tempkick": {
                try {
                    this.triggerEvent("matrix:tempkick");
                } catch {
                    console.warn("Extension is not enabled, failed to tempkick");
                    this.kick(disconnectReason);
                }
            }
        }
    });
};
Player.prototype.kick = function (reason: string) {
    this.runCommand(`kick @s ${reason}`);
};
Player.prototype.isSafeDevice = function () {
    return this.inputInfo.lastInputModeUsed === InputMode.Gamepad && this.clientSystemInfo.platformType === PlatformType.Console;
};
// Intitalize some property for tick event
Player.prototype.killauraLastAttack = 0;
Player.prototype.killauraLastReset = 0;
Player.prototype.lastKnockback = 0;
Player.prototype.lastRiptide = 0;
Player.prototype.xpLastValid = 0;
