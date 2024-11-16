import { Player, RawMessage, system, world } from "@minecraft/server";
import { declarePermissionFunction } from "./assets/permission";
import defaultConfig from "./data/config";
import { fastText, rawtext, rawtextTranslate } from "./util/rawtext";
import { tickDataMap } from "./program/system/tickDataMap";
/**
 * @author jasonlaubb
 * @description The core system of Matrix AntiCheat.
 * @license AGPL-3.0
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat/
 * @warn You are not allowed to copy or modify this system unless you have declared yours as a fork from us.
 */
class Module {
    public static readonly version: [number, number, number] = [6, 0, 0];
    // The var of index runtime
    private static moduleList: Module[] = [];
    private static playerLoopRunTime: IntegratedSystemEvent[] = [];
    private static tickLoopRunTime: IntegratedSystemEvent[] = [];
    // Types
    public static readonly Config = typeof defaultConfig;
    // Properties of module
    private toggleId!: string;
    private name: RawMessage = { text: "§cUnknown§r" };
    private description!: RawMessage;
    private category: string = "§cUnknown§r";
    private locked: boolean = false;
    private onEnable!: () => void;
    private onDisable!: () => void;
    private playerSpawn?: (playerId: string, player: Player) => void;
    private playerLeave?: (playerId: string) => void;
    private enabled: boolean = false;
    // This is the constructor of antiCheat
    public constructor() {}
    // For other uses
    public getCategory () {
        return this.category;
    }
    public getToggleId () {
        return this.locked ? null : this.toggleId;
    }
    public getName () {
        return this.name;
    }
    public getDescription () {
        return this.description;
    }
    // Builder
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
    public initPlayer (func: (playerId: string, player: Player) => void) {
        this.playerSpawn = func;
        return this;
    }
    public initClear (func: (playerId: string) => void) {
        this.playerLeave = func;
        return this;
    }
    public onModuleDisable(func: () => void) {
        this.onDisable = func;
        return this;
    }
    public lockModule () {
        this.locked = true;
        return this;
    }
    public register() {
        Module.moduleList.push(this);
    }
    public enableModule () {
        if (this.enabled || this.locked) return;
        this.enabled = true;
        if (this.playerSpawn) {
            for (const player of Module.allWorldPlayers) {
                this.playerSpawn(player.id, player);
            }
        }
        this.onEnable();
    }
    public disableModule () {
        if (!this.enabled || this.locked) return;
        this.enabled = false;
        this.onDisable();
    }
    public static getTickDataMap ({ id }: Player) {
        return tickDataMap.get(id);
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
        console.log("The server is running with §b§lMatrix §gAntiCheat§r | Made by jasonlaubb");
        // Initialize the command system
        Command.initialize();
        world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
            if (!initialSpawn) return;
            Module.currentPlayers.push(player);
            for (const module of Module.moduleList) {
                if (!module.enabled || !module.playerSpawn) continue;
                try {
                    module.playerSpawn(player.id, player);
                } catch (error) {
                    Module.sendError(error as Error);
                }
            }
        });
        world.afterEvents.playerLeave.subscribe(({ playerId }) => {
            Module.currentPlayers = Module.currentPlayers.filter(({ id }) => id != playerId);
            for (const module of Module.moduleList) {
                if (!module.enabled || !module.playerLeave) continue;
                try {
                    module.playerLeave(playerId);
                } catch (error) {
                    Module.sendError(error as Error);
                }
            }
        });
        for (const module of Module.moduleList) {
            if (module.locked || Module.config.modules[module.toggleId] === true) {
                module.onEnable();
                module.enabled = true;
            }
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
                try {
                    event.moduleFunction();
                } catch (error) {
                    Module.sendError(error as Error);
                }
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
/**
 * @author jasonlaubb
 * @description The command handler of Matrix AntiCheat.
 * @license AGPL-3.0
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat/
 * @warn You are not allowed to copy or modify this system unless you have declared yours as a fork from us.
 */
class Command {
    public constructor() {}
    private static registeredCommands: Command[] = [];
    // The regular expression for the command.
    private static readonly optionMatchRegExp = /^(\w+)\s+("([^"]+)")?\s+([\w\s]+)?\s+([\d]+)?$/;
    public static readonly OptionInputType: OptionTypes;
    public availableId: string[] = [];
    public minLevel = 0;
	public requiredOption: InputOption[] = [];
	public optionalOption: InputOption[] = [];
	public executeFunc?: (player: Player, ...args: (string | number | Player | boolean | undefined)[]) => Promise<void>;
	public subCommands?: Command[];
    public setName(name: string) {
        this.availableId.push(name);
        return this;
    }
    public setAliases(...aliases: string[]) {
        this.availableId.push(...aliases);
        return this;
    }
    public setMinPermissionLevel (level: number) {
        this.minLevel = level;
        return this;
    }
    public addOption(name: RawMessage, description: RawMessage, type: OptionTypes, typeInfo?: undefined | TypeInfo, optional = false) {
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
        return this;
	}
	public onExecute (executeFunc: (player: Player, ...args: (string | number | Player | boolean | undefined)[]) => Promise<void>) {
		this.executeFunc = executeFunc;
        return this;
	}
    public register() {
        Command.registeredCommands.push(this);
    }
    public static initialize () {
		Player.prototype.runChatCommand = function (commandString: string) {
			const args = commandString.trim().match(Command.optionMatchRegExp)?.slice(1);
			if (!args) {
				this.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: "commandsynax.empty", with: [] }));
				return;
			};
			const command = Command.searchCommand(args[0]);
            if (!command) {
                this.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: "commandsynax.unknown", with: [args[0]] }));
                return;
            }
            if (Module.config.command[command.availableId[0]] === false) {
                this.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: "commandsynax.disabled", with: [command.availableId[0]] }));
                return;
            }
            if (this.getPermissionLevel() < command.minLevel) {
                this.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: "commandsynax.permission", with: [command.minLevel.toString()] }));
                return;
            }
			if (command?.subCommands) {
                if (args.length < 2) {
                    this.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: "commandsynax.missing.subcommand", with: [] }));
                } else {
                    const targetSubCommand = command.subCommands.find((subCommand) => subCommand.availableId.includes(args[1]));
                    if (targetSubCommand) {
                        const argValues = Command.getArgValue(args, targetSubCommand, this);
                        if (argValues === null) return;
                        if (targetSubCommand?.executeFunc) {
                            targetSubCommand.executeFunc(this, ...args.slice(2)).catch((error) => Module.sendError(error as Error));
                        }
                    } else {
                        this.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: "commandsynax.unknownsubcommand", with: [args[1]] }));
                    }
                }
			} else {
				const argValues = Command.getArgValue(args, command, this);
				if (argValues === null) return;
				if (command?.executeFunc) {
					command.executeFunc(this, ...args.slice(1)).catch((error) => Module.sendError(error as Error));
				}
			}
		}
        world.beforeEvents.chatSend.subscribe((event) => {
            // Checks if player is trying to use a command.
            const isCommand = event.message.match(/^(\-|\!|\#|\$|\.|\=|\+|\?)[a-zA-Z]+(\s{1,2}\S+)*\s*$/g);
            if (isCommand) {
                event.cancel = true;
                system.run(() => event.sender.runChatCommand(event.message));
                return;
            }
		});
    }
    public sendErrorToPlayer (player: Player, error: Error) {
        player.sendMessage(
            fastText()
                .addTran("error.happened")
                .endline()
                .addTran("error.name", error.name)
                .endline()
                .addTran("error.description", error.message)
                .endline()
                .addTran("error.stack", error?.stack ?? "§cUnknown§r")
                .build()
        );
    }
	private static getArgValue (args: string[], command: Command, player: Player): (string | number | Player | boolean | undefined)[] | null {
        if (args.length == 0) return [];
        const values = [];
        let currentIndex = 0;
        for (const option of command.requiredOption) {
            const arg = args[currentIndex];
            currentIndex++;
            if (!arg) {
                player.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: "commandsynax.missing", with: { rawtext: [option.name] } }));
                player.sendMessage(rawtextTranslate("commandsynax.tips"));
                return null;
            }
            const insideArg = args[currentIndex];
            const beforeArgs = args.slice(0, currentIndex).join(" ");
            const afterArgs = args.slice(currentIndex + 1).join(" ");
            const value = Command.parseOption(player, option, arg, beforeArgs, insideArg, afterArgs);
            if (value === null) return null;
            values.push(value);
        }
        for (const option of command.optionalOption) {
            const arg = args[currentIndex];
            currentIndex++;
            if (!arg) {
                values.push(undefined);
                continue;
            };
            const insideArg = args[currentIndex];
            const beforeArgs = args.slice(0, currentIndex).join(" ");
            const afterArgs = args.slice(currentIndex + 1).join(" ");
            const value = Command.parseOption(player, option, arg, beforeArgs, insideArg, afterArgs);
            if (value === null) return null;
            values.push(value);
        }
		return args;
	}
    private static parseOption (player: Player, option: InputOption, arg: string, beforeArgs: string, insideArg: string, afterArgs: string) {
        switch (option.type) {
            case "string": {
                if (option?.typeInfo) {
                    if (option.typeInfo.lowerLimit && arg.length < option.typeInfo.lowerLimit) {
                        Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.string.low", option.name, beforeArgs, insideArg, afterArgs, option.typeInfo.lowerLimit.toString());
                        return null;
                    }
                    if (option.typeInfo.upperLimit && arg.length > option.typeInfo.upperLimit) {
                        Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.string.high", option.name, beforeArgs, insideArg, afterArgs,  option.typeInfo.upperLimit.toString());
                        return null;
                    }
                }
                return arg;
            }
            case "boolean": {
                switch (arg) {
                    case "true":
                    case "1":
                    case "on":
                    case "enable": {
                        return true;
                    }
                    case "false":
                    case "0":
                    case "off":
                    case "enable": {
                        return false;
                    }
                    default: {
                        Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.boolean", option.name, beforeArgs, insideArg, afterArgs);
                        return null;
                    }
                }
            }
            case "number":
            case "integer": {
                const number = parseInt(arg);
                const notNumber = Number.isNaN(number);
                if (option.type == "integer" && (notNumber || !Number.isInteger(arg))) {
                    Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.integer.nan", option.name, beforeArgs, insideArg, afterArgs);
                    return null;
                }
                if (notNumber) {
                    Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.number.nan", option.name, beforeArgs, insideArg, afterArgs);
                    return null;
                }
                if (option?.typeInfo) {
                    if (option.typeInfo?.lowerLimit && number < option.typeInfo.lowerLimit) {
                        Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.number.low", option.name, beforeArgs, insideArg, afterArgs, option.typeInfo.lowerLimit.toString());
                        return null;
                    }
                    if (option.typeInfo?.upperLimit && number > option.typeInfo.upperLimit) {
                        Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.number.high", option.name, beforeArgs, insideArg, afterArgs, option.typeInfo.upperLimit.toString());
                        return null;
                    }
                }
                return number;
            }
            case "purecode":
            case "code": {
                if (arg.length != option.typeInfo?.lowerLimit) {
                    Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.code", option.name, beforeArgs, insideArg, afterArgs, option.typeInfo!.lowerLimit!.toString());
                    return null;
                }
                if (option.type == "purecode" && !(/$[a-zA-Z0-9]+^/g).test(arg)) {
                    Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.purecode", option.name, beforeArgs, insideArg, afterArgs);
                    return null;
                }
                return arg;
            }
            case "choice": {
                if (option.typeInfo?.arrayRange && !option.typeInfo.arrayRange.includes(arg)) {
                    Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.choice", option.name, beforeArgs, insideArg, afterArgs, option.typeInfo.arrayRange.join(", "));
                    return null;
                }
                return arg;
            }
            case "player": {
                const targetName = arg.startsWith("@") ? arg.substring(1) : arg;
                const worldPlayers = world.getPlayers({ name: targetName });
                if (worldPlayers.length == 0) {
                    Command.sendSyntaxErrorMessage(player, "commandsynax.syntax.player", option.name, beforeArgs, insideArg, afterArgs);
                    return null;
                }
                return worldPlayers[0];
            }
        }
    }
    private static sendSyntaxErrorMessage (player: Player, key: string, optionName: RawMessage, beforeArgs: string, insideArg: string, afterArgs: string, extraInfo?: string) {
        const stringInput = [optionName, { text: beforeArgs }, { text: insideArg }, { text: afterArgs }];
        if (extraInfo) stringInput.push({ text: extraInfo })
        player.sendMessage(rawtext({ text: "§bMatrix §7> §c" }, { translate: key, with: { rawtext: stringInput } }));
        player.sendMessage(rawtextTranslate("commandsynax.tips"));
    }
	private static searchCommand (command: string) {
		command = command.toLowerCase();
		return Command.registeredCommands.find((commandClass) => commandClass.availableId.includes(command));
	}
}
// The class that store the tick event that is handled by the Module class
class IntegratedSystemEvent {
    private func: Function;
    // For state wether include admin or not.
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
	name: RawMessage;
	description: RawMessage;
	type: OptionTypes;
	typeInfo?: TypeInfo;
}
type OptionTypes = "string" | "number" | "integer" | "boolean" | "player" | "choice" | "code" | "purecode";
export { Module, Command };
// Start the AntiCheat
Module.ignite();
// Import the system
import "./program/system/moderation";
import "./program/tickDataMap";
// Import the modules
import "./program/anticheat/firewall";
// Import the commands
import "./program/command/about";