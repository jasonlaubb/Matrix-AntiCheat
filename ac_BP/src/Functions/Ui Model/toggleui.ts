import { ActionFormData } from "@minecraft/server-ui";
import { Player } from "@minecraft/server";
import { getModulesIds } from "../../Modules/Modules";
import { c, rawstr } from "../../Assets/Util";
import { triggerCommand } from "../chatModel/CommandHandler";

/**
 * @author RamiGamerDev
 */
export async function moduleUI(player: Player) {
    const moduleForm = new ActionFormData();
    moduleForm.title(rawstr.drt("ui.toggle.moduleui"));
    const ids = await getModulesIds();
    const config = c() as { [key: string]: any };
    for (const moduleId of ids) {
        const state = config[moduleId]?.enabled;
        const buttontext = new rawstr()
            .str(`§8${moduleId} §8[§r`)
            .tra(state ? "ui.toggle.enabled" : "ui.toggle.disabled")
            .str("§r§8]§r");
        moduleForm.button(buttontext.parse());
    }
    moduleForm.show(player).then((data) => {
        if (data.canceled) return;
        const moduleData = ids[data.selection];
        if (moduleData) {
            toggleUI(player, moduleData);
        }
    });
}
async function toggleUI(player: Player, moduleData: string) {
    const config = c() as { [key: string]: any };
    let state = config[moduleData]?.enabled;
    state = state ? "§aEnabled" : "§cDisabled";
    const moduleForm = new ActionFormData();
    moduleForm.title(rawstr.drt("ui.toggle.moduleui"));
    moduleForm.body(rawstr.new().tra("ui.toggle.modulet", moduleData).str("\n").tra("ui.toggle.statust", state).parse());
    moduleForm.button(rawstr.drt("ui.toggle.enable"), "textures/ui/vanilla_tick");
    moduleForm.button(rawstr.drt("ui.toggle.disable"), "textures/ui/redX1");
    moduleForm.show(player).then((data) => {
        if (data.canceled) return;
        // use the command for the user.
        triggerCommand(player, `toggle ${moduleData} ${data.selection == 0 ? "enable" : "disable"}`);
    });
}
