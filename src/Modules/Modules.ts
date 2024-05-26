// old system
import { c, isAdmin } from "../Assets/Util";
import autoClicker from "./Combat/Auto Clicker";
import killAura from "./Combat/Kill Aura";
import reach from "./Combat/Reach";
import aim from "./Combat/Aim";
import spammer from "./Misc/Spammer";
import crasher from "./Misc/Crasher";
import fly from "./Movement/Fly";
import nofall from "./Movement/NoFall";
import noClip from "./Movement/NoClip";
import speed from "./Movement/Speed";
import timer from "./Movement/Timer";
import noSlow from "./Movement/NoSlow";
import elytraFly from "./Movement/ElytraFly";
import nuker from "./World/Nuker";
import scaffold from "./World/Scaffold";
import tower from "./World/Tower";
import cbe from "./World/CommandBlockExplolit";
import breaker from "./World/Breaker";
import blockReach from "./Player/BlockReach";
import illegalItem from "./Player/Illegal Item";
import nameSpoof from "./Player/NameSpoof";
import auto from "./Player/Auto";
import fastUse from "./Player/FastUse";
import gameMode from "./Player/GameMode";
import spam from "./Misc/Spam";
import autotool from "./World/AutoTool";
import bot from "./Misc/Bot";
import fastBreak from "./World/FastBreak";
import xray from "./Misc/Xray";
import worldBorder from "./Movement/World Border";
import disabler from "./Misc/Disabler";
import clientAuth from "./Player/ClientAuth";
import { EntityQueryOptions, Player, system, world } from "@minecraft/server";
import Default from "../Data/Default";

interface toggleHandler {
    enable: () => void;
    disable: () => void;
}

export const antiCheatModules: { [key: string]: toggleHandler } = {
    worldBorder: worldBorder,
    antiReach: reach,
    antiKillAura: killAura,
    antiAutoClicker: autoClicker,
    antiSpam: spam,
    antiSpammer: spammer,
    antiFly: fly,
    antiNoFall: nofall,
    antiElytraFly: elytraFly,
    antiBreaker: breaker,
    antiNoClip: noClip,
    antiSpeed: speed,
    antiTimer: timer,
    antiNuker: nuker,
    antiGameMode: gameMode,
    antiTower: tower,
    antiFastUse: fastUse,
    antiNoSlow: noSlow,
    antiBlockReach: blockReach,
    antiAim: aim,
    antiScaffold: scaffold,
    antiAutoTool: autotool,
    antiAuto: auto,
    antiFastBreak: fastBreak,
    antiNameSpoof: nameSpoof,
    antiCBE: cbe,
    antiXray: xray,
    antiCrasher: crasher,
    antiIllegalItem: illegalItem,
    antiBot: bot,
    antiDisabler: disabler,
    clientAuth: clientAuth,
};

export const keys = Object.keys(antiCheatModules);

export function getModuleState(module: string) {
    if (!keys.includes(module)) return undefined;
    return (c() as { [key: string]: any })[module]?.enabled;
}

export function moduleStart() {
    const config = c();
    const entry = Object.entries(antiCheatModules);
    for (const [name, handler] of entry) {
        if ((config as { [key: string]: any })[name]?.enabled) {
            handler.enable();
        }
    }
}

// new system

/**
 * @author jasonlaubb
 * @description Module Handler
 */

let MODULES: Module[] = [];

export function registerModule(id: string, checkAdmin: boolean, varargs: (Map<string, any> | { [key: string]: any })[], ...event: (TickEvent | WorldEvent)[]): void {
    const tickEvent = (event as TickEvent[]).filter((ev) => ev?.tickInterval);
    const worldEvent = (event as WorldEvent[]).filter((ev) => ev?.worldSignal);
    MODULES.push({
        id: id,
        checkAdmin: checkAdmin,
        tickEvent: tickEvent.length > 0 ? tickEvent : undefined,
        worldEvent: worldEvent.length > 0 ? worldEvent : undefined,
        enabled: false,
        mapclears: varargs.filter((arg) => arg?.delete) as Map<string, any>[],
    });
}
export function intilizeModules(): void {
    const config = c();
    let mapvalues: Map<string, any>[] = [];
    MODULES.filter((module) => module.enabled).forEach((module) => {
        unlisten(module.id);
    });
    MODULES.forEach((element) => {
        mapvalues.push(...element.mapclears);
        if ((config as any)[element.id]?.enabled) {
            // Method for state module is enabled
            setup(config, element);
        }
    });
}
function setup(config: typeof Default, element: Module) {
    let runIds = [];
    if ((config as any)[element.id]?.enabled) {
        // Method for state module is enabled
        for (const tE of element.tickEvent) {
            runIds.push(
                system.runInterval(() => {
                    const currentConfig = c();
                    if (tE?.intick) {
                        let allPlayers = tE?.playerOption ? world.getPlayers(tE.playerOption) : world.getAllPlayers();
                        if (!element.checkAdmin) allPlayers = allPlayers.filter((player) => !isAdmin(player));
                        for (const player of allPlayers) {
                            tE.intick(currentConfig, player).catch((error) => {
                                rejected("Module rejected :: " + element.id + " :: " + String(error));
                            });
                        }
                    }
                    if (tE?.onTick) {
                        tE.onTick(currentConfig).catch((error) => {
                            rejected("Module rejected :: " + element.id + " :: " + String(error));
                        });
                    }
                }, tE.tickInterval)
            );
        }
        for (const wE of element.worldEvent) {
            wE.worldSignal.subscribe((event: any) => {
                const currentConfig = c();
                wE.then(currentConfig, event).catch((error) => {
                    rejected("Module rejected :: " + element.id + " :: " + String(error));
                });
            });
        }
    }
    element.runId = runIds;
    element.enabled = true;
    MODULES[MODULES.findIndex((a) => a.id == element.id)] = element;
}

function unlisten(id: string) {
    const index = MODULES.findIndex((a) => a.id == id);
    const module = MODULES[index];
    if (!module) throw "Unlisten :: " + id + " :: No result";
    if (!module?.enabled) "Unlisten :: " + id + " :: Already disabled";
    for (const num of module.runId) {
        system.clearRun(num);
    }
    for (const wor of module.worldEvent) {
        wor.worldSignal.unsubscribe(wor.then);
    }
    for (const clear of module?.mapclears ?? []) {
        clear.clear();
    }
    module.runId = [];
    module.enabled = false;
    MODULES[index] = module;
}

function rejected(error: string) {
    const actualErrror = String(error);
    console.warn(actualErrror);
}

interface Module {
    id: string;
    checkAdmin: boolean;
    tickEvent?: TickEvent[];
    worldEvent?: WorldEvent[];
    runId?: number[]; // for module handler
    enabled: boolean;
    mapclears: Map<string, any>[];
}

interface TickEvent {
    tickInterval: number;
    intick?: (config: typeof Default, player: Player) => Promise<void | number>;
    onTick?: (_config: typeof Default) => Promise<void | number>;
    playerOption?: EntityQueryOptions;
}
interface WorldEvent {
    worldSignal: any;
    playerOption?: EntityQueryOptions;
    then: (config: typeof Default, event: unknown) => Promise<void | number>;
}
