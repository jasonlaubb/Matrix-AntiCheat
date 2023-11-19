import {
    world,
    system
} from "@minecraft/server";

import config from "../../Data/Config";
import { antiSpamModule } from "../../Modules/Misc/Spam";
import { inputCommand } from "./CommandSystem";
import { chatRank } from "./ChatRank";
import { adminChat } from "./AdminChat";
import lang from "../../Data/Languages/lang";

//@ts-ignore
world.beforeEvents.chatSend.subscribe((event) => {
    const prefix: string = (world.getDynamicProperty("prefix") ?? config.commands.prefix) as string

    const { message, sender: player } = event;
    
    if (message.startsWith(prefix)) {
        event.cancel = true
        inputCommand (player, message, prefix)
        return
    }

    if (player.getDynamicProperty("mute") === true) {
        event.cancel = true;
        system.run(() => player.sendMessage("§2§l§¶Matrix >§4 "+lang(".ChatHandler.muted")))
        return
    }

    if (adminChat(player, message)) {
        event.cancel = true;
        return
    }

    if (antiSpamModule(message, player) === true) {
        event.cancel = true;
        return
    }

    const chatRankToggle = (world.getDynamicProperty("chatRank") ?? config.chatRank.enabled) as boolean;
    
    if (chatRankToggle) {
        event.cancel = true;
        chatRank(player, message)
    }
})