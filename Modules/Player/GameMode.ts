import { world, GameMode, Player, system } from "@minecraft/server";
import config from "../../Data/Config";
import { flag, isAdmin } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

async function antiGameMode (player: Player) {
    const gamemode = Gamemode(player.name);

    if (config.antiGameMode.bannedGameMode.includes(gamemode)) {
        if (config.antiGameMode.returnDefault) {
            player.runCommand(`gamemode @s default`)
        } else {
            player.runCommand(`gamemode @s ${config.antiGameMode.returnGameMode}`)
        }
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

system.runInterval(() => {
    const toggle: boolean = Boolean(world.getDynamicProperty("antiGameMode")) ?? config.antiGameMode.enabled;
    if (toggle !== true) return;

    const players = world.getAllPlayers();
    for (const player of players) {
        if (isAdmin(player)) continue;

        antiGameMode(player)
    }
}, 20)