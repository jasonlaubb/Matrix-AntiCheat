import {
    world,
    Player,
    GameMode,
    Vector3,
    Dimension,
    system
} from "@minecraft/server"
import { ban } from "../Functions/moderateModel/banHandler";
import config from "../Data/Config";
import { triggerEvent } from "../Functions/moderateModel/eventHandler";
import { MinecraftBlockTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../Data/Languages/lang";
import Config from "../Data/Config";
import { Root } from "../Data/ConfigDocs";

system.runInterval(() => {
    const players = world.getPlayers({ tags: ["matrix:knockback"]})
    for (const player of players) {
        const velocity = player.getVelocity().y
        if (velocity <= 0) player.removeTag("matrix:knockback")
    }
})

export function kick (player: Player, reason?: string, by?: string) {
    try {
        player.runCommand(`kick "${player.name}" "§r\n§c§l${lang(".Util.kicked")}§r\n§7${lang(".Util.reason")}: §e${reason ?? lang(".Util.noreason")}\n§7By: §e${by ?? lang(".Util.unknown")}"`)
    } catch {
        triggerEvent (player, "matrix:kick")
    }
}

export function formatInformation (arr: string[]) {
    const formattedArr: string[] = arr.map(item => {
      const [key, value, id] = item.split(":");
      return `§r§c» §7${key}:§9 ${value}${id == undefined ? '' : ':' + id}§r`;
    });
    return formattedArr.join("\n");
}

export function checkBlockAround (location: Vector3, blockType: MinecraftBlockTypes, dimension: Dimension): boolean {
    const floorPos: Vector3 = {
        x: Math.floor(location.x),
        y: Math.floor(location.y) - 1,
        z: Math.floor(location.z)
    } as Vector3

    let blocks: string[] = []

    for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
            blocks.push(dimension.getBlock({ x: floorPos.x + x, y: floorPos.y, z: floorPos.z + z } as Vector3)?.typeId)
        }
    }

    return new Set(blocks).has(blockType)
}

let Vl: any = {};

type Type = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I"

export function flag (player: Player, modules: string, type: Type, maxVL: number, punishment: string | undefined, infos: string[] | undefined) {
    Vl[player.id] ??= {}
    Vl[player.id][modules] ??= 0

    let vl = ++Vl[player.id][modules]
    if (vl > 999) vl = 99

    let flagMsg = `§bMatrix §7>§c ${player.name}§g ` + lang(".Util.has_failed") + ` §4${modules}§r §7[§c${lang(">Type")} ${type}§7] §7[§dx${vl}§7]§r`
    if (infos !== undefined) flagMsg = flagMsg + "\n" + formatInformation(infos)
    
    if (punishment && vl > maxVL) {
        let punishmentDone = false
        switch (punishment) {
            case "kick": {
                punishmentDone = true
                kick (player, config.punishment_kick.reason, 'Matrix')
                flagMsg += "\n§bMatrix §7>§g " + lang(".Util.formkick").replace("%a", player.name)
                break
            }
            case "ban": {
                punishmentDone = true
                ban (player, config.punishment_ban.reason, "Matrix", config.punishment_ban.minutes as number | "forever" === "forever" ? "forever" : Date.now() + (config.punishment_ban.minutes * 60000))
                flagMsg += "\n§bMatrix §7>§g " + lang(".Util.formban").replace("%a", player.name)
                break
            }
            default: {
                break
            }
        }
        if (punishmentDone) {
            Vl[player.id][modules] = 0
        }
    }

    const flagMode = world.getDynamicProperty("flagMode") ?? config.flagMode
    switch (flagMode) {
        case "tag": {
            const targets = world.getPlayers({ tags: ["matrix:notify"]})
            targets.forEach(players => players.sendMessage(flagMsg))
            break
        }
        case "bypass": {
            const targets = world.getPlayers({ excludeNames: [player.name] })
            targets.forEach(players => players.sendMessage(flagMsg))
            break
        }
        case "admin": {
            const targets = world.getAllPlayers().filter(players => isAdmin(players))
            targets.forEach(players => players.sendMessage(flagMsg))
            break
        }
        case "none": {
            break
        }
        default: {
            world.sendMessage(flagMsg)
            break
        }
    }
}

export function msToTime (ms: number) {
    const seconds = Math.trunc((ms / 1000) % 60);
    const minutes = Math.trunc((ms / 60000) % 60);
    const hours = Math.trunc((ms / 3600000) % 24);
    const days = Math.trunc(ms / 86400000);

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

export function getGamemode (playerName: string) {
    const gamemodes: GameMode[] = [
        GameMode.survival,
        GameMode.creative,
        GameMode.adventure,
        GameMode.spectator
    ]

    for (let i = 0; i < 4; i++) {
        if (world.getPlayers({
            name: playerName,
            gameMode: gamemodes[i]
        }).length > 0) return i
    }

    return 0
}

export function isAdmin (player: Player) {
    return !!player.getDynamicProperty("isAdmin")
}

export function timeToMs(timeStr: string) {
    const timeUnits: { [key: string]: number } = {
        d: 86400000,
        h: 3600000,
        m: 60000,
        s: 1000
    };

    let ms = 0;
    let match;

    for (const unit in timeUnits) {
        match = timeStr.match(new RegExp(`(\\d+)${unit}`));
        if (match) {
            ms += parseInt(match[1]) * timeUnits[unit];
        }
    }

    return ms;
}

export function isTimeStr(timeStr: string) {
    const timeUnits = ['d', 'h', 'm', 's'];
    return timeUnits.some(unit => new RegExp(`\\d+${unit}`).test(timeStr));
}

export const c = (): Root => {
    try {
        return JSON.parse(world.getDynamicProperty("matrix_config") as string)
    } catch {
        return Config
    }
}
