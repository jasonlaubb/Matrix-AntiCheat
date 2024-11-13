import { Player, RawMessage, system, world } from "@minecraft/server";
import { declarePermissionFunction } from "./assets/permission";
import { setupModeration } from "./util/moderation";
import defaultConfig from "./data/config";
/**
 * @author jasonlaubb
 * @description The core system of Matrix anticheat
 */
class Module {
	// The var of index runtime
	private static moduleList: Module[] = [];
	private static playerLoopRunTime: IntegratedSystemEvent[] = [];
	private static tickLoopRunTime: IntegratedSystemEvent[] = [];
	// Command
	public readonly static command = class CommandExtension {
	public constructor () {};
	private static registeredCommands: Module.command[] = [];
	private readonly static optionMatchRegExp = /"((?:\\.|[^"\\])*)"|[^"@\s]+/g;
	public readonly static Command = typeof Module.command;
	public readonly static OptionInputType = OptionTypes;
	public availableId: string[] = [];
	public setName (name: string) {
	        availableId.push(name);
	}
	public setAliases (...aliases: string[]) {
		availableId.push(...aliases);
	}
	public addOption (name: RawMessage, description: RawMessage, type: Module.command.OptionInputType, typeInfo?: undefined | TypeInfo, optional = false) {
		// Error prevention
		switch (type) {
			case "code":
			case "purecode": {
				if (typeInfo?.lowerLimit) break;
				throw new Error("Command :: pure code and code required lower limit");
			}
			case "string":
			case "number":
			case "integer": {
				if (!typeInfo || typeInfo?.upperLimit || typeInfo?.loweLimit) break;
				throw new Error("Command :: number and integer required upper limit or lower limit if exists");
			}
			default: {
				if (typeInfo) throw new Error("Command :: unused typeInfo property");
			}
		}
		// unfinished
	}
	public register () {
		registeredCommands.push(this);
	}
	public static runCommand (command: string) {
		
	}
	public static initBeforeEvent () {
		world.beforeEvents.chatSend.subscribe(event => {
			
		})
	}
	};
	// To store and identify the data for each system event.
        public readonly static IntergratedSystemEvent = class IntegratedSystemEvent {
	private func: Function;
	public booleanData?: boolean;
	public constructor (func: Function) {
		this.func = func;
	}
	public removeFromList (list: Module.IntegratedSystemEvent[]) {
		const index = list.indexOf(this);
		if (index == -1) return list;
		list.splice(index, 1);
		return list;
	}
	public pushToList (list: Module.IntegratedSystemEvent[]) {
		const index = list.indexOf(this);
		if (index != -1) return list;
		list.push(this);
		return list;
	}
	public get moduleFunction () {
		return this.func;
	}
};
	// Types
	public readonly static SystemEvent = typeof Module.IntergratedSystemEvent;
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
		const event = new Module.IntegratedSystemEvent(func);
		event.booleanData = includeAdmin;
		Module.playerLoopRunTime = event.pushToList(Module.playerLoopRunTime);
	}
	public static clearPlayerTickEvent (func: Module.IntergratedSystemEvent) {
		Module.playerLoopRunTime = event.removeFromList(Module.playerLoopRunTime);
	}
	public static subscribeTickEvent (func: () => void) {
		const event = new Module.IntegratedSystemEvent(func);
		Module.tickLoopRunTime = event.pushToList(Module.tickLoopRunTime);
		return event;
	}
	public static clearTickEvent (func: Module.IntergratedSystemEvent) {
		Module.tickLoopRunTime = event.removeFromList(Module.tickLoopRunTime);
	}
	public static initialize () {
		console.log("The server is running with Matrix anticheat | Made by jasonlaubb");
		// Setup the moderation event
		setupModeration();
		Module.command.initBeforeEvent();
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
				        if (!event.booleanData && player.isAdmin()) {
					        try {
			                            event.moduleFunction(player);
					        } catch (error) {
				                    Module.sendError(error);
					        }
				        }
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
	public static sendError (error: Error) {
	        console.warn(`[Error] ${error.name}: ${error.message} : ${error?.stack ?? "Unknown"}`)
	}
}
// Interfaces and types for Module
interface TypeInfo {
	upperLimit?: number;
	lowerLimit?: number;
	arrayRange?: string[];
}
type OptionTypes = "string" | "number" | "integer" | "boolean" | "player" | "choice" | "code" | "purecode";
// Declare the admin permission function
declarePermissionFunction();
// Debug utilities
import("@minecraft/debug-utilities").catch(() => console.warn("index.js :: Failed to load @minecraft/debug-utilities")).then(async (debugUtilities) => {
	try {
		const imported = debugUtilities as typeof import("@minecraft/debug-utilities");
		imported.disableWatchdogTimingWarnings(true);
	} catch {
		Module.sendError(new Error("index.js :: Failed to load @minecraft/debug-utilities"));
	}
});
// Disable Watchdog Timing Warnings
system.beforeEvents.watchdogTerminate.subscribe((event) => {
	try {
		event.cancel = true
	} catch {
		system.run(() => Module.sendError(new Error("index.js :: Failed to load @minecraft/debug-utilities")));
	}
});
// Run when the world fires
world.afterEvents.worldInitialize.subscribe(() => {
	// Enable Matrix AntiCheat when world initialized
	Module.initialize();
});
// Export the main module
export { Module };
