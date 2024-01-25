import lang from "./Languages/lang"
import { defaultLy, keys } from "../Modules/Modules"
import { world } from "@minecraft/server"

export function helpList (p: string): string {
    return [
        lang("-help.help"),
        lang("-help.toggles"),
        lang("-help.toggle"),
        lang("-help.op"),
        lang("-help.deop"),
        lang("-help.passwords"),
        lang("-help.flagmode"),
        lang("-help.rank"),
        lang("-help.rankclear"),
        lang("-help.defaultrank"),
        lang("-help.showallrank"),
        lang("-help.ban"),
        lang("-help.unban"),
        lang("-help.unbanremove"),
        lang("-help.unbanlist"),
        lang("-help.freeze"),
        lang("-help.unfreeze"),
        lang("-help.vanish"),
        lang("-help.unvanish"),
        lang("-help.invcopy"),
        lang("-help.invsee"),
        lang("-help.echestwipe"),
        lang("-help.lockdowncode"),
        lang("-help.lockdown"),
        lang("-help.unlock"),
        lang("-help.adminchat"),
        lang("-help.lang"),
        lang("-help.langlist"),
        lang("-help.borderSize"),
        "matrixui - open the ui (beta)"
    ].map(des => "§g" + p + des).join("\n")
}

export function toggleList (p: string): string {
    return validModules.map((module) => `§l§7(${(world.getDynamicProperty(module) ?? defaultLy(module) == true ? "§aenabled" : "§cdisabled")}§7)§r §g${p}toggle ${module} <enable/disable> - ${lang("-toggles.toggle")} ${module} ${lang("-toggles.module")}`).join("\n")
}

export const validModules: string[] = [
    "chatRank",
    "dimensionLock",
    ...keys
]
