import { CustomCommandParamType, Player, system } from "@minecraft/server";
import { fastText, rawtextTranslate } from "../../util/rawtext";
import type { cmd } from "../../assets/cmd";

function* clearPlayerEnderchest(player: Player): Generator<void, void, void> {
    for (let i = 0; i < 27; i++) {
        player.runCommand("replaceitem entity @s slot.enderchest " + i + " air");
        yield;
    }
}
export default {
    cc: {
        name: "m:echestwipe",
        description: "Wipes the ender chest of a player.",
        permissionLevel: 1,
        mandatoryParameters: [
            {
                name: "target",
                type: CustomCommandParamType.PlayerSelector,
            }
        ]
    },
    cb(player, target) {
        if (target.length !== 1) {
            system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.invalid")));
            return { status: 1 };
        }
        system.run(() => {
            system.runJob(clearPlayerEnderchest(target[0]));
            player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.echestwipe.success", target[0].name).build());
        });
        return { status: 0 };
    }
} as cmd;