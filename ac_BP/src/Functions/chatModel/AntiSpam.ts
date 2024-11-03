import { Player, system } from "@minecraft/server";
import ChatFilterData from "../../Data/ChatFilterData";
import { c, rawstr } from "../../Assets/Util";
import RegexBasedFilter from "../../Data/RegexBasedFilter";
import { Action } from "../../Assets/Action";
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
    $: "s",
};
interface SpamData {
    lastMessage?: string;
    messageRate: number[];
    lastMessageTime: number;
    playerWarn: number,
    dueToLastWarning: number,
}
const spamData = new Map<string, SpamData>();
export function intergradedAntiSpam(player: Player, message: string) {
    const playerSound = c().soundEffect;
    const config = c().intergradedAntiSpam;
    message = message.latinise().toLowerCase();
    if (config.chatFilter.enabled && chatFilter(player, message)) return true;
    if (config.linkEmailFilter.enabled && linkEmailFilter(player, message)) return true;

    if (config.spamFilter.enabled) {
        const now = Date.now();
        const data =
            spamData.get(player.id) ??
            ({
                messageRate: [],
                lastMessageTime: 0,
                playerWarn: 0,
                dueToLastWarning: 0,
            } as SpamData);

        let returnTrue = false;
        let isWarned = false;
        if (data.lastMessage && data.lastMessage == message && now - data.lastMessageTime < 20000) {
            system.run(() => {
                player.sendMessage(rawstr.new(true, "c").tra("spam.repeated").parse());
                if (playerSound) player.playSound("note.bass", { volume: 1.0 });
            });
            returnTrue = true;
        }

        const repeatedAmount = Math.max(...cauisitspam(message));

        if (message.length > 2 && repeatedAmount > config.spamFilter.maxRepeats) {
            system.run(() => {
                player.sendMessage(rawstr.new(true, "c").tra("spam.spamming").parse());
                if (playerSound) player.playSound("note.bass", { volume: 1.0 });
            });
            returnTrue = true;
        }

        if (message.length > config.spamFilter.maxLength) {
            system.run(() => {
                player.sendMessage(rawstr.new(true, "c").tra("spam.lengthlimit").parse());
                if (playerSound) player.playSound("note.bass", { volume: 1.0 });
            });
            returnTrue = true;
        }

        data.messageRate.push(Date.now());
        data.messageRate = data.messageRate.filter((x) => Date.now() - x < 5000) as number[];

        system.run(() => {
            console.log(JSON.stringify(data));
        });

        const messageRate = data.messageRate.length;
        if (messageRate > config.spamFilter.maxMessagesInFiveSeconds) {
            spamData.set(player.id, data);
            system.run(() => {
                player.sendMessage(rawstr.new(true, "c").tra("spam.messagerate").parse());
                if (playerSound) player.playSound("note.bass", { volume: 1.0 });
            });
            returnTrue = true;
        }
        if (isWarned) {
            if (now - data.dueToLastWarning > 45000) {
                data.dueToLastWarning = Date.now();
                data.playerWarn = 1;
            } else {
                data.playerWarn += 1;
                if (data.playerWarn > 4) {
                    system.run(() => {
                        Action.tempkick(player);
                    });
                    returnTrue = true;
                }
            }
        }
        data.lastMessage = message;
        data.lastMessageTime = now;
        spamData.set(player.id, data);
        if (returnTrue) return true;
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
const latinBased = ChatFilterData.filter((x) => !x.includes("-"));
const latinWithWhiteSpace = ChatFilterData.filter((x) => x.includes("-"));
const regexBased = RegexBasedFilter;
function chatFilter(player: Player, message: string) {
    const playerSound = c().soundEffect;
    let msg = message;
    Object.entries(special_characters).forEach(([key, value]) => {
        msg = msg.replaceAll(key, value);
    });
    if (msg.match(/(f+u+c+k+)|(s+h+i+t+)/gi)) {
        system.run(() => {
            player.sendMessage(rawstr.new(true, "c").tra("spam.sensitiveword").parse());
            if (playerSound) player.playSound("note.bass", { volume: 1.0 });
        });
        return true;
    }
    const matchRegex = /([a-zA-Z]+)/g;
    if (msg.match(matchRegex)?.some((x) => latinBased.some((y) => y == x))) {
        system.run(() => {
            player.sendMessage(rawstr.new(true, "c").tra("spam.sensitiveword").parse());
            if (playerSound) player.playSound("note.bass", { volume: 1.0 });
        });
        return true;
    }
    if (latinWithWhiteSpace.includes(msg.replace(/\s+/g, "-"))) {
        system.run(() => {
            player.sendMessage(rawstr.new(true, "c").tra("spam.sensitiveword").parse());
            if (playerSound) player.playSound("note.bass", { volume: 1.0 });
        });
        return true;
    }
    const plaintext = message.replace(
        /[\-!@#$%^&*(){}\[\]|\\;:"'?.,\s0-9a-zA-Z\u3002\uFF1F\uFF01\u3010\u3011\uFF0C\u3001\uFF1B\uFF1A\u300C\u300D\u300E\u300F\u2019\u201C\u201D\u2018\uFF08\uFF09\u3014\u3015\u2026\u2013\uFF0E\u2014\u300A\u300B\u3008\u3009]/g,
        ""
    );
    if (plaintext.length > 0 && regexBased.some((x) => plaintext.includes(x))) {
        system.run(() => {
            player.sendMessage(rawstr.new(true, "c").tra("spam.sensitiveword").parse());
            if (playerSound) player.playSound("note.bass", { volume: 1.0 });
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
