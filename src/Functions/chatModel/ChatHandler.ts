import { world, system } from "@minecraft/server";
import { antiSpamModule } from "../../Modules/Misc/Spam";
import { triggerCommand } from "./CommandHandler";
import { chatRank } from "./ChatRank";
import { adminChat } from "./AdminChat";
import lang from "../../Data/Languages/lang";
import { c } from "../../Assets/Util";

world.beforeEvents.chatSend.subscribe((event) => {
    // Defend the spam bot from sending the chat packets
    if (world.antiBotEnabled === true && !event.sender.verified) {
        event.cancel = true;
        return;
    }

    const { message, sender: player } = event;
    const config = c();

    if (message.startsWith(config.commands.prefix) || config.otherPrefix.some((otherP) => message.startsWith(otherP))) {
        triggerCommand(player, message);
        return;
    }

    if (player.getDynamicProperty("mute") === true) {
        event.cancel = true;
        system.run(() => player.sendMessage("§2§l§¶Matrix >§4 " + lang(".ChatHandler.muted")));
        return;
    }

    if (adminChat(player, message)) {
        event.cancel = true;
        return;
    }

    if (antiSpamModule(message, player) === true) {
        event.cancel = true;
        return;
    }

    const chatRankToggle = config.chatRank.enabled;

    if (chatRankToggle && !config.otherPrefix.some((otherP) => message.startsWith(otherP))) {
        event.cancel = true;
        chatRank(player, message);
    }
});
