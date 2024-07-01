import { PlayerBreakBlockAfterEvent, world } from "@minecraft/server";
import { flag, isAdmin, isTargetGamemode, rawstr } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";

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
    if (isAdmin(player) || isTargetGamemode(player, 1) || id == "minecraft:air" || player.hasTag("matrix:break-disabled")) return;
    if (config.antiXray.notifyAt.some((type) => id.endsWith(type))) {
        flag(player, "Xray", "A", 0, "none", ["Block" + ":" + id, "Break" + ":" + Object.values(location).join(" ")]);
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
