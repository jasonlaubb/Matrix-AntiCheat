import { system, world } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
import type { Command } from "../main";
import { get } from "../util/database";

export default {
    name: "antixray",
    requireOp: true,
    description: "Enable/disable anti xray",
    execute: (player) => {
        if (get("antiXray") === true) return { status: 1, message: "§7[§aMatrix§7] §fAnti xray is already enabled. To disable, run '/setboolean antiXray false'" };
        system.run(() => {
            new MessageFormData()
                .title("Are you sure?")
                .body(
                    "Please read these before enabling anti xray\n1. §bPlacement of piston §fand §bexplosion §fwill be §ccancelled §fin overworld and nether\n2. You §eshould not remove addon §fdirectly after enabling anti xray, this will cause ore distribution to be bugged.\n3. It might causes the server to §clag§f.\n4. You §ccannot fully reverse§f this action.\n5. Anti Xray only works on the ores below a Y value."
                )
                .button1("§4§lYes")
                .button2("§2§lNo")
                //@ts-expect-error
                .show(player)
                .then((res) => {
                    if (res.canceled || res.selection === 1) return;
                    world.setDynamicProperty("database:antiXray", true);
                    world.setDynamicProperty("database:banXrayHandler", false);
                    player.sendMessage(" §7[§aMatrix§7] §fEnabled Anti Xray. Use '/setboolean antiXray false' to disable");
                });
        });
        return { status: 0 };
    },
} as Command;
