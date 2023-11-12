export function helpList (p: string): string {
    return [
        `§g${p}help - Show this help message`,
        `§g${p}toggles - Show all module's toggle`,
        `§g${p}toggle <module> <enable/disable>- Toggle a module`,
        `§g${p}op <player> - Give player admin permission`,
        `§g${p}deop <player> - Remove player's admin permission`,
        `§g${p}passwords <oldPassword> <newPassword> - Change the password`,
        `§g${p}rank <set/add/remove> <player> <rank> - Change the rank on a player`,
        `§g${p}defaultrank <rank> - Change the default rank`,
        `§g${p}showallrank <true/false> - Show all rank in chat`,
        `§g${p}ban <player> <time> <reason> - Ban a player`,
        `§g${p}unban <player> - Unban a player`,
        `§g${p}unbanremove <player> - Remove a player from unban queue`,
        `§g${p}unbanlist - Show all player in unban queue`,
        `§g${p}freeze <player> - Freeze a player`,
        `§g${p}unfreeze <player> - Unfreeze a player`
    ].join("\n")
}

export function toggleList (p: string): string {
    let list = []
    for (const module of validModules) {
        list.push(`§g${p}toggle ${module} <enable/disable> - Toggle ${module} module`)
    }
    return list.join("\n")
}

export const validModules: string[] = [
    "chatRank",
    "antiReach",
    "antiKillAura",
    "antiAutoClicker",
    "antiSpam",
    "antiFly",
    "antiPhase",
    "antiSpeed",
    "antiNuker",
    "antiNoSlow",
    "antiNofall"
]