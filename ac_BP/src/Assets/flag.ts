import { Player, RawText, system, world } from "@minecraft/server";
import { c, extraDisconnect, isAdmin, rawstr, Type } from "./Util";
import { Action } from "./Action";
import { MatrixUsedTags } from "../Data/EnumData";
import { sendErr } from "../Functions/chatModel/CommandHandler";
import { saveLog } from "../Functions/moderateModel/log";
interface Modules {
    id: string;
    configId: string;
    referencedFlags: number;
    maxFlags: number;
    instantPunishment: boolean;
    acceptTotal: boolean;
    flagValidationTime: number;
    bestPunishment: string;
    behaviorBased: boolean;
}
interface FlagData {
    sus: number;
    flagComponent: string[];
    configComponent: string[];
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
            configComponent: [],
            flagVL: {},
            lastValidTime: Date.now(),
        } as FlagData);
    if (Date.now() - data.lastValidTime > (modules.flagValidationTime == 0 ? config.autoPunishment.defaultFlagValidationTime : modules.flagValidationTime)) {
        flagData.delete(player.id); // Delete old data
        return;
    }
    if (modules.instantPunishment) {
        const flagMessage = getFlagMessage(player.name, "Flag Handler [Instant]", [modules.id], punishmentMaps[modules.bestPunishment]);
        sendResult(rawstr.drt("protection.highrisk", player.name));
        flagModeSelector(config.flagMode, player.name).forEach((target) => {
            target.sendMessage(flagMessage);
        });
        if (config.logsettings.logCheatPunishment) saveLog("AC-Instant", player.name, `${modules.id} ${type}`);
        applyPunishment(player, modules.bestPunishment);
        if (modules.bestPunishment != "none") extraDisconnect(player);
        flagData.delete(player.id);
        return;
    }
    if (modules.behaviorBased) {
        const flagMessage = getFlagMessage(player.name, "Flag Handler [Behavior]", [modules.id], punishmentMaps.tempkick);
        if (config.logsettings.logCheatPunishment) saveLog("AC-Behavior", player.name, `${modules.id} ${type}`);
        // Disconnect the player
        if (!config.antiCheatTestMode) {
            const badData = player.getDynamicProperty("badRecord");
            const badRecord = badData ? (JSON.parse(badData as string) as number[]) : [];
            badRecord.push(Date.now());
            const now = Date.now();
            const filtered = JSON.stringify(badRecord.filter((t) => now - t < config.autoPunishment.eachTimeValidt));
            player.setDynamicProperty("badRecord", filtered);
            if (filtered.length > config.autoPunishment.behaviorMax) {
                Action.ban(player, config.autoPunishment.ban.reason, "Matrix AntiCheat", config.autoPunishment.behaviorBanLengthMins * 60000);
                if (modules.bestPunishment != "none") extraDisconnect(player);
            } else
                flagEnded(config.flagMode, player, player.name, flagMessage, rawstr.drt("protection.behavior", player.name), "tempkick", config.autoPunishment.resultGobalize, false);
        }
        flagData.delete(player.id);
        return;
    }
    data.flagVL[modules.id] ??= 0;
    data.flagVL[modules.id]++;
    data.flagComponent.push(modules.id);
    data.configComponent.push(modules.configId);
    if (modules.acceptTotal) {
        data.sus += 1 / modules.referencedFlags;
        if (data.sus >= config.autoPunishment.maxSusValue) {
            const configOrder = Object.entries(getPercentageComponent(data.configComponent, data.flagComponent.length));
            configOrder.sort((a, b) => b[1] - a[1]);
            const maxPercentageConfig = configOrder[0][0];
            const suggestedPunishment = ((config as any)[maxPercentageConfig]?.modules as Modules)?.bestPunishment ?? "tempkick";
            const flagMessage = getFlagMessage(player.name, "Flag Handler [Total]", data.flagComponent, punishmentMaps[suggestedPunishment]);
            flagModeSelector(config.flagMode, player.name).forEach((target) => {
                target.sendMessage(flagMessage);
            });
            sendResult(rawstr.drt("protection.unfair", player.name));
            if (config.logsettings.logCheatPunishment) saveLog("AC-Total", player.name, `${maxPercentageConfig} (MAX)`);
            applyPunishment(player, suggestedPunishment);
            if (suggestedPunishment != "none") extraDisconnect(player);
            flagData.delete(player.id);
        }
    }
    flagData.set(player.id, data);
    if (data.flagVL[modules.id] > modules.maxFlags) {
        const flagMessage = getFlagMessage(player.name, "Flag Handler [Limit]", [modules.id], punishmentMaps[modules.bestPunishment]);
        flagModeSelector(config.flagMode, player.name).forEach((target) => {
            target.sendMessage(flagMessage);
        });
        sendResult(rawstr.drt("protection.unfair", player.name));
        if (config.logsettings.logCheatPunishment) saveLog("AC-Limit", player.name, `${modules.id} ${type}`);
            applyPunishment(player, modules.bestPunishment);
            if (modules.bestPunishment != "none") extraDisconnect(player);
        flagData.delete(player.id);
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
    if (c().antiCheatTestMode) return;
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
function sendResult(parse: RawText) {
    if (c().autoPunishment.resultGobalize) {
        world.sendMessage(parse);
    } else {
        world
            .getAllPlayers()
            .filter((player) => isAdmin(player))
            .forEach((player) => {
                player.sendMessage(parse);
            });
    }
}
function getFlagMessage(object: string, type: string, component: string[], slove: string): RawText {
    const totalAmount = component.length;
    const amountListing = getPercentageComponent(component, totalAmount);
    const uniqueTurner = [...new Set(component)];
    const string: string[] = [];
    uniqueTurner.forEach((item) => {
        string.push(`${item} (${amountListing[item].toFixed(2)}％)`);
    });
    return new rawstr().tra("object.detected").str("\n").tra("object.object", object).str("\n").tra("object.type", type).str("\n").tra("object.components", string.join(", ")).str("\n").tra("object.autosolve", slove).parse();
}

function getPercentageComponent(component: string[], total: number): { [key: string]: number } {
    const amountListing: { [key: string]: number } = {};
    component.forEach((item) => {
        amountListing[item] ??= 0;
        amountListing[item] += (1 / total) * 100;
    });
    return amountListing;
}
function playDetectedSound (target: Player[]) {
    try {
        target.forEach((player) => player.playSound("matrix.detected", { volume: 3 }));
    } catch (error) {
        sendErr(error as Error);
    }
}
async function flagEnded (flagMode: string, player: Player, playerName: string, flagMessage: RawText, commonFlag: RawText, suggestedPunishment: string, resultGobalize: boolean, pretendLeave: boolean) {
    flagModeSelector(flagMode, playerName).forEach((target) => {
        target.sendMessage(flagMessage);
    });
    // Player the custom detected sound (just avast detected sound track)
    if (c().autoPunishment.enableFlagSoundTrack) playDetectedSound(flagModeSelector(resultGobalize ? "all" : "admin", playerName));
    const delay = c().autoPunishment.disconnectDelayTicks;
    if (!pretendLeave) {
        sendResult(commonFlag);
    } else if (delay == 0) {
        world.sendMessage({ rawtext: [{text: "§e"}, { translate: "multiplayer.player.left", with: [playerName] }] });
    } else if (delay > 0) {
        system.runTimeout(() => {
            world.sendMessage({ rawtext: [{text: "§e"}, { translate: "multiplayer.player.left", with: [playerName] }] });
        }, delay)
    }
    try {
        if (delay > 0) {
            player.inputPermissions.movementEnabled = false;
            await system.waitTicks(delay)
            player.inputPermissions.movementEnabled = true;
        }
        applyPunishment(player, suggestedPunishment);
        if (suggestedPunishment != "none") extraDisconnect(player);
    } catch (error) {
        sendErr(error as Error);
    }
}