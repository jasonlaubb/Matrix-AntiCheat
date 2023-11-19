import lang from "./Languages/lang"
export function helpList (p: string): string {
    return [
        `§g${p}`+lang("-help.help"),
        `§g${p}`+lang("-help.toggles"),
        `§g${p}`+lang("-help.toggle"),
        `§g${p}`+lang("-help.op"),
        `§g${p}`+lang("-help.deop"),
        `§g${p}`+lang("-help.passwords"),
        `§g${p}`+lang("-help.flagmode"),
        `§g${p}`+lang("-help.rank"),
        `§g${p}`+lang("-help.rankclear"),
        `§g${p}`+lang("-help.defaultrank"),
        `§g${p}`+lang("-help.showallrank"),
        `§g${p}`+lang("-help.ban"),
        `§g${p}`+lang("-help.unban"),
        `§g${p}`+lang("-help.unbanremove"),
        `§g${p}`+lang("-help.unbanlist"),
        `§g${p}`+lang("-help.freeze"),
        `§g${p}`+lang("-help.unfreeze"),
        `§g${p}`+lang("-help.vanish"),
        `§g${p}`+lang("-help.unvanish"),
        `§g${p}`+lang("-help.invcopy"),
        `§g${p}`+lang("-help.invsee"),
        `§g${p}`+lang("-help.echestwipe"),
        `§g${p}`+lang("-help.lockdowncode"),
        `§g${p}`+lang("-help.lockdown"),
        `§g${p}`+lang("-help.unlock"),
        `§g${p}`+lang("-help.adminchat"),
        `§g${p}`+lang("-help.lang"),
        `§g${p}`+lang("-help.langlist")
    ].join("\n")
}

export function toggleList (p: string): string {
    const moduleList = validModules
    return moduleList.map((module) => `§g${p}toggle ${module} <enable/disable> - ${lang("-toggles.toggle")} ${module} ${lang("-toggles.module")}`).join("\n")
}

export const validModules: string[] = [
    "chatRank",
    "dimensionLock",
    "antiReach",
    "antiKillAura",
    "antiAutoClicker",
    "antiSpam",
    "antiFly",
    "antiPhase",
    "antiSpeed",
    "antiNuker",
    "antiSurround",
    "antiTower",
    "antiNoSlow",
    "antiBlockReach",
    "antiAim",
    "antiScaffold",
    "antiIllegalItem",
    "antiNameSpoof",
    "antiOperator"
]