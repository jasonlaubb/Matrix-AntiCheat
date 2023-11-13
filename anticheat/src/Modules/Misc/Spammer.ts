import {
    world,
    system,
    Player,
    ChatSendBeforeEvent
} from "@minecraft/server";
import config from "../../Data/Config.js";
import { flag, isAdmin, kick } from "../../Assets/Util.js";

export { antiSpamModule };

/**
 * @author ravriv
 * @description This is a simple spammer detector. It stops both player spamming and spammer clients
 */

class Data {
    warnings: number;
    lastMessageTimes: number[];
};

const previousMessage: Map<string, string> = new Map<string, string>();
const spamData: Map<string, Data> = new Map<string, Data>();

function checkSpam (player: Player, behavior: string) {
    system.run(() => flag (player, "Spammer", config.antiSpam.punishment, [`behavior:${behavior}`]));
};

async function antiSpam (player: Player, data: Data) {
    data.warnings++;

    if (data.warnings <= config.antiSpam.kickThreshold) {
        player.sendMessage(`§2§l§¶Matrix >§m Please send messages slowly\n§8§l§¶Warning ${data.warnings} out of ${config.antiSpam.kickThreshold}`);
    }

    system.runTimeout(() => {
        data.warnings = 0;
        spamData.set(player.id, data);
    }, config.antiSpam.timeout);

    if (data.warnings > config.antiSpam.kickThreshold) {
        system.run(() => kick (player, 'spamming', 'Matrix'))
        world.sendMessage(`§2§l§¶Matrix >§4 ${player.name}§m has been kicked for spamming`);
    }
};

function antiSpamModule (message: string, player: Player) {
    const toggle: boolean = (world.getDynamicProperty("antiSpam") ?? config.antiSpam.enabled) as boolean;
    if (toggle !== true || isAdmin (player)) return false;

    let isSpamming = false;

    if (previousMessage.has(player.id) && previousMessage.get(player.id) === message) {
        isSpamming = true;
        system.run(() => player.sendMessage('§2§l§¶Matrix >§m You cannot send the same message again'));
    } else {
        previousMessage.set(player.id, message);
    }

    if (message.length > config.antiSpam.maxCharacterLimit) {
        isSpamming = true;
        player.sendMessage(`§2§2§l§¶Matrix >§m Your message is too long\n§r§l§¶§8The maximum length is ${config.antiSpam.maxCharacterLimit} characters`);
    } else if (config.chatFilter.some((word) => message.toLowerCase().includes(word))) {
        isSpamming = true;
        system.run(() => player.sendMessage(`§2§l§¶Matrix >§m Your message contains a filtered word`));
    }

    return isSpamming;
};

async function AntiSpam (event: ChatSendBeforeEvent, player: Player, message: string) {
    if (config.blacklistedMessages.some((word) => message.includes(word))) {
        event.cancel = true;
        //@ts-expect-error
        let warningTime: number = player.blacklistMsgWarn ?? 0;
        warningTime++
        //@ts-expect-error
        player.blacklistMsgWarn = warningTime;
        if (warningTime < 2) {
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Blacklisted message, warning (${warningTime}/2)`));
            return;
        }
        system.run(() => {
          kick(player, 'blacklisted message', 'Matrix')
          world.sendMessage(`§2§l§¶Matrix >§4 ${player.name}§m has been kicked for saying ${message} a blacklisted message`);
        })
        return;
    } else {
        //@ts-expect-error
        player.blacklistMsgWarn = 0;
    }
    system.run(() => {
        const data: Data = spamData.get(player.id) || {
            lastMessageTimes: [],
            warnings: 0
        } as Data;

        if (player.hasTag('matrix:attack_time') && !player.getEffect("mining_fatigue")) checkSpam(player, "sending messages while swinging their hand");
        if (player.hasTag('matrix:using_item')) checkSpam(player, "sending messages while using an item");

        const currentTime: number = Date.now();
        data.lastMessageTimes.push(currentTime);

        if (data.lastMessageTimes.length > config.antiSpam.maxMessagesPerSecond) {
            data.lastMessageTimes.shift();
        }

        if (data.lastMessageTimes.length >= config.antiSpam.maxMessagesPerSecond &&
            data.lastMessageTimes[data.lastMessageTimes.length - 1] - data.lastMessageTimes[0] < config.antiSpam.timer) {
            antiSpam(player, data);
        }

        spamData.set(player.id, data);
    })
}

world.beforeEvents.chatSend.subscribe(event => {
    const { sender: player, message } = event;

    const toggle: boolean = (world.getDynamicProperty("antiSpam") ?? config.antiSpam.enabled) as boolean;
    if (toggle !== true || isAdmin (player)) return;

    AntiSpam (event, player, message)
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    spamData.delete(playerId);
    previousMessage.delete(playerId);
})