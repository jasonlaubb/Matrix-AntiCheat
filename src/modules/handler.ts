import config from "../data/config";
import { ModuleStateObject } from "../data/interface";
import { AntiCheatModule } from "../lib/matrix";
import { world } from "@minecraft/server";
// import modules and utilities from files
import antiFly from "./anticheat/movement/fly";

export const modules: { [key: string]: AntiCheatModule } = {
    antiFly,
}
export const utilities: { [key: string]: AntiCheatModule } = {

}

export function checkState (module: string): boolean | null {
    return world.getDynamicProperty(module) as boolean ?? (Object.values(config.modules).find(({ id }) => id == module) as ModuleStateObject)?.enabled ?? (config.utility as { [key: string]: ModuleStateObject })[module].enabled ?? null
}
export function switchModule (module: string, state: boolean) {
    (config.utility as { [key: string]: ModuleStateObject })[module] ? (state ? utilities[module].switch().on() : utilities[module].switch().off()) : (state ? (modules[module].switch().on()) : modules[module].switch().off())
}

export function worldInitializeAfterEvent () {
    const keys = Object.keys({...modules, ...utilities})
    for (const module of keys) {
        if (checkState(module)) switchModule(module, true)
    }
}