import { system, world } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
import type { Command } from "../main";
import { get } from "../util/database";
import { antiXrayOn } from "../asset/antiXray";
import { text } from "../util/text";
import english from "../data/languages/english";

export default {
    name: "antixray",
    requireOp: true,
    description: english.commandAntiXrayDescription,
    translationDef: {
        actionName: "commandAntiXray",
        description: "commandAntiXrayDescription",
    },
    execute: (player) => {
        if (get("antiXray")) {
            world.setDynamicProperty("database:antiXray", false);
            player.sendMessage("§7[§aMatrix§7] §f" + text("commandAntiXrayDisableSuccess"));
        } else {
            system.run(() => {
                new MessageFormData()
                    .title(text("commandAntiXrayAreYouSure"))
                    .body(text("commandAntiXrayInstruction"))
                    .button1("§4§l" + text("commandAntiXrayYes"))
                    .button2("§2§l" + text("commandAntiXrayNo"))
                    //@ts-expect-error
                    .show(player)
                    .then((res) => {
                        if (res.canceled || res.selection === 1) return;
                        if (get("banXrayHandler") && !get("antiXray")) system.run(() => antiXrayOn());
                        world.setDynamicProperties({
                            "database:antiXray": true,
                            "database:banXrayHandler": false,
                        });
                        player.sendMessage("§7[§aMatrix§7] §f" + text("commandAntiXraySuccess"));
                    });
            });
        }
        return { status: 0 };
    },
} as Command;
