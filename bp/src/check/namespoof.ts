import { PlayerSpawnAfterEvent, world, system } from "@minecraft/server";
import { get } from "../util/database";
import { text } from "../util/text";
export default {
    property: "antiNamespoofEnable",
    enable: () => {
        world.afterEvents.playerSpawn.subscribe(onPlayerJoin);
    },
    disable: () => {
        world.afterEvents.playerSpawn.unsubscribe(onPlayerJoin);
    },
};
function onPlayerJoin({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || player.isOp()) return;
    const name = player.name;
    let flagged = false;
    if (name.length > 16 || name.length < 3) {
        player.flag("Namespoof", "A", "Misc", { name });
        flagged = true;
    } else if (get("antiNamespoofASCIIOnly")) {
        if (!/^[a-zA-Z0-9_ ]+$/.test(name)) {
            player.flag("Namespoof", "B", "Misc", { name });
            flagged = true;
        }
    } else if (/[!@#\$%\^&\*\(\)\{\}:;"'<>\?\/\\,\.\-=\+`~\uFF01-\uFF5E]/.test(name)) {
        player.flag("Namespoof", "C", "Misc", { name });
        flagged = true;
    }
    if (flagged && !["kick", "ban"].includes(get("flagPunishmentType"))) {
        system.run(() => player.kick(text("antiNamespoofKickReason")));
    }
}
