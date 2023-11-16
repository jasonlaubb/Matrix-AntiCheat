export function helpList (p: string): string {
    return [
        `§g${p}help - Show this help message`,
        `§g${p}toggles - Show all module's toggle`,
        `§g${p}toggle <module> <enable/disable>- Toggle a module`,
        `§g${p}op <player> - Give player admin permission`,
        `§g${p}deop <player> - Remove player's admin permission`,
        `§g${p}passwords <oldPassword> <newPassword> - Change the password`,
        `§g${p}flagmode <all/tag/bypass/admin> - Change the flag mode`,
        `§g${p}rank <set/add/remove> <player> <rank> - Change the rank on a player`,
        `§g${p}rankclear <player> - Clear all rank on a player`,
        `§g${p}defaultrank <rank> - Change the default rank`,
        `§g${p}showallrank <true/false> - Show all rank in chat`,
        `§g${p}ban <player> <reason> <timeRegax/forever> - Ban a player`,
        `§g${p}unban <player> - Unban a player`,
        `§g${p}unbanremove <player> - Remove a player from unban queue`,
        `§g${p}unbanlist - Show all player in unban queue`,
        `§g${p}freeze <player> - Freeze a player`,
        `§g${p}unfreeze <player> - Unfreeze a player`,
        `§g${p}vanish - Vanish yourself`,
        `§g${p}unvanish - Unvanish yourself`,
        `§g${p}invcopy <player> - Copy a player's inventory to yours`,
        `§g${p}invsee <player> - View a player's inventory in a ui`,
        `§g${p}echestwipe <player> - Wipe a player's ender chest`,
        `§g${p}lockdowncode <get/set/random> <set: code>/[random: length] - Do with the lockdown code`,
        `§g${p}lockdown <code> - Lockdown the server with a code`,
        `§g${p}unlock <code> - Unlock the server`,
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
    "dimensionLock",
    "antiReach",
    "antiKillAura",
    "antiAutoClicker",
    "antiSpam",
    "antiFly",
    "antiPhase",
    "antiSpeed",
    "antiNuker",
    "antiTower",
    "antiNoSlow",
    "antiBlockReach",
    "antiAim",
    "antiScaffold"
]