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
    // Types
    public static readonly Config = typeof defaultConfig;
    // Properties of module
    private toggleId!: string;
    public name!: RawMessage;
    public description!: RawMessage;
    public category: string = "§cUnknown§r";
    public onEnable!: () => void;
    public onDisable!: () => void;
    // This is the constructor of antiCheat
    public constructor() {}
    public setToggleId(id: string) {
        this.toggleId = id;
        return this;
    }
    public setName(name: RawMessage) {
        this.name = name;
        return this;
    }
    public setDescription(description: RawMessage) {
        this.description = description;
        return this;
    }
    public addCategory(category: string) {
        this.category = category;
        return this;
    }
    public onModuleEnable(func: () => void) {
        this.onEnable = func;
        return this;
    }
    public onModuleDisable(func: () => void) {
        this.onDisable = func;
        return this;
    }
    public register() {
        Module.moduleList.push(this);
    }
    public static subscribePlayerTickEvent(func: (player: Player) => void, includeAdmin: boolean = true) {
        const event = new IntegratedSystemEvent(func);
        event.booleanData = includeAdmin;
        Module.playerLoopRunTime = event.pushToList(Module.playerLoopRunTime);
    }
    public static clearPlayerTickEvent(func: IntegratedSystemEvent) {
        Module.playerLoopRunTime = func.removeFromList(Module.playerLoopRunTime);
    }
    public static subscribeTickEvent(func: () => void) {
        const event = new IntegratedSystemEvent(func);
        Module.tickLoopRunTime = event.pushToList(Module.tickLoopRunTime);
        return event;
    }
    public static clearTickEvent(func: IntegratedSystemEvent) {
        Module.tickLoopRunTime = func.removeFromList(Module.tickLoopRunTime);
    }
    public static ignite() {
        // Declare the admin permission function
        declarePermissionFunction();
        // Debug utilities
        import("@minecraft/debug-utilities")
            .catch(() => console.warn("index.js :: Failed to load @minecraft/debug-utilities"))
            .then(async (debugUtilities) => {
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
                event.cancel = true;
            } catch {
                system.run(() => Module.sendError(new Error("index.js :: Failed to load @minecraft/debug-utilities")));
            }
        });
        // Run when the world fires
        world.afterEvents.worldInitialize.subscribe(() => {
            // Enable Matrix AntiCheat when world initialized
            Module.initialize();
        });
    }
    public static initialize() {
        console.log("The server is running with Matrix AntiCheat | Made by jasonlaubb");
        // Setup the moderation event
        setupModeration();
        Command.initialize();
        world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
            if (!initialSpawn) return;
            Module.currentPlayers.push(player);
        });
        world.afterEvents.playerLeave.subscribe(({ playerId }) => {
            Module.currentPlayers = Module.currentPlayers.filter(({ id }) => id != playerId);
        });
        for (const module of Module.moduleList) {
            if (Module.config.modules[module.toggleId] === true) module.onEnable();
        }
        system.runInterval(() => {
            const allPlayers = Module.allWorldPlayers;
            for (const player of allPlayers) {
                Module.playerLoopRunTime.forEach((event) => {
                    if (!event.booleanData && player.isAdmin()) {
                        try {
                            event.moduleFunction(player);
                        } catch (error) {
                            Module.sendError(error as Error);
                        }
                    }
                });
            }
            Module.tickLoopRunTime.forEach((event) => {
                event.moduleFunction();
            });
        });
    }
    private static currentPlayers: Player[] = [];
    public static get allWorldPlayers() {
        return Module.currentPlayers;
    }
    public static get allNonAdminPlayers() {
        return Module.currentPlayers.filter((player) => !player.isAdmin());
    }
    public static get config() {
        /** @warning Unfinished, the 2.0 dynamic config system should be here. */
        return defaultConfig;
    }
    public static get registeredModule() {
        return Module.moduleList;
    }
    public static findRegisteredModule(id: string) {
        return Module.moduleList.find((module) => module.toggleId == id);
    }
    public static sendError(error: Error) {
        console.warn(`[Error] ${error.name}: ${error.message} : ${error?.stack ?? "Unknown"}`);
    }
}
// Command
class Command {
    public constructor() {}
    private static registeredCommands: Command[] = [];
    private static readonly optionMatchRegExp = /"((?:\\.|[^"\\])*)"|[^"@\s]+/g;
    public static readonly OptionInputType: OptionTypes;
    public availableId: string[] = [];
	public requiredOption: InputOption[] = [];
	public optionalOption: InputOption[] = [];
	public executeFunc?: (player: Player, ...args: (string | number | Player | boolean | undefined)[]) => void;
	public subCommands?: Command[];
    public setName(name: string) {
        this.availableId.push(name);
    }
    public setAliases(...aliases: string[]) {
        this.availableId.push(...aliases);
    }
    public addOption(name: string, description: RawMessage, type: OptionTypes, typeInfo?: undefined | TypeInfo, optional = false) {
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
                if (!typeInfo || typeInfo?.upperLimit || typeInfo?.lowerLimit) break;
                throw new Error("Command :: number and integer required upper limit or lower limit if exists");
            }
            default: {
                if (typeInfo) throw new Error("Command :: unused typeInfo property");
            }
        }
        if (optional) {
			this.optionalOption.push({ name, description, type, typeInfo });
		} else {
			this.requiredOption.push({ name, description, type, typeInfo });
		}
    }
	public addSubCommand (command: Command) {
		this.subCommands?.push(command);
	}
	public onExecute (executeFunc: (player: Player, ...args: (string | number | Player | boolean | undefined)[]) => void) {
		this.executeFunc = executeFunc;
	}
    public register() {
        Command.registeredCommands.push(this);
    }
    public static initialize () {
		Player.prototype.runChatCommand = function (commandString: string) {
			const args = commandString.trim().match(Command.optionMatchRegExp);
			if (!args) {
				this.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: "commandsynax.empty", with: [] }));
				return;
			};
			const command = Command.searchCommand(args[0]);
			const isSubCommand = command?.subCommands;
			if (isSubCommand) {

			} else {
				const argValues = Command.getArgValue(args, this);
				if (argValues === null) return;
				if (command?.executeFunc) {
					command.executeFunc(this, ...args.slice(1));
				}
			}
		}
        world.beforeEvents.chatSend.subscribe((event) => {

		});
    }
	private static getArgValue (args: string[], player: Player): (string | number | Player | boolean | undefined)[] | null {
		return args;
	}
	private static searchCommand (command: string) {
		command = command.toLowerCase();
		return Command.registeredCommands.find((commandClass) => commandClass.availableId.includes(command));
	}
}
class IntegratedSystemEvent {
    private func: Function;
    public booleanData?: boolean;
    public constructor(func: Function) {
        this.func = func;
    }
    public removeFromList(list: IntegratedSystemEvent[]) {
        const index = list.indexOf(this);
        if (index == -1) return list;
        list.splice(index, 1);
        return list;
    }
    public pushToList(list: IntegratedSystemEvent[]) {
        const index = list.indexOf(this);
        if (index != -1) return list;
        list.push(this);
        return list;
    }
    public get moduleFunction() {
        return this.func;
    }
}
// Interfaces and types for Module
interface TypeInfo {
    upperLimit?: number;
    lowerLimit?: number;
    arrayRange?: string[];
}
interface InputOption {
	name: string;
	description: RawMessage;
	type: OptionTypes;
	typeInfo?: TypeInfo;
}
type OptionTypes = "string" | "number" | "integer" | "boolean" | "player" | "choice" | "code" | "purecode";
export { Module };
// Start the AntiCheat
Module.ignite();
import "./system/anticheat/antifly";import { rawtext } from "./util/rawtext";

