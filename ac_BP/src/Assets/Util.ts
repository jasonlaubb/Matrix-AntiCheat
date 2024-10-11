import { world, system, Player, GameMode, Vector3, Dimension, Effect, BlockPermutation, RawMessage, RawText } from "@minecraft/server";
import { MinecraftBlockTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import { Translate } from "./Language";
import Dynamic from "../Functions/Config/dynamic_config";
import { MatrixUsedTags } from "../Data/EnumData";
import MathUtil from "./MathUtil";
import { SHA256 } from "../node_modules/crypto-es/lib/sha256";
import { Action } from "./Action";

/**
 * @author jasonlaubb
 * @description Utility function for script.
 * @warning This is very important, you cannot remove this.
 */
export {
    isSpawning,
    rawstr,
    getPing,
    checkBlockAround,
    msToTime,
    isTargetGamemode,
    getGamemode,
    timeToMs,
    isTimeStr,
    c,
    inAir,
    findSlime,
    getSpeedIncrease1,
    isAdmin,
    getPLevel,
    setPLevel,
    removeAdmin,
    isHost,
    findWater,
    getSpeedIncrease2,
    logBreak,
    recoverBlockBreak,
    clearBlockBreakLog,
    toFixed,
    bypassMovementCheck,
    onceTrue,
    isPasswordCorrect,
    extraDisconnect,
};

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
        return { rawtext: this.storge } as RawText;
    }
    /** @description Add text to rawtext */
    public str(text: string) {
        this.storge.push({ text: text });
        return this;
    }
    /** @description Add translation to rawtext */
    public tra(id: Translate, ...withargs: string[]) {
        this.storge.push({ translate: id, with: withargs.map((i) => String(i)) });
        return this;
    }
}

function extraDisconnect (player: Player) {
    if (c().antiCheatTestMode) return;
    system.run(() => {
        try {
            Action.tempkick(player);
        } catch { }
    });
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
            blocks.push(dimension.getBlock({ x: floorPos.x + x, y: floorPos.y, z: floorPos.z + z } as Vector3)?.typeId ?? "minecraft:air");
        }
    }

    return new Set(blocks).has(blockType);
}

export type Type = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

function msToTime(ms: number) {
    const seconds = Math.trunc((ms / MathUtil.ms.second) % 60);
    const minutes = Math.trunc((ms / MathUtil.ms.minute) % 60);
    const hours = Math.trunc((ms / MathUtil.ms.hour) % 24);
    const days = Math.trunc(ms / MathUtil.ms.day);

    return { days, hours, minutes, seconds };
}

function isTargetGamemode(player: Player, gamemode: number) {
    const gamemodes: GameMode[] = [GameMode.survival, GameMode.creative, GameMode.adventure, GameMode.spectator];

    return player.getGameMode() == gamemodes[gamemode];
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
    return getPLevel(player) >= 0;
}

function getPLevel(player: Player): number {
    return (player.getDynamicProperty("permission_level") as number) ?? -1;
}

function setPLevel(player: Player, level: number) {
    player.setDynamicProperty("permission_level", level);
}

function removeAdmin(player: Player) {
    player.setDynamicProperty("permission_level");
}

// Host id is always -206158430207 for Local World
function isHost({ id }: Player) {
    return id == "-206158430207";
}

function timeToMs(timeStr: string) {
    let ms = 0;
    const timeRegax = /\d+(s|m|h|d)/g;
    const matches = timeStr.match(timeRegax);
    if (matches === null) return undefined;
    for (const str of matches) {
        const value = Number(str.slice(0, -1));
        if (Number.isNaN(value)) continue;
        const unit = str[str.length - 1];
        switch (unit) {
            case "s": {
                ms += value * MathUtil.ms.second;
                break;
            }
            case "m": {
                ms += value * MathUtil.ms.minute;
                break;
            }
            case "h": {
                ms += value * MathUtil.ms.hour;
                break;
            }
            case "d": {
                ms += value * MathUtil.ms.day;
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

// Don't delete this, very important
function c() {
    Dynamic;
    return Dynamic.config();
}

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

function isSpawning(player: Player) {
    return player.isSpawning ?? true;
}

function toFixed(number: number, digit: number, toString = false) {
    if (Number.isNaN(number)) throw new Error("Util :: toFixed :: Not A number");
    const numberToFixed = Number(number.toFixed(digit));
    return toString ? String(numberToFixed) : numberToFixed;
}

function bypassMovementCheck(player: Player) {
    const config = c();
    return config.enableMovementCheckBypassTag && player.hasTag(MatrixUsedTags.movementbypass);
}

/**
 * @description Wait for a function to return true.
 * Set interval to -1 to let it keep checking
 */
function onceTrue(object: any, func: (obj: any) => boolean, ticks: number, interval = 1): Promise<boolean> {
    if ((ticks <= 0 && ticks != -1) || !Number.isInteger(ticks)) {
        throw new Error("Util :: onceTrue :: Ticks passed invalid");
    }
    const isFinite = ticks == -1;
    let i = 0;
    return new Promise<boolean>((resolve) => {
        const intervalId = system.runInterval(() => {
            i++;
            if (func(object)) {
                system.clearRun(intervalId);
                resolve(true);
            } else if (!isFinite && i >= ticks) {
                system.clearRun(intervalId);
                resolve(false);
            }
        }, interval);
    });
}

function isPasswordCorrect(password: string) {
    const config = c();
    const sourcePassword = config.commands.passwordSetting.usingHash ? SHA256(password).toString() : password;
    const correctPassword: string = config.commands.passwordSetting.usingHash ? config.commands.passwordSetting.hash : config.commands.passwordSetting.password;
    // Check if the password is correct
    return sourcePassword === correctPassword;
}
