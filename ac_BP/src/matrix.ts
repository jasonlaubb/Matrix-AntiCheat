import { system } from "@minecraft/server";
import { ModuleRegisterData, worldAfterOption, worldBeforeOption, tickOption, runTimeOption } from "./assets/moduleBuilder";

class Module {
	private constructor () {};
	private static beforeDataBase: { [key: string]: worldBeforeOption[] } = {};
	private static afterDataBase: { [key: string]: worldAfterOption[] } = {};
	private static intervalDataBase: { [key: number]: tickOption[] } = {};
	private static runtimeDataBase: { [key: number]: runTimeOption[] } = {};
	private static lanuchedBeforeEvents: { [key: string]: worldBeforeOption[] } = {};
	private static lanuchedAfterEvents: { [key: string]: worldAfterOption[] } = {};
	private static lanuchedIntervalEvents: { [key: number]: tickOption[] } = {};
	private static lanuchedRuntimeEvents: { [key: number]: runTimeOption[] } = {};
	public static register (module: ModuleRegisterData) {
		// Filter out the settings
		if (module.worldBeforeEvents.length > 0) {
			for (const moduleEvent of module.worldBeforeEvents) {
				this.beforeDataBase[moduleEvent.listener] ??= [] as worldBeforeOption[];
				this.beforeDataBase[moduleEvent.listener].push(moduleEvent);
			}
		}
		if (module.worldAfterEvents.length > 0) {
			for (const moduleEvent of module.worldAfterEvents) {
				this.afterDataBase[moduleEvent.listener] ??= [] as worldAfterOption[];
				this.afterDataBase[moduleEvent.listener].push(moduleEvent);
			}
		}
		if (module.intervalEvents.length > 0) {
			for (const moduleEvent of module.intervalEvents) {
				this.intervalDataBase[moduleEvent.interval] ??= [] as tickOption[];
				this.intervalDataBase[moduleEvent.interval].push(moduleEvent);
			}
		}
		if (module.runtimeEvents.length > 0) {
			for (const moduleEvent of module.runtimeEvents) {
				this.runtimeDataBase[moduleEvent.interval] ??= [] as runTimeOption[];
				this.runtimeDataBase[moduleEvent.interval].push(moduleEvent);
			}
		}
	}
	public static moduleSetup () {
		const requiredIntervals: number[] = this.findUniqueIntervalTypes(this.intervalDataBase);
		for (const interval of requiredIntervals) {
			system.runInterval(() => {

			}, interval);
		}
	}
	private static findUniqueIntervalTypes (database: { [key: number]: tickOption[] }) {
		const all = Object.keys(database).map((a) => Number(a));
		const unique = Array.from(new Set(all));
		return unique;
	}
}