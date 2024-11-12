import { Player, RawMessage, system, world } from "@minecraft/server";
import { declarePermissionFunction } from "./util/permission";
import defaultConfig from "./data/config";
export class Module {
	// The var of index runtime
	private static moduleList: Module[] = [];
	private static playerLoopRunTime: IntegratedSystemEvent[] = [];
	private static tickLoopRunTime: IntegratedSystemEvent[] = [];
	// Properties of module
	private toggleId!: string;
	public name!: RawMessage;
	public description!: RawMessage;
	public onEnable!: () => void;
	public onDisable!: () => void;
	private constructor () {}
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
	static subscribePlayerTickEvent (func: (player: Player) => void, includeAdmin: boolean = true) {
		const event = new IntegratedSystemEvent(func);
		event.booleanData = includeAdmin;
		Module.playerLoopRunTime = event.pushToList(Module.playerLoopRunTime);
	}
	static subscribeTickEvent (func: () => void) {
		const event = new IntegratedSystemEvent(func);
		Module.tickLoopRunTime = event.pushToList(Module.tickLoopRunTime);
	}
	static initializeModules () {
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
// Declare the admin permission function
declarePermissionFunction();
// Debug utilities
import("@minecraft/debug-utilities").catch(() => console.warn("index.js :: Failed to load @minecraft/debug-utilities")).then(async (debugUtilities) => {
	try {
		const imported = debugUtilities as typeof import("@minecraft/debug-utilities");
		imported.disableWatchdogTimingWarnings(true);
	} catch {
		console.warn("index.js :: Failed to load @minecraft/debug-utilities");
	}
});
// Disable Watchdog Timing Warnings
system.beforeEvents.watchdogTerminate.subscribe((event) => {
	try {
		event.cancel = true
	} catch {
		system.run(() => console.warn("index.js :: Failed to disable watchdog timing warnings"));
	}
});
// Run when the world fires
world.afterEvents.worldInitialize.subscribe(() => {
	// Enable Matrix AntiCheat
	Module.initializeModules();
})