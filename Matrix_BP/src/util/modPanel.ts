import { rawtextTranslate } from "./util/rawtext";
import { world } from "@minecraft/server";
export class ModPanel {
    private constructor ();
    public readonly open = async (admin: Player, player?: Player) => {
        if (!player) {
            const allPlayers = world.getAllPlayers().map(({ n }) => n);
            const res = await new ModalFormData()
                .title(rawtextTranslate("ui.modpanel.sel.title"))
                .dropDown(rawtextTranslate("ui.modpamel.sel.here"), allPlayers)
                .show(admin);
            if (res.cancelled) return;
            player = allPlayers[res.formValues[0]];
        } else {
            player = player.name;
        }
        new ActionFormData()
        //unfinished
    }
}
