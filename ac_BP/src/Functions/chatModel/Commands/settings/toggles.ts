import { c, rawstr } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { getModulesIds } from "../../../../Core/Modules.js";

registerCommand({
    name: "toggles",
    description: "Shows all toggles of modules",
    parent: false,
    maxArgs: 0,
    require: (player) => verifier(player, c().commands.toggles),
    executor: async (player, _args) => {
        const toggleList = await getModulesIds();
        const config = c() as { [key: string]: any };
        const allStatus = toggleList.map((id) => config[id].enabled);
        const message = new rawstr(true, "g").tra("toggles.title").str("\n").tra("toggles.text");
        allStatus.forEach((status, index) => {
            message.str("\n");
            const moduleGiven = toggleList[index];
            if (status === true) {
                message.tra("toggles.feide", moduleGiven);
            } else {
                message.tra("toggles.feidd", moduleGiven);
            }
        });
        sendRawText(player, message.parse());
    },
});
