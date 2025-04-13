import { Command } from "../../matrixAPI";
import { rawtext } from "../../util/rawtext";

new Command()
    .setName("unblink")
    .setMinPermissionLevel(0)
    .addIcon("gui/newgui/mob_effects/village_hero_effect")
    .setDescription(rawtext({ text: "Remove blink status" }))
    .onExecute(async (player) => {
        player.runCommand("tp @s @s");
        player.sendMessage("§7(Debug command) §aUnblink command has been executed. Make sure you have disabled your blink client.");
    })
    .register();
