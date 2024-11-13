import { Player, RawMessage, system, world } from "@minecraft/server";
import { declarePermissionFunction } from "./assets/permission";
import defaultConfig from "./data/config";
/**
 * @author jasonlaubb
 * @description The basic system of Matrix Anticheat
 */
export class Module {
	// The var of index runtime
	private static moduleList: Module[] = [];
	private static playerLoopRunTime: IntegratedSystemEvent[] = [];
	private static tickLoopRunTime: IntegratedSystemEvent[] = [];
	// Types
	public readonly static SystemEvent = typeof IntergratedSystemEvent;
	public readonly static Config = typeof defaultConfig;
	// Properties of module
	private toggleId!: string;
	public name!: RawMessage;
	public description!: RawMessage;
	public category: string = "§cUnknown§r";
	public onEnable!: () => void;
	public onDisable!: () => void;
	// This is the constructor of anticheat
	public constructor () {}
	public setToggleId (id: string) {
		this.toggleId = id;
		return this;
	}
	public setName (name: RawMessage) {
		this.name = name;
		return this;
	}
	public setDescription (description: RawMessage) {
		this.description = description;
		return this;
	}
	public addCategory (category: string) {
		this.category = category;
		return this;
	}
	public onModuleEnable (func: () => void) {
		this.onEnable = func;
		return this;
	}
	public onModuleDisable (func: () => void) {
		this.onDisable = func;
		return this;
	}
	public register () {
		Module.moduleList.push(this);
	}
	public static subscribePlayerTickEvent (func: (player: Player) => void, includeAdmin: boolean = true) {
		const event = new IntegratedSystemEvent(func);
		event.booleanData = includeAdmin;
		Module.playerLoopRunTime = event.pushToList(Module.playerLoopRunTime);
	}
	public static clearPlayerTickEvent (func: IntergratedSystemEvent) {
		Module.playerLoopRunTime = event.removeFromList(Module.playerLoopRunTime);
	}
	public static subscribeTickEvent (func: () => void) {
		const event = new IntegratedSystemEvent(func);
		Module.tickLoopRunTime = event.pushToList(Module.tickLoopRunTime);
		return event;
	}
	public static clearTickEvent (func: IntergratedSystemEvent) {
		Module.tickLoopRunTime = event.removeFromList(Module.tickLoopRunTime);
	}
	public static initializeModules () {
		world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
			if (!initialSpawn) return;
			Module.currentPlayers.push(player);
		})
		world.afterEvents.playerLeave.subscribe(({ playerId }) => {
			Module.currentPlayers = Module.currentPlayers.filter(({ id }) => id != playerId);
		})
		for (const module of Module.moduleList) {
			if (Module.config.modules[module.toggleId] === true) module.onEnable();
		}
		system.runInterval(() => {
			const allPlayers = Module.allWorldPlayers;
			for (const player of allPlayers) {
				Module.playerLoopRunTime.forEach(event => {
					if (!event.booleanData && player.isAdmin()) event.moduleFunction(player);
				});
			}
			Module.tickLoopRunTime.forEach(event => {
				event.moduleFunction();
			})
		})
	}
	private static currentPlayers: Player[] = [];
	public static get allWorldPlayers () {
		return Module.currentPlayers;
	}
	public static get allNonAdminPlayers () {
		return Module.currentPlayers.filter(player => !player.isAdmin());
	}
	public static get config () {
		/** @warning Unfinished, the 2.0 dynamic config system should be here. */
		return defaultConfig;
	}
	public static get registeredModule () {
		return Module.moduleList;
	}
	public static findRegisteredModule (id: string) {
		return Module.moduleList.find(module => module.toggleId == id);
	}
}
class IntegratedSystemEvent {
	private func: Function;
	public booleanData?: boolean;
	public constructor (func: Function) {
		this.func = func;
	}
	public removeFromList (list: IntegratedSystemEvent[]) {
		const index = list.indexOf(this);
		if (index == -1) return list;
		list.splice(index, 1);
		return list;
	}
	public pushToList (list: IntegratedSystemEvent[]) {
		const index = list.indexOf(this);
		if (index != -1) return list;
		list.push(this);
		return list;
	}
	public get moduleFunction () {
		return this.func;
	}
}
export function sendError (error: Error) {
	console.warn(`[Error] ${error.name}: ${error.message} : ${error?.stack ?? "Unknown"}`)
}
// Declare the admin permission function
declarePermissionFunction();
// Debug utilities
import("@minecraft/debug-utilities").catch(() => console.warn("index.js :: Failed to load @minecraft/debug-utilities")).then(async (debugUtilities) => {
	try {
		const imported = debugUtilities as typeof import("@minecraft/debug-utilities");
		imported.disableWatchdogTimingWarnings(true);
	} catch {
		sendError(new Error("index.js :: Failed to load @minecraft/debug-utilities"));
	}
});
// Disable Watchdog Timing Warnings
system.beforeEvents.watchdogTerminate.subscribe((event) => {
	try {
		event.cancel = true
	} catch {
		system.run(() => sendError(new Error("index.js :: Failed to load @minecraft/debug-utilities")));
	}
});
// Run when the world fires
world.afterEvents.worldInitialize.subscribe(() => {
	// Enable Matrix AntiCheat
	Module.initializeModules();
})
