import { world, system, PlayerGameModeChangeBeforeEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb
 * stop player from using the illegal gamemode without permisson
 */

async function AntiGameMode (event: PlayerGameModeChangeBeforeEvent) {
    const config = c()
    if (isAdmin(event.player)) return

    if (config.antiGameMode.bannedGameMode.includes(gamemodes[String(event.toGameMode)])) {
        event.cancel = true;
        //A - false positive: never, efficiency: very high
        system.run(() => {
            flag (event.player, "GameMode", "A", config.antiGameMode.maxVL, config.antiGameMode.punishment, [lang(">GameMode") + ":" + String(event.toGameMode)])
        })
    }
}

const gamemodes: { [key: string]: number } = {
    "survival": 0,
    "creative": 1,
    "adventure": 2,
    "spectator": 3,
}

export default {
    enable () {
        world.beforeEvents.playerGameModeChange.subscribe(AntiGameMode) 
    },
    disable () {
        world.beforeEvents.playerGameModeChange.unsubscribe(AntiGameMode) 
    }
}
