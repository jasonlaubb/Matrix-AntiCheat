import { rawtextTranslate } from "./rawtext";
import { Player, world } from "@minecraft/server";
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
import { Module } from "../matrixAPI";
export class ModPanel {
    private constructor () {};
    public static readonly open = async (admin: Player, player?: Player) => {
        let playerName = "";
        if (!player) {
            const allPlayers = world.getAllPlayers().map(({ name }) => name);
            const res = await new ModalFormData()
                .title(rawtextTranslate("ui.modpanel.title"))
                .dropdown(rawtextTranslate("ui.modpamel.sel.here"), allPlayers)
                //@ts-expect-error
                .show(admin);
            if (res.canceled) return;
            playerName = allPlayers[res.formValues![0] as number] as string;
        } else {
            playerName = player.name;
        }
        const config = Module.config.modPanel;
        const res = await new ActionFormData()
            .title(rawtextTranslate("ui.modpanel.title", playerName))
            .button(rawtextTranslate("ui.modpanel.mute", playerName, config.muteMinutes.toString()))
            .button(rawtextTranslate("ui.modpanel.kick", playerName, config.kickReason))
            .button(rawtextTranslate("ui.modpanel.ban", playerName, config.banReason, config.banMinutes.toString()))
            .button(rawtextTranslate("ui.modpanel.crash", playerName))
            //@ts-expect-error
            .show(admin);
        if (res.canceled) return;
        switch (res.selection) {
            case 0: {
                admin.runChatCommand(`mute "${playerName}" ${config.muteMinutes}`);
                break;
            }
            case 1: {
                admin.runChatCommand(`kick "${playerName}" "${config.kickReason}"`);
                break;
            }
            case 2: {
                admin.runChatCommand(`ban "${playerName}" "${config.banReason}" ${config.banMinutes}`);
                break;
            }
            case 3: {
                admin.runChatCommand(`crash "${playerName}"`);  
                break;
            }
        }
    }
}
