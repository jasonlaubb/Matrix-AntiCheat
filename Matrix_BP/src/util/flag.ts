import { Player, world } from "@minecraft/server";
import { Module } from "../matrixAPI";
import { rawtextTranslate } from "./rawtext";
import { ban, freeze, mute, softBan, strengthenKick, tempKick } from "../program/system/moderation";
export function setupFlagFunction() {
    Player.prototype.flag = function (detected: Module) {
        const punishment = detected.modulePunishment;
        if (!punishment || this.isAdmin()) return;
        world.sendMessage(rawtextTranslate("util.flag.alert", this.name, detected.getToggleId()!, punishment));
        if (this.hasTag("matrix-debug:punishmentResistance")) return this.sendMessage("§7[You are immune to punishments!]");
        try {
        switch (punishment) {
            case "kick":
                strengthenKick(this);
                break;
            case "tempKick":
                tempKick(this);
                break;
            case "freeze":
                freeze(this, -1);
                break;
            case "mute":
                mute(this, -1);
                break;
            case "softBan":
                softBan(this, -1);
                break;
            case "ban":
                ban(this, Module.config.flag.banDuration);
                break;
        }} catch (error) {
            Module.sendError(error as Error);
            tempKick(this);
        }
    };
}