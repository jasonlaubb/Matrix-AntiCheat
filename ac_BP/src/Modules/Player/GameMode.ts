import { world, system, PlayerGameModeChangeBeforeEvent } from "@minecraft/server";
import { isAdmin } from "../../Assets/Util";
import { registerModule, configi } from "../Modules";
import flag from "../../Assets/flag";

/**
 * @author jasonlaubb
 * stop player from using the illegal gamemode without permisson
 */

async function AntiGameMode(config: configi, event: PlayerGameModeChangeBeforeEvent) {
    if (isAdmin(event.player)) return;

    if (config.antiGameMode.bannedGameMode.includes(gamemodes[String(event.toGameMode)])) {
        event.cancel = true;
        //A - false positive: never, efficiency: very high
        system.run(() => {
            if (!config.antiGameMode.bannedGameMode.includes(gamemodes[String(event.fromGameMode)])) {
                event.player.setGameMode(event.fromGameMode);
            } else {
                event.player.setGameMode();
            }
            flag(event.player, config.antiGameMode.modules, "A");
        });
    }
}

const gamemodes: { [key: string]: number } = {
    survival: 0,
    creative: 1,
    adventure: 2,
    spectator: 3,
};

registerModule("antiGameMode", false, [], {
    worldSignal: world.beforeEvents.playerGameModeChange,
    then: async (config, event) => {
        AntiGameMode(config, event);
    },
});
