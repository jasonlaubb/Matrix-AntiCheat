import config from "../data/config";
import { AfterEventString, BeforeEventString } from "../data/eventString";
import { RawtextBuilder } from "./rawtextBuilder";
import { Player } from "@minecraft/server";
export default class ModuleBuilder {
	public constructor (id: string) {
		this.moduleRegisterData.id = id;
	};
	private moduleRegisterData: ModuleRegisterData = {
		name: new RawtextBuilder().addTranslate("not.defined"),
		description: new RawtextBuilder().addTranslate("not.defined"),
		experimental: false,
		intervalEvents: [],
		runtimeEvents: [],
		defineVars: {},
		worldBeforeEvents: [],
		worldAfterEvents: [],
		enablePlayerDataBase: false,
		id: "Undefined",
	};
	public subscribeInterval (tickInterval: number, onTick: (config: Config) => void) {
		this.moduleRegisterData.intervalEvents.push({
			interval: tickInterval,
			onTick: onTick,
		})
		return this;
	}
	public subscribeRuntime (tickInterval: number, targetPlayers: playerSelectorOption, onTick: (player: Player, config: Config) => void) {
		this.moduleRegisterData.runtimeEvents.push({
			interval: tickInterval,
			targetPlayers: targetPlayers,
			onTick: onTick,
		})
		return this;
	}
	public subscribeBeforeEvent (listener: BeforeEventString, targetPlayers: playerSelectorOption, onTrigger: (events: any, config: Config) => void) {
		this.moduleRegisterData.worldBeforeEvents.push({
			listener: listener,
			targetPlayers: targetPlayers,
			onTrigger: onTrigger,
		})
		return this;
	}
	public subscribeAfterEvent (listener: AfterEventString, targetPlayers: playerSelectorOption, onTrigger: (events: any, config: Config) => void) {
		this.moduleRegisterData.worldAfterEvents.push({
			listener: listener,
			targetPlayers: targetPlayers,
			onTrigger: onTrigger,
		})
		return this;
	}
	/** @warn Use translation key */
	public setName (name: string) {
		this.moduleRegisterData.name = new RawtextBuilder().addTranslate(name);
		return this;
	}
	/** @warn Use translation key */
	public setDescription (description: string) {
		this.moduleRegisterData.description = new RawtextBuilder().addTranslate(description);
		return this;
	}
	/** @warn Use translation key */
	public setExperimental () {
		this.moduleRegisterData.experimental = true;
		return this;
	}
	public setDefineVars (initData: any) {
		this.moduleRegisterData.defineVars = initData;
		return this;
	}
	public setPlayerDataBase (init: (player: Player) => any) {
		this.moduleRegisterData.initDataBase = init;
		this.moduleRegisterData.enablePlayerDataBase = true;
		return this;
	}
	public parse () {
		return this.moduleRegisterData;
	}
}
export interface ModuleRegisterData {
	id: string;
	name: RawtextBuilder;
	description: RawtextBuilder;
	experimental: boolean;
	intervalEvents: tickOption[];
	runtimeEvents: runTimeOption[];
	defineVars: any;
	worldBeforeEvents: worldBeforeOption[];
	worldAfterEvents: worldAfterOption[];
	initDataBase?: (player: Player) => any;
	enablePlayerDataBase: boolean;
}
export interface tickOption {
	interval: number;
	onTick: (config: Config) => void;
}
export interface runTimeOption {
	interval: number;
	targetPlayers: playerSelectorOption;
	onTick: (player: Player, config: Config) => void;
}
export interface worldBeforeOption {
	listener: BeforeEventString,
	targetPlayers: playerSelectorOption,
	onTrigger: (events: any, config: Config) => void;
}
export interface worldAfterOption {
	listener: AfterEventString,
	targetPlayers: playerSelectorOption,
	onTrigger: (events: any, config: Config) => void;
}
export interface playerSelectorOption {
	excludeAdmin: boolean;
	excludeFlyableGameMode: boolean;
}
type Config = typeof config;