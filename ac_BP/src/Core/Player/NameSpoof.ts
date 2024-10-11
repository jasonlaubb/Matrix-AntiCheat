import { world, Player, PlayerSpawnAfterEvent, system } from "@minecraft/server";
import { registerModule, configi } from "../Modules";
import { Action } from "../../Assets/Action";
import flag from "../../Assets/flag";
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
        flag(player, config.antiNameSpoof.modules, "A");
        system.runTimeout(() => {
            try {
                Action.tempkick(player);
            } catch {}
        }, 5);
        return;
    }

    //get the non-ASCII characters in player name
    const nonASCII = playerName?.match(/[^\x00-\x7F]/gu);

    //if the player name contains non-ASCII characters, check if the non-ASCII characters are illegal
    if (nonASCII && nonASCII.length > 0) {
        let illegalName = false;

        //check for each non-ASCII characters
        for (let i = 0; i < nonASCII.length; i++) {
            const regax = nonASCII[i];

            //if the word isn't a valid character for player name
            if (!/[\u4E00-\u9FFF\uAC00-\uD7AF\u3040-\u30FF]|[^\d_]|[().&*]/.test(regax) && !/[一-龠]|[ぁ-ゔ]|[ァ-ヴー]|[々〆〤ヶ]/u.test(regax)) {
                illegalName = true;
                break;
            }
        }

        //if the player name is illegal, flag the player
        if (illegalName === true) {
            flag(player, config.antiNameSpoof.modules, "B");
            system.runTimeout(() => {
                try {
                    Action.tempkick(player);
                } catch {}
            }, 5);
            return;
        }
    }

    if (playerName.includes("§") || playerName.includes(`'`) || playerName.includes(`"`)) {
        flag(player, config.antiNameSpoof.modules, "C");
        system.runTimeout(() => {
            try {
                Action.tempkick(player);
            } catch {}
        }, 5);
    }
}

registerModule(
    "antiNameSpoof",
    false,
    [],
    {
        worldSignal: world.afterEvents.playerSpawn,
        then: async (config, event: PlayerSpawnAfterEvent) => {
            if (!event.initialSpawn) return;
            const player = event.player;
            AntiNameSpoof(config, player, player.name);
        },
    },
    {
        onIntilize: async (config) => {
            const players = world.getAllPlayers();
            players.forEach((player) => AntiNameSpoof(config, player, player.name));
        },
        runAfterSubsribe: 20,
    }
);
