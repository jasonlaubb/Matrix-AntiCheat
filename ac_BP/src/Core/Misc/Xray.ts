import { PlayerBreakBlockAfterEvent, world } from "@minecraft/server";
import { isAdmin, isTargetGamemode, rawstr } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";
import { DisableTags } from "../../Data/EnumData";

function firstEvent(
    config: configi,
    {
        player,
        brokenBlockPermutation: {
            type: { id },
        },
        block: { location },
    }: PlayerBreakBlockAfterEvent
) {
    if (isAdmin(player) || isTargetGamemode(player, 1) || id == "minecraft:air" || player.hasTag(DisableTags.break)) return;
    if (config.antiXray.notifyAt.some((type) => id.endsWith(type))) {
        const admins = world.getPlayers();
        const rawmessage = new rawstr(true, "c").tra("xray.broken", player.name, id, Object.values(location).join(" ")).parse();
        admins
            .filter((p) => isAdmin(p))
            .forEach((p) => {
                p.sendMessage(rawmessage);
            });
    }
}

registerModule("antiXray", false, [], {
    worldSignal: world.afterEvents.playerBreakBlock,
    then: async (config, event: PlayerBreakBlockAfterEvent) => {
        firstEvent(config, event as PlayerBreakBlockAfterEvent);
    },
});
