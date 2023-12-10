import { world, GameMode, Player, system } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

async function AntiGameMode (player: Player) {
    const config = c()
    const gamemode = Gamemode(player.name);

    if (config.antiGameMode.bannedGameMode.includes(gamemode)) {
        if (config.antiGameMode.returnDefault) {
            player.runCommand(`gamemode @s default`)
        } else {
            player.runCommand(`gamemode @s ${config.antiGameMode.returnGameMode}`)
        }
        //A - false positive: never, efficiency: very high
        flag (player, "GameMode", "A", config.antiGameMode.maxVL, config.antiGameMode.punishment, [lang(">GameMode") + ":" + String(gamemodes[gamemode])])
    }
}

const gamemodes = [
    GameMode.survival,
    GameMode.creative,
    GameMode.adventure,
    GameMode.spectator
]

function Gamemode (playerName: string) {
    for (let i = 0; i < 4; i++) {
        if (world.getPlayers({ gameMode: gamemodes[i], name: playerName })) return i
    }

    return 0
}

const antiGameMode = () => {
    const players = world.getAllPlayers();
    for (const player of players) {
        if (isAdmin(player)) continue;

        AntiGameMode(player)
    }
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiGameMode) 
    },
    disable () {
        system.clearRun(id)
    }
}
