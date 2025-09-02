import { system, world } from "@minecraft/server";
import type { Command } from "../main";
export default {
    name: "fakeleave",
    description: "Send a leave message of yourself (translated)",
    requireOp: true,
    optionalParameters: [
        {
            name: "isRealm",
            type: "boolean"
        },
        {
            name: "invisibility",
            type: "boolean"
        }
    ],
    execute: (player, [isRealm, invisibility]) => {
        world.sendMessage({ rawtext: [
            {
                text: "§e"
            },
            {
                translate: isRealm ? "multiplayer.player.left.realms" : "multiplayer.player.left",
                with: [player.name]
            }
        ] });
        if (invisibility) system.run(() => player.addEffect("invisibility", 20000000, { showParticles: false }));
        return { status: 0, message: "message sent!" };
    }
} as Command;