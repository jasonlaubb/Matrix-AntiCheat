//@ts-nocheck
import { world, system, Player, PlayerLeaveAfterEvent } from "@minecraft/server";
import { c, rawstr } from "../../Assets/Util";
import { isAdmin, kick } from "../../Assets/Util.js";

export { antiSpamModule };

/**
 * @author ravriv
 * @description This is a simple spammer detector. It stops both player spamming and spammer clients
 */

interface Data {
    warnings: number;
    lastMessageTimes: number[];
}

const previousMessage: Map<string, string> = new Map<string, string>();
const spamData: Map<string, Data> = new Map<string, Data>();

function spammingWarner(player: Player, data: Data) {
    const config = c();
    data.warnings++;

    if (data.warnings <= config.antiSpam.kickThreshold) {
        player.sendMessage(rawstr.new(true, "c").tra("spam.slowdown").str(` §8(${data.warnings}/${config.antiSpam.kickThreshold})`).parse());
    }

    system.runTimeout(() => {
        data.warnings = 0;
        spamData.set(player.id, data);
    }, config.antiSpam.timeout);

    if (data.warnings > config.antiSpam.kickThreshold) {
        system.run(() => kick(player, "SPAMMING_MESSAGE", "Matric AntiCheat"));
        world.sendMessage(rawstr.new(true, "g").tra("spam.kicked", player.name).parse());
    }
}

import ChatFilterData from "../../Data/ChatFilterData";

function antiSpamModule(message: string, player: Player) {
    const config = c();

    const toggle: boolean = (world.getDynamicProperty("antiSpam") ?? config.antiSpam.enabled) as boolean;
    if (toggle !== true || isAdmin(player)) return false;

    let isSpamming = false;

    if (previousMessage.has(player.id) && previousMessage.get(player.id) === message) {
        system.run(() => player.sendMessage(rawstr.new().tra("spam.repeated").parse()));
        isSpamming = true;
    } else {
        previousMessage.set(player.id, message);
    }

    const lowerCase = message.toLowerCase();

    if (message.length > config.antiSpam.maxCharacterLimit) {
        player.sendMessage(rawstr.new().tra("spam.long").str(`§8(${message.length}/${config.antiSpam.maxCharacterLimit})`).parse());
        isSpamming = true;
        // WILL CHANGE IN THE FUTURE
    } else if (ChatFilterData.some((word) => lowerCase.includes(word))) {
        system.run(() => player.sendMessage(rawstr.new().tra("spam.filter").parse()));
        isSpamming = true;
    }

    // Check if the message contain a blacklisted word
    if (config.blacklistedMessages.some((word) => lowerCase.includes(word))) {
        // cancel the message
        isSpamming = true;

        // increase their warning
        let warningTime: number = player.blacklistMsgWarn ?? 0;
        warningTime++;
        player.blacklistMsgWarn = warningTime;

        // if warning time is smaller than 2, send a warning message else kick them
        if (warningTime < 5) {
            system.run(() => player.sendMessage(rawstr.new(true, "c").tra("spam.spamming").str(` §8(${warningTime}/4)`).parse()));
            isSpamming = true;
        } else
            system.run(() => {
                kick(player, "BLACKLISTED_MESSAGE", "Matrix AntiCheat");
                world.sendMessage(rawstr.new(true, "g").tra("spam.kickedblacklist", player.name).parse());
            });
        isSpamming = true;
    } else {
        player.blacklistMsgWarn = 0;
    }
    const data: Data =
        spamData.get(player.id) ||
        ({
            lastMessageTimes: [],
            warnings: 0,
        } as Data);

    //log the message time
    const currentTime: number = Date.now();
    data.lastMessageTimes.push(currentTime);

    //remove the message time if it's older than 1 second
    if (data.lastMessageTimes.length > config.antiSpam.maxMessagesPerSecond) {
        data.lastMessageTimes.shift();
    }

    //if the player send too many messages in 1 second, flag them
    if (data.lastMessageTimes.length >= config.antiSpam.maxMessagesPerSecond && data.lastMessageTimes[data.lastMessageTimes.length - 1] - data.lastMessageTimes[0] < config.antiSpam.timer) {
        system.run(() => spammingWarner(player, data));
        isSpamming = true;
    }

    //set the new spammer data
    spamData.set(player.id, data);

    return isSpamming;
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    spamData.delete(playerId);
    previousMessage.delete(playerId);
};

export default {
    enable() {
        world.afterEvents.playerLeave.subscribe(playerLeave);
    },
    disable() {
        world.afterEvents.playerLeave.unsubscribe(playerLeave);
        spamData.clear();
        previousMessage.clear();
    },
};
