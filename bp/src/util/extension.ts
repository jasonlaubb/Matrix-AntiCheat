import { Player, world, PlayerPermissionLevel, InputMode, PlatformType, system } from "@minecraft/server";
import { get } from "../util/database";
import { ban, checkPunish } from "../util/punishment";
import { text } from "../util/text";
import { sendAlert } from "./util";
export const messageTarget = ["any", "all", "operator", "admin", "exclude", "bypass", "tag"];
export const punishmentType = ["none", "kick", "ban", "tempkick"];
Player.prototype.isOp = function () {
    return this.commandPermissionLevel >= 1 || this.playerPermissionLevel === PlayerPermissionLevel.Operator;
};
Player.prototype.flag = function (id: string, type: string, category: string, data?: { [key: string]: string | number }) {
    const flagMessage = `§7[§aMatrix§7] §f${text("flagDetected", this.name + "§r")} §7<${category}> §c[${id}/${type}]${data && !get("shortenFlagMessage") ? ` §9(${Object.entries(data).map(([k, v]) => `${k}=${v}§r§9`)})` : ""}`;
    sendAlert(flagMessage, this);
    const punishmentType = get("flagPunishmentType");
    world.setDynamicProperty("flagrecord:" + Date.now(), `§7[${new Date(Date.now()).toUTCString()}] §f${this.name} §r§8| §f${id}/${type} §8| §f${punishmentType}`);
    const record = world.getDynamicPropertyIds().filter((id) => id.startsWith("flagrecord:"));
    if (record.length > get("maxRecordAmount")) {
        const deleteId = record.sort()[0];
        world.setDynamicProperty(deleteId); // Delete the last record.
    }
    if (get("enablePunishmentIgnoreTag") && this.hasTag("matrix:ignore")) return;
    system.run(() => {
        const disconnectReason = get("specificReasonOnPunishment") ? `${text("flagUnfairAdvantage")} [${id}/${type}]` : text("flagUnfairAdvantage");
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
                    console.warn("prototype (flag) :: Extension is not enabled, failed to tempkick");
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
Player.prototype.canBypass = function () {
    return this.isStaff();
};
Player.prototype.isStaff = function () {
    return this.isOp() || !!this.getDynamicProperty("staff"); // To reduce ram usage, we do not actually check everytime whether the role is exist
};
// Intitalize some property for tick event
Player.prototype.killauraLastAttack = 0;
Player.prototype.killauraLastReset = 0;
Player.prototype.lastKnockback = 0;
Player.prototype.lastRiptide = 0;
Player.prototype.xpLastValid = 0;
