import { world, Player, system, PlayerSpawnAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";

/**
 * @author jasonlaubb
 * @description This check can detect players with illegal names
 * It basically checks if the player name contains any non-ASCII characters or invalid length
 */

async function AntiNameSpoof(player: Player, playerName: string) {
    const config = c();

    //check if the player name is too long or too short
    const matches = playerName.match(/\([1-9]|[1-3][0-9]|40\)/g);
    const absName = matches[0] ? playerName.replace(matches[0], "") : playerName;
    if (absName?.length < 3 || absName?.length > 16) {
        flag(player, "NameSpoof", "A", 0, config.antiNameSpoof.punishment, ["Type" + ":" + "illegalLength", "Length" + ":" + playerName.length]);
        return;
    }

    //get the non-ASCII characters in player name
    const nonASCII = playerName?.match(/[^\x00-\x7F]/g);

    //if the player name contains non-ASCII characters, check if the non-ASCII characters are illegal
    if (nonASCII?.length > 0) {
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
        }
    }
}

const antiNameSpoof = ({ player }: PlayerSpawnAfterEvent) => {
    if (isAdmin(player)) return;
    system.run(() => AntiNameSpoof(player, player.name));
};

export default {
    enable() {
        world.afterEvents.playerSpawn.subscribe(antiNameSpoof);
    },
    disable() {
        world.afterEvents.playerSpawn.unsubscribe(antiNameSpoof);
    },
};
