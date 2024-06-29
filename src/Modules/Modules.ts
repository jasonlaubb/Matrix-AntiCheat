import { c, isAdmin } from "../Assets/Util";
import "./Combat/Auto Clicker";
import "./Combat/Kill Aura";
import "./Combat/Reach";
import "./Combat/Aim";
import "./Misc/Spammer";
import "./Misc/Crasher";
import "./Movement/Fly";
import "./Movement/NoFall";
import "./Movement/NoClip";
import "./Movement/Speed";
import "./Movement/Timer";
import "./Movement/NoSlow";
import "./Movement/ElytraFly";
import "./World/Nuker";
import "./World/Scaffold";
import "./World/Tower";
import "./World/CommandBlockExplolit";
import "./World/Breaker";
import "./Player/BlockReach";
import "./Player/Illegal Item";
import "./Player/NameSpoof";
import "./Player/Auto";
import "./Player/FastUse";
import "./Player/GameMode";
import "./Misc/Spam";
import "./World/AutoTool";
import "./Misc/Bot";
import "./World/FastBreak";
import "./Misc/Xray";
import "./Movement/World Border";
import "./Misc/Disabler";
import "./Player/ClientAuth";

import { EntityEventOptions, EntityQueryOptions, Player, system, world } from "@minecraft/server";
import Default from "../Data/Default";

/**
 * @author jasonlaubb
 * @description Module Handler
 */

let MODULES: Module[] = [];

export function registerModule(id: string, checkAdmin: boolean, varargs: (Map<string, any> | { [key: string]: any })[], ...event: (TickEvent | WorldEvent | IntilizeEvent)[]): void {
    const tickEvent = (event as TickEvent[]).filter((ev) => ev?.tickInterval);
    const worldEvent = (event as WorldEvent[]).filter((ev) => ev?.worldSignal);
    const intilizeEvent = (event as IntilizeEvent[]).filter((ev) => ev?.runAfterSubsribe);
    MODULES.push({
        id: id,
        checkAdmin: checkAdmin,
        tickEvent: tickEvent.length > 0 ? tickEvent : undefined,
        worldEvent: worldEvent.length > 0 ? worldEvent : undefined,
        intilizeEvent: intilizeEvent.length > 0 ? intilizeEvent : undefined,
        enabled: false,
        mapclears: varargs.filter((arg) => arg?.delete) as Map<string, any>[],
    });
}
export function getModulesIds() {
    return MODULES.map((module) => module.id);
}
export async function intilizeModules(): Promise<void> {
    // Await for a tick
    await new Promise<void>((resolve) => system.run(() => resolve()));
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
/**
 * @description This is the type of the Config.
 * @warning Don't touch this constant
 * */
export type configi = typeof Default;

function setup(config: configi, element: Module) {
    let runIds = [];
    if ((config as any)[element.id]?.enabled) {
        element.intilizeEvent?.forEach(async (iE) => {
            if (Number.isInteger(iE.runAfterSubsribe) && iE.runAfterSubsribe > 0) await new Promise<void>((resolve) => system.runTimeout(() => resolve(), iE.runAfterSubsribe));
            iE.onIntilize(config).catch((error) => {
                rejected("Module rejected :: " + element.id + " :: " + String(error));
            });
        });
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
    intilizeEvent?: IntilizeEvent[];
    runId?: number[]; // for module handler
    enabled: boolean;
    mapclears: Map<string, any>[];
}

interface TickEvent {
    tickInterval: number;
    intick?: (config: configi, player: Player) => Promise<void | number>;
    onTick?: (_config: configi) => Promise<void | number>;
    playerOption?: EntityQueryOptions;
}
interface WorldEvent {
    worldSignal: any;
    playerOption?: EntityEventOptions;
    then: (config: configi, event: any) => Promise<void | number>;
}
interface IntilizeEvent {
    onIntilize: (config: configi) => Promise<void | number>;
    runAfterSubsribe: number;
}