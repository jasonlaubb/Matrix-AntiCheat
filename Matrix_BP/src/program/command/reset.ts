import { Command } from "../../matrixAPI";
import { rawtext } from "../../util/rawtext";

new Command()
    .setName("reset")
    .setDescription(rawtext({ text: "Reset Matrix AntiCheat." }))
    .setMinPermissionLevel(4)
    .onExecute(async (player) => {
        player.sendMessage("<matrix-debug> Reset finished. This action is irreversible.");
    })
    .register();
