import {
    world,
    Player,
    GameMode
} from "@minecraft/server"
import { ban } from "../Functions/moderateModel/banHandler";
import config from "../Data/Config";

export function kick (player: Player, reason?: string, by?: string) {
    player.runCommand(`kick "${player.name}" \n§2§l§¶Matrix >§4 ${player.name} §mYou have been kicked\n§fReason: §c${reason ?? 'No reason provided'}\n§fBy: §c${by ?? 'Unknown'}`)
}

function formatInformation (arr: string[]) {
    const formattedArr: string[] = arr.map(item => {
      const [key, value] = item.split(":");
      return `§l§¶${key}:§c ${value}`;
    });
    return formattedArr.join("\n");
}
export function flag (player: Player, modules: string, punishment?: string, infos?: string[]) {
    world.sendMessage(`§2§l§¶Matrix >§4 ${player.name}§m has been detected using ${modules}`);
    if (infos !== undefined) {
        world.sendMessage(`${formatInformation(infos)}`)
    }

    if (punishment !== undefined) {
        switch (punishment) {
            case "kick": {
                kick (player, config.punishment_kick.reason, 'Matrix')
                break
            }
            case "ban": {
                ban (player, config.punishment_ban.reason, "Matrix", Date.now() + (config.punishment_ban.minutes * 60000))
                break
            }
            default: {
                //nothing here :p
            }
        }
    }
}

export function msToTime (ms: number) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
}

export function isTargetGamemode (player: Player, gamemode: number) {
    const gamemodes: GameMode[] = [
        GameMode.survival,
        GameMode.creative,
        GameMode.adventure,
        GameMode.spectator
    ]

    return world.getPlayers({ name: player.name, gameMode: gamemodes[gamemode] }).length > 0
}

export function isAdmin (player: Player) {
    return !!player.getDynamicProperty("isAdmin")
}

export function timeToMs(timeStr: string) {
    const timeUnits = {
        d: 24 * 60 * 60 * 1000,
        h: 60 * 60 * 1000,
        m: 60 * 1000,
        s: 1000
    };

    let ms = 0;
    let match;

    for (const unit in timeUnits) {
        match = timeStr.match(new RegExp(`(\\d+)${unit}`));
        if (match) {
            //@ts-expect-error
            ms += parseInt(match[1]) * timeUnits[unit];
        }
    }

    return ms;
}

export function isTimeStr(timeStr: string) {
    const timeUnits = ['d', 'h', 'm', 's'];
    return timeUnits.some(unit => new RegExp(`\\d+${unit}`).test(timeStr));
}