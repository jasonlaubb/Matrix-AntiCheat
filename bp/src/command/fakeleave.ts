import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { text } from "../util/text";
import english from "../data/languages/english";
export default {
    name: "fakeleave",
    description: english.commandFakeLeaveDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandFakeLeave",
        description: "commandFakeLeaveDescription",
        optionalParam: ["commandFakeLeaveIsRealm", "commandFakeLeaveInvisibility"]
    },
    optionalParameters: [
        { name: "isRealm", type: "boolean" },
        { name: "invisibility", type: "boolean" },
    ],
    execute: (player, [isRealm, invisibility]) => {
        world.sendMessage({
            rawtext: [
                { text: "§e" },
                {
                    translate: isRealm ? "multiplayer.player.left.realms" : "multiplayer.player.left",
                    with: [player.name],
                },
            ],
        });

        if (invisibility) {
            system.run(() => player.addEffect("invisibility", 20000000, { showParticles: false }));
        }

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandFakeLeaveSuccess")
        };
    },
} as Command;
