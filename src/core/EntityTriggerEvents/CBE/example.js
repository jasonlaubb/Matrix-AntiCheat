import { world, system } from "@minecraft/server";
import config from "../assets/config.js";

const spamData = new Map();
const previousMessage = new Map();

const checkSpam = (player, behavior) => {
    world.sendMessage(`§u§l§¶OAC > §4${player.name}§c has detected ${behavior}`);
    player.runCommandAsync(`kick "${player.name}" §u§l§¶OAC >§c You have been kicked for ${behavior}`);
};

function afterMessage({ message, sender: player }) {
    if (player.hasTag("admin")) {
        return;
    }

    const data = spamData.get(player.id) || { lastMessageTimes: [], warnings: 0 };

    if (player.hasTag('one') && !player.getEffect("mining_fatigue")) checkSpam(player, "sending messages while swinging their hand");
    if (player.hasTag('two')) checkSpam(player, "sending messages while using an item");

    if (config.blacklistedMessages.some((word) => message.includes(word))) {
        player.runCommandAsync(`kick "${player.name}" §u§l§¶OAC >§c You have been kicked for saying ${message} a blacklisted message`);
        world.sendMessage(`§u§l§¶OAC > §4${player.name}§c has been kicked for saying ${message} a blacklisted message`);
        return;
    }

    const currentTime = Date.now();
    data.lastMessageTimes.push(currentTime);

    if (data.lastMessageTimes.length > config.antiSpam.maxMessagesPerSecond) {
        data.lastMessageTimes.shift();
    }

    if (data.lastMessageTimes.length >= config.antiSpam.maxMessagesPerSecond &&
        data.lastMessageTimes[data.lastMessageTimes.length - 1] - data.lastMessageTimes[0] < config.antiSpam.timer) {
        antiSpam(player, data, player.id);
    }

    spamData.set(player.id, data);
}

const antiSpam = (player, data) => {
    data.warnings++;

    if (data.warnings <= config.antiSpam.kickThreshold) {
        player.sendMessage(`§u§l§¶OAC >§c Please send messages slowly\n§8Warning ${data.warnings} out of ${config.antiSpam.kickThreshold}`);
    }

    system.runTimeout(() => {
        data.warnings = 0;
        spamData.set(player.id, data);
    }, config.antiSpam.timeout);

    if (data.warnings > config.antiSpam.kickThreshold) {
        player.runCommandAsync(`kick "${player.name}" §u§l§¶OAC >§c You have been kicked for spamming`);
        world.sendMessage(`§4§l§¶${player.name}§c has been kicked for spamming`);
    }
};

function beforeMessage(data) {
    if (world.scoreboard.getObjective("oac:muteList").getParticipants().find(p => p.displayName === player.name) || data.sender.hasTag("admin")) {
        return;
    }

    const { message: message, sender: player } = data;

    if (previousMessage.has(player.id) && previousMessage.get(player.id) === message) {
        data.cancel = true;
        player.sendMessage('§u§l§¶OAC >§c You cannot send the same message again');
    } else {
        previousMessage.set(player.id, message);
    }

    if (message.length > config.antiSpam.maxCharacterLimit) {
        data.cancel = true;
        player.sendMessage(`§u§l§¶OAC >§c Your message is too long\n§8The maximum length is ${config.antiSpam.maxCharacterLimit} characters`);
    } else if (config.chatFilter.some((word) => message.toLowerCase().includes(word))) {
        data.cancel = true;
        player.sendMessage(`§u§l§¶OAC >§c Your message contains a filtered word`);
    }
}

export function Spam() {
    if (world.scoreboard.getObjective('oac:anti-spam-enabled')) {
        world.afterEvents.chatSend.subscribe(afterMessage);
        world.beforeEvents.chatSend.subscribe(beforeMessage);
        world.afterEvents.playerLeave.subscribe(onPlayerLeave);
    } else {
        world.afterEvents.chatSend.unsubscribe(afterMessage);
        world.beforeEvents.chatSend.unsubscribe(beforeMessage);
        world.afterEvents.playerLeave.unsubscribe(onPlayerLeave);
    }
};

function onPlayerLeave(id) {
    spamData.delete(id);
    previousMessage.delete(id);
}