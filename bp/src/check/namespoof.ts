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
    let name = player.name;
    if (get("antiNamespoofIgnoreRepeatedId") && name.endsWith(")")) {
        name = name.replace(/\(\d+\)$/, "");
    }
    let flagged = false;
    if (player.name.length > 16 || player.name.length < 3) {
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
