import autoClicker from "./Combat/Auto Clicker"
import killAura from "./Combat/Kill Aura"
import reach from "./Combat/Reach"
import aim from "./Combat/Aim"
import spammer from "./Misc/Spammer"
import fly from "./Movement/Fly"
import phase from "./Movement/Phase"
import speed from "./Movement/Speed"
import noSlow from "./Movement/NoSlow"
import motion from "./Movement/Motion"
import blink from "./Movement/Blink"
import timer from "./Movement/Timer"
import movement from "./Movement/Movement"
import nuker from "./World/Nuker"
import scaffold from "./World/Scaffold"
import tower from "./World/Tower"
import cbe from "./World/CommandBlockExplolit"
import breaker from "./World/Breaker"
import blockReach from "./Player/BlockReach"
import illegalItem from "./Player/Illegal Item"
import nameSpoof from "./Player/NameSpoof"
import operator from "./Player/Operator"
import auto from "./Player/Auto"
import fastUse from "./Player/FastUse"
import gameMode from "./Player/GameMode"
import { c } from "../Assets/Util"
import { world } from "@minecraft/server"

interface toggleHandler {
    enable: () => void
    disable: () => void
}

export const antiCheatModules: { [key: string]: toggleHandler } = {
    "antiReach": reach,
    "antiKillAura": killAura,
    "antiAutoClicker": autoClicker,
    "antiSpammer": spammer,
    "antiFly": fly,
    "antiMotion": motion,
    "antiMovement": movement,
    "antiTimer": timer,
    "antiBlink": blink,
    "antiBreaker": breaker,
    "antiPhase": phase,
    "antiSpeed": speed,
    "antiNuker": nuker,
    "antiGameMode": gameMode,
    "antiTower": tower,
    "antiFastUse": fastUse,
    "antiNoSlow": noSlow,
    "antiBlockReach": blockReach,
    "antiAim": aim,
    "antiScaffold": scaffold,
    "antiIllegalItem": illegalItem,
    "auto": auto,
    "antiNameSpoof": nameSpoof,
    "antiOperator": operator,
    "antiCBE": cbe
}
export const keys = Object.keys(antiCheatModules)

export function getModuleState (module: string) {
    const config = c ()
    if (!keys.includes(module)) return undefined
    //@ts-expect-error
    return world.getDynamicProperty(module) as boolean ?? config[module]
}

export async function moduleStart () {
    for (const module of keys) {
        if (getModuleState(module) !== true) continue
        antiCheatModules[module].enable()
    }

    return true
}