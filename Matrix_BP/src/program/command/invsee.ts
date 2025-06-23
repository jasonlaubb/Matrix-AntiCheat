import { CustomCommandParamType, Player, system } from "@minecraft/server";
import * as Inv from "../../assets/inventory";
import { fastText, rawtextTranslate } from "../../util/rawtext";
import type { cmd } from "../../assets/cmd";
Inv.initializeInventorySync();
export default {
    cc: {
        name: "m:invsee",
        description: "Allows you to see the inventory of another player.",
        permissionLevel: 2,
        mandatoryParameters: [
            {
                name: "target",
                type: CustomCommandParamType.PlayerSelector,
            }
        ]
    },
    cb(player, player2) {
        if (player2.length !== 1) {
            player.sendMessage(rawtextTranslate("command.playerSelector.invalid"));
            return { status: 1 };
        }
        system.run(() => {
            const target = player2[0] as Player;
                if (target.id === player.id) {
                    player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.invsee.self").build());
                }   
                if (!player.hasTag("riding")) Inv.projectPlayerInventory(target, player);
                player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.invsee.notice").build());
        });
        return { status: 0 };
    }
} as cmd;