import { rawtextTranslate } from "./rawtext";
import { Player, world } from "@minecraft/server";
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
export class ModPanel {
    private constructor () {};
    public readonly open = async (admin: Player, player?: Player) => {
        let playerName = "";
        if (!player) {
            const allPlayers = world.getAllPlayers().map(({ name }) => name);
            const res = await new ModalFormData()
                .title(rawtextTranslate("ui.modpanel.title"))
                .dropdown(rawtextTranslate("ui.modpamel.sel.here"), allPlayers)
                //@ts-expect-error
                .show(admin);
            if (res.canceled) return;
            playerName = res.formValues![0] as string;
        } else {
            playerName = player.name;
        }
        const res = await new ActionFormData()
            .title(rawtextTranslate("ui.modpanel.title", playerName))
            .button(`§6MUTE\n§8Run '-mute ${playerName} 15'`)
            .button(`§cKICK\n§8Run '-kick ${playerName}'`)
            .button(`§4BAN\n§8Run '-ban ${playerName}'`)
            .button(`§1CRASH\n§8Run '-crash ${playerName}'`)
            //@ts-expect-error
            .show(admin);
        if (res.canceled) return;
        switch (res.selection) {
            case 0: {
                admin.runChatCommand(`mute ${playerName} 15`);
                break;
            }
            case 1: {
                admin.runChatCommand(`kick ${playerName}`);
                break;
            }
            case 2: {
                admin.runChatCommand(`ban ${playerName}`);
                break;
            }
            case 3: {
                admin.runChatCommand(`crash ${playerName}`);
                break;
            }
        }
    }
}
