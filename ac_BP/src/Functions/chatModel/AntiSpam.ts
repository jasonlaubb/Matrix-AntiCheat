import { Player, system } from "@minecraft/server";
import ChatFilterData from "../../Data/ChatFilterData";
import { c, rawstr } from "../../Assets/Util";
const special_characters = {
    "0": "o",
    "1": "i",
    "3": "e",
    "4": "a",
    "5": "s",
    "6": "g",
    "7": "t",
    "8": "b",
    "@": "a",
    "€": "e",
    "$": "s",
};
interface SpamData {
    lastMessage: string;
    messageRate: number[];
}
const spamData = new Map<string, SpamData>();
export function intergradedAntiSpam(player: Player, message: string) {
    const config = c().intergradedAntiSpam;
    message = message.latinise().toLowerCase();
    if (config.chatFilter.enabled && chatFilter(player, message)) return true;
    if (config.linkEmailFilter.enabled && linkEmailFilter(player, message)) return true;

    if (config.spamFilter.enabled) {
        const data = spamData.get(player.id) ?? {
            lastMessage: "",
            messageRate: [],
        };

        if (data.lastMessage == message) {
            system.run(() => player.sendMessage(rawstr.new(true, "c").tra("spam.repeated").parse()));
            return true;
        }

        const repeatedAmount = Math.max(...cauisitspam(message));

        if (message.length > 2 && repeatedAmount > config.spamFilter.maxRepeats) {
            system.run(() => player.sendMessage(rawstr.new(true, "c").tra("spam.spamming").parse()));
            return true;
        }

        if (message.length > config.spamFilter.maxLength) {
            system.run(() => player.sendMessage(rawstr.new(true, "c").tra("spam.lengthlimit").parse()));
            return true;
        }

        data.messageRate.push(Date.now());
        data.messageRate = data.messageRate.filter((x) => Date.now() - x > 5000);

        const messageRate = data.messageRate.length;
        if (messageRate > config.spamFilter.maxMessagesInFiveSeconds) {
            system.run(() => player.sendMessage(rawstr.new(true, "c").tra("spam.messagerate").parse()));
            return true;
        }

        data.lastMessage = message;

        spamData.set(player.id, data);
    }

    return false;
}

function* cauisitspam(message: string) {
    let amount = 0;
    for (let x = 1; x < message.length; x++) {
        if (message[x - 1] == message[x]) {
            amount++;
        } else {
            yield amount;
            amount = 0;
        }
    }
    if (amount != 0) yield amount;
}

/*
let ascendingorder = ChatFilterData;

for (let x = 0; x < ascendingorder.length; x++) {
    for (let y = 0; y < ascendingorder.length; y++) {
        if (ascendingorder[x] < ascendingorder[y]) {
            ascendingorder = reverseLoc(ascendingorder, x, y);
        }
    }
}

function reverseLoc (target: string[], index1: number, index2: number) {
    const newindex2 = target[index1]
    const newindex1 = target[index2]
    target[index1] = newindex1
    target[index2] = newindex2
    return target;
}*/

function chatFilter(player: Player, message: string) {
    let msg = message;
    Object.entries(special_characters).forEach(([key, value]) => {
        msg = msg.replaceAll(key, value);
    });
    if (ChatFilterData.some((x) => msg.includes(x))) {
        system.run(() => {
            player.sendMessage(rawstr.new(true, "c").tra("spam.sensitiveword").parse());
        });
        return true;
    }
    return false;
}
function linkEmailFilter(player: Player, message: string) {
    if (/((http:\/\/|https:\/\/|www\.|download\.)([a-z]+\.)+[a-z]{2,8}(\/[\S]+)*\/*)|discord(\.gg|\.com\/invite)\/[\S]{1,}/gi.test(message)) {
        system.run(() => {
            player.sendMessage(rawstr.new(true, "c").tra("spam.includelink").parse());
        });
        return true;
    }
    if (/[a-z0-9]+@([a-z0-9]+\.)+[a-z0-9]+/gi.test(message)) {
        system.run(() => {
            player.sendMessage(rawstr.new(true, "c").tra("spam.email").parse());
        });
        return true;
    }
    return false;
}
