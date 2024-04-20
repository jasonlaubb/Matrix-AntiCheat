import { PlayerBreakBlockAfterEvent, world } from "@minecraft/server";
import { c, flag, isAdmin, isTargetGamemode } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

const antiXray = ({
    player,
    brokenBlockPermutation: {
        type: { id },
    },
    block: { location },
}: PlayerBreakBlockAfterEvent) => {
    if (isAdmin(player) || isTargetGamemode(player, 1) || id == "minecraft:air" || player.hasTag("matrix:break-disabled")) return;
    const config = c();
    if (config.antiXray.notifyAt.some((type) => id.endsWith(type))) {
        flag(player, "Xray", "A", 0, "none", [lang(">Block") + ":" + id, lang(">Break") + ":" + Object.values(location).join(" ")]);
    }
};

export default {
    enable() {
        world.afterEvents.playerBreakBlock.subscribe(antiXray);
    },
    disable() {
        world.afterEvents.playerBreakBlock.unsubscribe(antiXray);
    },
};
