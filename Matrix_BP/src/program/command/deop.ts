import { Command } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";

new Command()
    .setName("deop")
    .setAliases("deadmin", "deleteadmin", "deleteop")
    .setMinPermissionLevel(1)
    .setDescription(rawtextTranslate("command.deop.description"))
    .onExecute(async (player) => {
        player.setPermissionLevel(0);
        player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.deop.success").build());
    })
    .register();
