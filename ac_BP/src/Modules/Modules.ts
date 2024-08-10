import { c, isAdmin } from "../Assets/Util";
import { EntityDataDrivenTriggerEventOptions, EntityEventOptions, EntityQueryOptions, Player, system, world } from "@minecraft/server";
import Default from "../Data/Default";
import { sendErr } from "../Functions/chatModel/CommandHandler";
import Index from "../index";

/**
 * @author jasonlaubb
 * @description Module Handler
 */

export async function registerModule(id: string, checkAdmin: boolean, varargs: (Map<string, any> | { [key: string]: any })[], ...event: (TickEvent | WorldEvent | IntilizeEvent)[]): Promise<void> {
    const tickEvent = (event as TickEvent[]).filter((ev) => ev?.tickInterval);
    const worldEvent = (event as WorldEvent[]).filter((ev) => ev?.worldSignal);
    const intilizeEvent = (event as IntilizeEvent[]).filter((ev) => ev?.runAfterSubsribe);
    world.modules.push({
        id: id,
        checkAdmin: checkAdmin,
        tickEvent: tickEvent.length > 0 ? tickEvent : undefined,
        worldEvent: worldEvent.length > 0 ? worldEvent : undefined,
        intilizeEvent: intilizeEvent.length > 0 ? intilizeEvent : undefined,
        enabled: false,
        mapclears: varargs.filter((arg) => arg?.delete) as Map<string, any>[],
    });
}
export async function getModulesIds() {
    if (world.modules) {
        return world.modules.map((module) => module.id);
    } else {
        await Index.initializeAsync();
        return (world.modules as Module[]).map((module) => module.id);
    }
}
let mapvalues: Map<string, any>[] = [];
export async function intilizeModules() {
    const config = c();
    mapvalues = [];
    Index.initializeAsync();
    world.modules
        .filter((module) => module?.enabled)
        .forEach((module) => {
            unlisten(module.id).catch(sendErr);
        });
    system.runJob(looper(config));
    return world.modules?.length;
}
function* looper(config: configi): Generator<void, void, void> {
    const len = world.modules.length;
    for (let i = 0; i < len; i++) {
        try {
            const element = world.modules[i];
            if (element.mapclears) mapvalues.push(...element.mapclears);
            if ((config as any)[element.id]?.enabled) {
                // Method for state module is enabled
                setup(config, element);
            }
            //world.sendMessage(`Loading the ${element.id} Module (${i + 1}/${len})`);
        } catch (error) {
            sendErr(error as Error);
        } finally {
            yield;
        }
    }
}
/**
 * @description This is the type of the Config.
 * @warning Don't touch this constant
 * */
export type configi = typeof Default;

function setup(config: configi, element: Module) {
    let runIds = [];
    if ((config as any)[element.id]?.enabled) {
        if (element?.intilizeEvent)
            element.intilizeEvent?.forEach(async (iE) => {
                if (Number.isInteger(iE.runAfterSubsribe) && iE.runAfterSubsribe > 0) await new Promise<void>((resolve) => system.runTimeout(() => resolve(), iE.runAfterSubsribe));
                iE.onIntilize(config).catch((error) => {
                    rejected("Module rejected :: " + element.id + " :: " + String(error));
                });
            });
        // Method for state module is enabled
        for (const tE of element?.tickEvent ?? []) {
            runIds.push(
                system.runInterval(() => {
                    const currentConfig = c();
                    if (tE?.intick) {
                        let allPlayers = tE?.playerOption ? world.getPlayers(tE.playerOption) : world.getAllPlayers();
                        if (!element.checkAdmin) allPlayers = allPlayers.filter((player) => !isAdmin(player));
                        for (const player of allPlayers) {
                            tE.intick(currentConfig, player).catch((error) => {
                                sendErr(error);
                            });
                        }
                    }
                    if (tE?.onTick) {
                        tE.onTick(currentConfig).catch((error) => {
                            sendErr(error);
                        });
                    }
                }, tE.tickInterval)
            );
        }
        for (const wE of element?.worldEvent ?? []) {
            wE.worldSignal.subscribe((event: any) => {
                const currentConfig = c();
                wE.then(currentConfig, event).catch((error) => {
                    sendErr(error);
                });
            });
        }
    }
    element.runId = runIds;
    element.enabled = true;
    world.modules[world.modules.findIndex((a) => a.id == element.id)] = element;
}

async function unlisten(id: string) {
    const index = world.modules.findIndex((a) => a.id == id);
    const module = world.modules[index];
    if (!module) throw "Unlisten :: " + id + " :: No result";
    if (!module?.enabled) throw "Unlisten :: " + id + " :: Already disabled";

    for (const num of module?.runId ?? []) {
        system.clearRun(num);
    }
    for (const wor of module?.worldEvent ?? []) {
        wor.worldSignal.unsubscribe(wor.then);
    }
    for (const clear of module?.mapclears ?? []) {
        clear.clear();
    }
    module.runId = [];
    module.enabled = false;
    world.modules[index] = module;
}

let lastERROR: string = "";
let amount = 0;
function rejected(error: string) {
    const actualErrror = String(error);
    if (lastERROR == actualErrror) {
        amount++;
    } else amount = 0;
    lastERROR = actualErrror;
    if (amount < 3) console.warn(actualErrror);
}

export interface Module {
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
    playerOption?: EntityEventOptions | EntityDataDrivenTriggerEventOptions;
    then: (config: configi, event: any) => Promise<void | number>;
}
interface IntilizeEvent {
    onIntilize: (config: configi) => Promise<void | number>;
    runAfterSubsribe: number;
}
