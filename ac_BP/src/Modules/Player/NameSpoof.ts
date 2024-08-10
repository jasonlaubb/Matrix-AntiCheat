import { world, Player, PlayerSpawnAfterEvent, system } from "@minecraft/server";
import { flag } from "../../Assets/Util";
import { registerModule, configi } from "../Modules";
import { Action } from "../../Assets/Action";

/**
 * @author jasonlaubb
 * @description This check can detect players with illegal names
 * It basically checks if the player name contains any non-ASCII characters or invalid length
 */

async function AntiNameSpoof(config: configi, player: Player, playerName: string) {
    //check if the player name is too long or too short
    const matches = playerName.match(/\([1-9]|[1-3][0-9]|40\)/g);
    const absName = matches ? playerName.replace(matches[0], "") : playerName;
    if (absName?.length < 3 || absName?.length > 16) {
        flag(player, "NameSpoof", "A", 0, config.antiNameSpoof.punishment, ["Type" + ":" + "illegalLength", "Length" + ":" + playerName.length]);
        system.runTimeout(() => {
            try {
                Action.tempkick(player);
            } catch {}
        }, 5);
        return;
    }

    //get the non-ASCII characters in player name
    const nonASCII = playerName?.match(/[^\x00-\x7F]/g);

    //if the player name contains non-ASCII characters, check if the non-ASCII characters are illegal
    if (nonASCII && nonASCII.length > 0) {
        let illegalName = false;

        //check for each non-ASCII characters
        for (let i = 0; i < nonASCII.length; i++) {
            const regax = nonASCII[i];

            //if the word isn't a valid character for player name
            if (!/[\u4E00-\u9FFF\uAC00-\uD7AF\u3040-\u30FF]|[^\d_]|[().&*]/.test(regax)) {
                illegalName = true;
                break;
            }
        }

        //if the player name is illegal, flag the player
        if (illegalName === true) {
            flag(player, "NameSpoof", "B", 0, config.antiNameSpoof.punishment, ["Type" + ":" + "illegalRegax"]);
            system.runTimeout(() => {
                try {
                    Action.tempkick(player);
                } catch {}
            }, 5);
            return;
        }
    }

    if (playerName.includes("§") || playerName.includes(`'`) || playerName.includes(`"`)) {
        flag(player, "NameSpoof", "C", 0, config.antiNameSpoof.punishment, ["Type" + ":" + "include special character"]);
        system.runTimeout(() => {
            try {
                Action.tempkick(player);
            } catch {}
        }, 5);
    }
}

registerModule("antiNameSpoof", false, [], {
    worldSignal: world.afterEvents.playerSpawn,
    then: async (config, event: PlayerSpawnAfterEvent) => {
        if (!event.initialSpawn) return;
        const player = event.player;
        AntiNameSpoof(config, player, player.name);
    },
},{
    onIntilize: async (config) => {
        const players = world.getAllPlayers();
        players.forEach((player) => AntiNameSpoof(config, player, player.name));
    },
    runAfterSubsribe: 20,
});