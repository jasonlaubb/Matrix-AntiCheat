import { world, Player, GameMode, Vector3, Dimension, Effect, BlockPermutation, RawMessage, RawText } from "@minecraft/server";
import { ban } from "../Functions/moderateModel/banHandler";
import { triggerEvent } from "../Functions/moderateModel/eventHandler";
import { MinecraftBlockTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import Config from "../Data/Default";
import { saveLog } from "../Functions/moderateModel/log";
import { Translate } from "./Language";

/**
 * @author jasonlaubb
 * @description Utility function for script.
 * @warning This is very important, you cannot remove this.
 */
export { rawstr, getPing, kick, checkBlockAround, flag, msToTime, isTargetGamemode, getGamemode, timeToMs, isTimeStr, c, inAir, findSlime, getSpeedIncrease1, isAdmin, findWater, getSpeedIncrease2, logBreak, recoverBlockBreak, clearBlockBreakLog };

class rawstr {
    private storge: RawMessage[] = [];
    /** @description Direct rawtext translation */
    static drt(id: Translate, ...withargs: string[]) {
        return { rawtext: [{ translate: id, with: withargs }] };
    }
    static new(coloured?: boolean, colour?: string) {
        return new rawstr(coloured!, colour!);
    }
    static compare(...rstr: rawstr[]): rawstr {
        const newawa = new rawstr();
        // Double loop to compare each rawstr
        rstr.forEach(({ storge }) => {
            storge.forEach((s) => newawa.storge.push(s));
        });
        return newawa;
    }
    public constructor(coloured?: boolean, colour: string = "g") {
        if (coloured) {
            if (colour.length != 1) throw new Error("Rawstr :: Unexpect colour :: " + colour);
            this.storge.push({ text: "§bMatrix §7> §" + colour });
        }
    }
    /** @description Return the full rawtext */
    public parse() {
        return { rawtext: [this.storge] } as RawText;
    }
    /** @description Add text to rawtext */
    public str(text: string) {
        this.storge.push({ text: text });
        return this;
    }
    /** @description Add translation to rawtext */
    public tra(id: Translate, ...withargs: string[]) {
        this.storge.push({ translate: id, with: withargs });
        return this;
    }
}

function kick(player: Player, reason?: string, by?: string) {
    const textreason = "§c§lYou have been kicked\n§r§7Reason: §c" + reason ?? "--\n§7By: §c" + by ?? "--";
    world
        .getDimension(player.dimension.id)
        .runCommandAsync(`kick "${player.name}" ${textreason}`)
        .catch(() => triggerEvent(player, "matrix:kick"));
}

function formatInformation(arr: string[]) {
    const formattedArr: string[] = arr.map((item) => {
        const [key, value, id] = item.split(":");
        return `§r§c» §7${key}:§9 ${value}${id == undefined ? "" : ":" + id}§r`;
    });
    return formattedArr.join("\n");
}

function checkBlockAround(location: Vector3, blockType: MinecraftBlockTypes, dimension: Dimension): boolean {
    const floorPos: Vector3 = {
        x: Math.floor(location.x),
        y: Math.floor(location.y) - 1,
        z: Math.floor(location.z),
    } as Vector3;

    let blocks: string[] = [];

    for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
            blocks.push(dimension.getBlock({ x: floorPos.x + x, y: floorPos.y, z: floorPos.z + z } as Vector3)?.typeId);
        }
    }

    return new Set(blocks).has(blockType);
}

let Vl: any = {};

type Type = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

function flag(player: Player, modules: string, type: Type, maxVL: number, punishment: string | undefined, infos: string[] | undefined) {
    const config = c();
    Vl[player.id] ??= {};
    Vl[player.id][modules] ??= 0;

    try {
        Vl[player.id][modules]++;
    } catch {}

    const flagMsg = new rawstr(true).tra("flag.style", player.name, modules, type, Vl[player.id][modules]);
    if (config.logsettings.logCheatFlag) saveLog("Flag", player.name, `${modules} ${type} (x${Vl[player.id][modules]})`);
    if (infos !== undefined && !config.slient) flagMsg.str("\n" + formatInformation(infos));

    if (punishment && Vl[player.id][modules] > maxVL) {
        let punishmentDone = false;
        const banrun = world.getDynamicProperty("banrun");
        if (config.commands.banrun && banrun && ["kick", "ban"].includes(punishment)) {
            player.runCommandAsync(banrun as string);
        } else {
            switch (punishment) {
                case "kick": {
                    punishmentDone = true;
                    if (config.logsettings.logCheatPunishment) saveLog("Kick", player.name, `${modules} ${type}`);
                    kick(player, `Unfair adventage [${modules} ${type}]`, "Matrix AntiCheat");
                    flagMsg.str("\n§bMatrix §7>§g ").tra("util.formkick", player.name);
                    break;
                }
                case "ban": {
                    punishmentDone = true;
                    if (config.logsettings.logCheatPunishment) saveLog("Ban", player.name, `${modules} ${type}`);
                    ban(player, `Unfair adventage [${modules} ${type}]`, "Matrix AntiCheat", (config.punishment_ban.minutes as number | "forever") === "forever" ? "forever" : Date.now() + config.punishment_ban.minutes * 60000);
                    flagMsg.str("\n§bMatrix §7>§g ").tra("util.formban", player.name);
                    break;
                }
            }
        }
        if (punishmentDone) {
            Vl[player.id][modules] = 0;
        }
    }

    const flagMode = world.getDynamicProperty("flagMode") ?? config.flagMode;
    switch (flagMode) {
        case "tag": {
            const targets = world.getPlayers({ tags: ["matrix:notify"] });
            targets.forEach((players) => players.sendMessage(flagMsg.parse()));
            break;
        }
        case "bypass": {
            const targets = world.getPlayers({ excludeNames: [player.name] });
            targets.forEach((players) => players.sendMessage(flagMsg.parse()));
            break;
        }
        case "admin": {
            const allPlayers = world.getAllPlayers();
            const targets = allPlayers.filter((players) => isAdmin(players));
            targets.forEach((players) => players.sendMessage(flagMsg.parse()));
            break;
        }
        case "none": {
            break;
        }
        default: {
            world.sendMessage(flagMsg.parse());
            break;
        }
    }
}

function msToTime(ms: number) {
    const seconds = Math.trunc((ms / 1000) % 60);
    const minutes = Math.trunc((ms / 60000) % 60);
    const hours = Math.trunc((ms / 3600000) % 24);
    const days = Math.trunc(ms / 86400000);

    return { days, hours, minutes, seconds };
}

function isTargetGamemode(player: Player, gamemode: number) {
    const gamemodes: GameMode[] = [GameMode.survival, GameMode.creative, GameMode.adventure, GameMode.spectator];

    return [...world.getPlayers({ name: player.name, gameMode: gamemodes[gamemode] })].length != 0;
}

function getGamemode(playerName: string) {
    const gamemodes: GameMode[] = [GameMode.survival, GameMode.creative, GameMode.adventure, GameMode.spectator];

    for (let i = 0; i < 4; i++) {
        if (
            world.getPlayers({
                name: playerName,
                gameMode: gamemodes[i],
            }).length != 0
        )
            return i;
    }

    return 0;
}

function isAdmin(player: Player) {
    return !!player.getDynamicProperty("isAdmin");
}

function timeToMs(timeStr: string) {
    let ms = 0;
    const timeRegax = /\d+(s|m|h|d)/g;
    const matches = timeStr.match(timeRegax);
    for (const str of matches) {
        const value = Number(str.slice(0, -1));
        if (Number.isNaN(value)) continue;
        const unit = str[str.length - 1];
        switch (unit) {
            case "s": {
                ms += value * 1000;
                break;
            }
            case "m": {
                ms += value * 60000;
                break;
            }
            case "h": {
                ms += value * 3600000;
                break;
            }
            case "d": {
                ms += value * 86400000;
                break;
            }
            default:
                console.error("Unexpect time unit: " + unit);
        }
    }

    return ms;
}

function isTimeStr(timeStr: string) {
    const timeUnits = ["d", "h", "m", "s"];
    return timeUnits.some((unit) => new RegExp(`\\d+${unit}`).test(timeStr));
}

const c = () => Config;

function inAir(dimension: Dimension, location: Vector3) {
    location = { x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z) };
    const offset = [-1, 0, 1];
    const offsetY = [-1, 0, 1, 2];
    let allBlock = [];

    return offset.some((x) =>
        offsetY.some((y) =>
            offset.some((z) =>
                allBlock.push(
                    dimension.getBlock({
                        x: location.x + x,
                        y: location.y + y,
                        z: location.z + z,
                    })?.isAir
                )
            )
        )
    );
}

function findSlime(dimension: Dimension, location: Vector3) {
    const offset = [-1, 0, 1];
    const pos = {
        x: Math.floor(location.x),
        y: Math.floor(location.y) - 1,
        z: Math.floor(location.z),
    };

    return offset.some((x) =>
        offset.some(
            (z) =>
                dimension.getBlock({
                    x: pos.x + x,
                    y: pos.y,
                    z: pos.z + z,
                })?.typeId === MinecraftBlockTypes.Slime
        )
    );
}

function getSpeedIncrease1(speedEffect: Effect | undefined) {
    if (speedEffect === undefined) {
        return 0;
    }
    if (speedEffect.amplifier < 2) {
        return 0;
    }
    return ((speedEffect?.amplifier - 2) * 4032) / 1609.34;
}

function getSpeedIncrease2(speedEffect: Effect | undefined) {
    if (speedEffect === undefined) {
        return 0;
    }
    return (speedEffect?.amplifier + 1) * 1.12;
}

function findWater(player: Player) {
    const pos = { x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) };
    return [-1, 0, 1].some((x) => [-1, 0, 1].some((z) => [-1, 0, 1].some((y) => player.dimension.getBlock({ x: pos.x + x, y: pos.y + y, z: pos.z + z })?.isLiquid)));
}

let blockBreakLogger: { [key: string]: BlockObject[] } = {};

interface BlockObject {
    permutation: BlockPermutation;
    time: number;
    location: Vector3;
}

function logBreak(block: BlockPermutation, location: Vector3, id: string) {
    const now = Date.now();
    const blockObject: BlockObject = {
        permutation: Object.assign({}, block),
        time: now,
        location: location,
    };

    blockBreakLogger[id] ??= [];
    blockBreakLogger[id].push(blockObject);

    blockBreakLogger[id] = blockBreakLogger[id].filter((f) => now - f.time < 1000);
    return blockObject;
}

function recoverBlockBreak(id: string, range: number, dimension: Dimension) {
    const now = Date.now();
    const log = blockBreakLogger[id] ?? [];
    if (log === undefined) return;

    log.filter((f) => now - f.time <= range).forEach((b) => {
        dimension
            .getEntities({
                minDistance: 0,
                maxDistance: 2,
                type: "minecraft:item",
                location: b.location,
            })
            .forEach((i) => i.kill());
        //dimension.getBlock(b.location)?.setPermutation(b.permutation.clone())
        dimension.getBlock(b.location)?.setType(MinecraftBlockTypes.Bedrock);
    });

    blockBreakLogger[id] = log.filter((f) => now - f.time > range);
}

const clearBlockBreakLog = (id: string) => delete blockBreakLogger[id];

// The most useless function lol
const getPing = (player: Player) => player.pingTick ?? 0;
