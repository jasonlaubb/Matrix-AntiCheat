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
                .title(rawtextTranslate("ui.modpanel.sel.title"))
                .dropdown(rawtextTranslate("ui.modpamel.sel.here"), allPlayers)
                //@ts-expect-error
                .show(admin);
            if (res.canceled) return;
            playerName = res.formValues![0] as string;
        } else {
            playerName = player.name;
        }
        new ActionFormData()

    }
}
