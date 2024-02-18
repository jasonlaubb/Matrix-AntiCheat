import config from "../data/config";
import { ModuleOption } from "../data/interface";
import { AntiCheatModule } from "../lib/matrix";
import antiFly from "./anticheat/movement/fly";
import { world } from "@minecraft/server";

export const modules = {
    antiFly,
}

export function checkState (module: string): boolean {
    return world.getDynamicProperty(module) as boolean ?? (config.modules as { [key: string]: ModuleOption })[module].enabled
}

export function worldInitializeAfterEvent () {
    for (const module of Object.keys(modules)) {
        if (checkState(module)) {
            ((modules as { [key: string]: AntiCheatModule })[module]).switch().on()
        }
    }
}