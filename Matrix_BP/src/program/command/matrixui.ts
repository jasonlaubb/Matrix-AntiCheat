import { Command } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import matrixUI from "../../assets/matrixui";

new Command()
    .setName("matrixui")
    .setAliases("ui", "openui", "uipanel", "panel", "openpanel")
    .addIcon("items/matrixui")
    .setTag(-1)
    .setMinPermissionLevel(1)
    .setDescription(rawtextTranslate("command.matrixui.description"))
    .onExecute(async (player) => {
        player.sendMessage(rawtextTranslate("ui.closechat"));
        matrixUI(player);
    })
    .register();
