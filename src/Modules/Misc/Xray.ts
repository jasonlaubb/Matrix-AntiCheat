import { PlayerBreakBlockAfterEvent, world } from "@minecraft/server";
import { flag, isAdmin, isTargetGamemode } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";

function first(config: configi, { player, brokenBlockPermutation: { type: { id }, }, block: { location }, }: PlayerBreakBlockAfterEvent) {
    if (isAdmin(player) || isTargetGamemode(player, 1) || id == "minecraft:air" || player.hasTag("matrix:break-disabled")) return;
    if (config.antiXray.notifyAt.some((type) => id.endsWith(type))) {
        flag(player, "Xray", "A", 0, "none", ["Block" + ":" + id, "Break" + ":" + Object.values(location).join(" ")]);
    }
};

registerModule("antiXray", false, [], 
    {
        worldSignal: world.afterEvents.playerBreakBlock,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (config, event: PlayerBreakBlockAfterEvent) => {
            firstEvent(config, event as PlayerBreakBlockAfterEvent);
        },
    }
);
