import { registerCommand } from "../../CommandHandler";
import { initialize } from "../../../Config/dynamic_config";
import { world } from "@minecraft/server";
import { getPLevel, rawstr } from "../../../../Assets/Util";
import { commitChanges } from "../../../Config/config_database";
registerCommand({
    name: "reset",
    description: "Resets all settings",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => getPLevel(player) == 4,
    executor: async (player, _args) => {
        world.setDynamicProperty("config");
        initialize();
        commitChanges();
        player.sendMessage(new rawstr().str("§bMatrix §7>§g ").tra("reset.sucess").parse());
    },
});
