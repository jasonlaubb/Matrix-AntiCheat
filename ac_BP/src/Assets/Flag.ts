import { Player, RawText, world } from "@minecraft/server";
import { c, isAdmin, rawstr, Type } from "./Util";
import { Action } from "./Action";
import { MatrixUsedTags } from "../Data/EnumData";
import { sendErr } from "../Functions/chatModel/CommandHandler";
import { saveLog } from "../Functions/moderateModel/log";
interface Modules {
    id: string;
    referencedFlags: number;
    maxFlags: number;
    instantPunishment: boolean;
    acceptTotal: boolean;
    flagValidationTime: number;
    bestPunishment: string;
}
interface FlagData {
    sus: number;
    flagComponent: string[];
    flagVL: { [key: string]: number };
    lastValidTime: number;
}
const flagData = new Map<string, FlagData>();
/**
 * @author jasonlaubb
 * @description Unique flag handler
 */
export default function (player: Player, modules: Modules, type: Type = "A") {
    if (!(player instanceof Player) || isAdmin(player)) return;
    const config = c();
    const data =
        flagData.get(player.id) ??
        ({
            sus: 0,
            flagComponent: [],
            flagVL: {},
            lastValidTime: Date.now(),
        } as FlagData);
    if (Date.now() - data.lastValidTime > (modules.flagValidationTime == 0 ? config.autoPunishment.defaultFlagValidationTime : modules.flagValidationTime)) {
        flagData.delete(player.id); // Delete old data
        return;
    }
    if (config.logsettings.logCheatFlag) saveLog("Flag", player.name, `${modules.id} ${type} (x${data.flagVL[modules.id] ?? 0})`);
    if (modules.instantPunishment) {
        const flagMessage = getFlagMessage(player.name, "Flag Handler [Instant]", [modules.id], punishmentMaps[modules.bestPunishment]);
        flagModeSelector(config.flagMode, player.name).forEach((target) => {
            target.sendMessage(flagMessage);
        });
        if (config.logsettings.logCheatPunishment) saveLog("Detected", player.name, `${modules.id} ${type}`);
        applyPunishment(player, modules.bestPunishment);
        return;
    }
    data.flagVL[modules.id] ??= 0;
    data.flagVL[modules.id]++;
    data.flagComponent.push(modules.id);
    if (modules.acceptTotal) {
        data.sus += 1 / modules.referencedFlags;
        if (data.sus >= config.autoPunishment.maxSusValue) {
            const moduleOrder = Object.entries(getPercentageComponent(data.flagComponent, modules.maxFlags));
            moduleOrder.sort((a, b) => b[1] - a[1]);
            const maxPercentageModule = moduleOrder[0][0];
            const suggestedPunishment = ((config as any)[maxPercentageModule]?.modules as Modules)?.bestPunishment ?? "tempkick";
            const flagMessage = getFlagMessage(player.name, "Flag Handler [Total]", [modules.id], punishmentMaps[suggestedPunishment]);
            flagModeSelector(config.flagMode, player.name).forEach((target) => {
                target.sendMessage(flagMessage);
            });
            if (config.logsettings.logCheatPunishment) saveLog("Detected", player.name, `${modules.id} ${type}`);
            applyPunishment(player, suggestedPunishment);
        }
    }
    flagData.set(player.id, data);
    if (data.flagVL[modules.id] > modules.maxFlags) {
        const flagMessage = getFlagMessage(player.name, "Flag Handler [Limit]", [modules.id], punishmentMaps[modules.bestPunishment]);
        flagModeSelector(config.flagMode, player.name).forEach((target) => {
            target.sendMessage(flagMessage);
        });
        if (config.logsettings.logCheatPunishment) saveLog("Detected", player.name, `${modules.id} ${type}`);
        applyPunishment(player, modules.bestPunishment);
    }
}

function flagModeSelector(flagMode: string, playerName: string): Player[] {
    switch (flagMode) {
        case "none": {
            return [];
        }
        case "admin": {
            return world.getAllPlayers().filter((player) => isAdmin(player));
        }
        case "all": {
            return world.getAllPlayers();
        }
        case "tag": {
            return world.getPlayers({
                tags: [MatrixUsedTags.notify],
            });
        }
        case "bypass": {
            return world.getPlayers({
                excludeNames: [playerName],
            });
        }
        default: {
            sendErr(new Error("Flag :: Unknown flag mode :: " + flagMode));
            return [];
        }
    }
}
const punishmentMaps: { [key: string]: string } = {
    tempkick: "Kick [Temp]",
    kick: "Kick [Classic]",
    despawn: "Kick [Despawn]",
    tempban: "Ban [Temp]",
    ban: "Ban [Classic]",
};
function applyPunishment(player: Player, punishment: string) {
    // Only for local world testing...
    if (player.isOp()) return;
    const config = c();
    switch (punishment) {
        case "tempkick": {
            Action.tempkick(player);
            break;
        }
        case "kick": {
            Action.kick(player);
            break;
        }
        case "despawn": {
            Action.despawn(player);
            break;
        }
        case "tempban": {
            Action.tempban(player);
            break;
        }
        case "ban": {
            Action.ban(player, config.autoPunishment.ban.reason, "Matrix AntiCheat", config.autoPunishment.ban.minutes);
            break;
        }
    }
}
function getFlagMessage(object: string, type: string, component: string[], slove: string): RawText {
    const totalAmount = component.length;
    const amountListing = getPercentageComponent(component, totalAmount);
    const uniqueTurner = [...new Set(component)];
    const string = [];
    uniqueTurner.forEach((item) => {
        string.push(`${item} (${amountListing[item].toFixed(2)}%)`);
    });
    return new rawstr()
    .tra("object.detected")
    .str("\n")
    .tra("object.object", object)
    .str("\n")
    .tra("object.type", type)
    .str("\n")
    .tra("object.components", uniqueTurner.join(","))
    .str("\n")
    .tra("object.autosolve", slove)
    .parse();
}

function getPercentageComponent(component: string[], total: number): { [key: string]: number } {
    const amountListing: { [key: string]: number } = {};
    component.forEach((item) => {
        amountListing[item] ??= 0;
        amountListing[item] += (1 / total) * 100;
    });
    return amountListing;
}
