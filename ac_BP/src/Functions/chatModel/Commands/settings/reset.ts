import { registerCommand } from "../../CommandHandler";
import { initialize } from "../../../Config/dynamic_config";
import { world } from "@minecraft/server";
import { isAdmin, rawstr } from "../../../../Assets/Util";
registerCommand(
    {
        name: "reset",
        description: "Resets all settings",
        parent: false,
        maxArgs: 0,
        minArgs: 0,
        require: (player) => isAdmin(player),
        executor: async (player, _args) => {
            world.setDynamicProperty("config");
            initialize()
            player.sendMessage(new rawstr().str("§bMatrix §7>§g ").tra("reset.sucess").parse());
        }
    }
)