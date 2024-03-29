/** @author jasonlaubb */
export default {
    "-help.helpCDlist": "Help command list:",
    "-help.help": "help - Show this help message",
    "-help.toggles": "toggles - Show all module's toggle",
    "-help.toggle": "toggle <module> <enable/disable> - Toggle a module",
    "-help.op": "op <player> - Give player admin permission",
    "-help.deop": "deop <player> - Remove player's admin permission",
    "-help.passwords": "passwords <oldPassword> <newPassword> - Change the password",
    "-help.flagmode": "flagmode <all/tag/bypass/admin> - Change the flag mode",
    "-help.rank": "rank <set/add/remove> <player> <rank> - Change the rank on a player",
    "-help.rankclear": "rankclear <player> - Clear all rank on a player",
    "-help.defaultrank": "defaultrank <rank> - Change the default rank",
    "-help.showallrank": "showallrank <true/false> - Show all rank in chat",
    "-help.ban": "ban <player> <reason> <timeRegax/forever> - Ban a player",
    "-help.unban": "unban <player> - Unban a player",
    "-help.unbanremove": "unbanremove <player> - Remove a player from unban queue",
    "-help.unbanlist": "unbanlist - Show all player in unban queue",
    "-help.freeze": "freeze <player> - Freeze a player",
    "-help.unfreeze": "unfreeze <player> - Unfreeze a player",
    "-help.vanish": "vanish - Vanish yourself",
    "-help.unvanish": "unvanish - Unvanish yourself",
    "-help.invcopy": "invcopy <player> - Copy a player's inventory to yours",
    "-help.invsee": "invsee <player> - View a player's inventory",
    "-help.echestwipe": "echestwipe <player> - Wipe a player's ender chest",
    "-help.lockdowncode": "lockdowncode <get/set/random> <set: code>/[random: length] - Do with the lockdown code",
    "-help.lockdown": "lockdown <code> - Lockdown the server with a code",
    "-help.unlock": "unlock <code> - Unlock the server",
    "-help.adminchat": "adminchat - switch between admin channel and public channel",
    "-help.lang": "lang <language> - Change the language",
    "-help.langlist": "langlist - Show all language",

    "-about.line1": "Matrix is a minecraft bedrock anticheat that is based on @minecraft API",
    "-about.version": "Version",
    "-about.author": "Author",

    "-toggles.toggle": "Toggle",
    "-toggles.module": "module",
    "-toggles.toggleList": "Toggle list:",
    "-toggles.unknownModule": "Unknown module, try %atoggles",
    "-toggles.toggleChange": "%a module has been %bd",
    "-toggles.unknownAction": "Unknown action, please use enable/disable only",
    "-toggles.already": "This module is %ad already",

    "-op.hasbeen": "%a has been opped by %b",
    "-op.please": "Please enter the password",
    "-op.now": "You are now admin",
    "-op.wrong": "Wrong password",
    "-op.wait": "Please wait %a more seconds before you try again",

    "-deop.lockdown": "The server is in lockdown mode",
    "-deop.notadmin": "%a is not admin",
    "-deop.hasbeen": "%a has been deopped by %b",

    "-passwords.oldnew": "Please enter the old password and the new password",
    "-passwords.wrong": "Wrong password",
    "-passwords.changed": "Password has been changed",

    "-flagmode.unknown": "Unknown action, please use all/bypass/admin/tag/none only",
    "-flagmode.changed": "Flag mode has been changed to %a",

    "-rank.unknownAction": "Unknown action, please use set/add/remove only",
    "-rank.enter": "Please enter the rank",
    "-rank.hasset": "%a's rank has been set to %b",
    "-rank.hasadd": "%a's rank has been added %b",
    "-rank.already": "%a already has %b §r§crank",
    "-rank.hasremove": "%a's rank has been removed",
    "-rank.norank": "%a doesn't have %b §r§c rank",
    "-rank.empty": "%a doesn't have any rank",

    "-rankclear.has": "%a's rank has been cleared",
    "-rankclear.empty": "%a doesn't have any rank",

    "-defaultrank.enter": "Please enter the rank",
    "-defaultrank.has": "Default rank has been set to %a",

    "-showallrank.unknown": "Unknown action, please use true/false only",
    "-showallrank.has": "Show all rank has been set to %a",

    "-ban.self": "You can't ban yourself",
    "-ban.admin": "You can't ban an admin",
    "-ban.reason": "Please enter the reason",
    "-ban.time": "Please enter the time, example: 1d20h30m40s",
    "-ban.has": "%a has been banned by %b",

    "-unban.self": "You can't unban yourself",
    "-unban.notban": "%a is not banned",
    "-unban.add": "%a has been joined to the unban queue",

    "-unbanremove.not": "%a is not in unban queue",
    "-unbanremove.yes": "%a has been removed from unban queue",

    "-unbanlist.none": "There is no player in unban queue",
    "-unbanlist.list": "Unban list",

    "-freeze.self": "You can't freeze yourself",
    "-freeze.admin": "You can't freeze an admin",
    "-freeze.has": "%a has been frozen by %b",
    "-freeze.already": "%a is already frozen",

    "-unfreeze.self": "You can't unfreeze yourself",
    "-unfreeze.not": "%a is not frozen",
    "-unfreeze.has": "%a has been unfrozen by %b",
    "-unfreeze.admin": "You can't unfreeze an admin",

    "-mute.self": "You can't mute yourself",
    "-mute.admin": "You can't mute an admin",
    "-mute.has": "%a has been muted by %b",
    "-mute.already": "%a is already muted",

    "-unmute.self": "You can't unmute yourself",
    "-unmute.not": "%a is not muted",
    "-unmute.has": "%a has been unmuted by %b",
    "-unmute.admin": "You can't unmute an admin",

    "-vanish.has": "You are now vanished",  
    "-vanish.out": "You are now no longer vanished",

    "-invcopy.self": "You can't copy your own inventory",
    "-invcopy.not": "Copied inventory from %a",

    "-invsee.self": "You can't view your own inventory",
    "-invsee.of": "Inventory of %a",

    "-echestwipe.self": "You can't wipe your own ender chest",
    "-echestwipe.admin": "You can't wipe an admin's ender chest",
    "-echestwipe.has": "Ender chest of %a has been wiped by %b",

    "-lockdowncode.unknown": "Please enter the action you want",
    "-lockdowncode.get": "Lockdown code: %a",
    "-lockdowncode.enter": "Please enter the code",
    "-lockdowncode.set": "Sucessfully changed lockdown code to %a",
    "-lockdowncode.number": "The code length should be a number",
    "-lockdowncode.length": "Please enter the code length between 1 and 128",
    "-lockdowncode.random": "Sucessfully random a lockdown code - %a",
    "-lockdowncode.unknownAction": "Unknown action, please use get/set/random only",

    "-lockdown.enter": "Please enter the code",
    "-lockdown.wrong": "Wrong code",
    "-lockdown.already": "The server has been turned to lockdown mode by %a",
    "-lockdown.has": "The server is now in lockdown mode",

    "-unlock.not": "Lockdown hasn't enabled yet",
    "-unlock.has": "Lockdown has been disabled by %a",

    "-adminchat.has": "You are now in admin channel",
    "-adminchat.out": "You are now in public channel",

    "-lang.enter": "Please enter the language",
    "-lang.unknown": "Unknown language, try %alanglist",
    "-lang.has": "Language has been changed to %a",

    "-langlist.list": "Language list:",

    ".CommandSystem.no_permission": "You don't have permission to use this command",
    ".CommandSystem.unknown_command": "Unknown command. Type \"help\" for help.",
    ".CommandSystem.command_disabled": "This command is disabled",
    ".CommandSystem.command_disabled_reason": "You are not an admin to use this command",
    ".CommandSystem.no_permisson": "You don't have enough permission to use this command",
    ".CommandSystem.no_player": "Please specify the player",
    ".CommandSystem.unknown_player": "Unknown player",
    ".CommandSystem.unknown": "Unknown command, try %ahelp",
    ".CommandSystem.about": "Use -about to see more information",

    ".Util.kicked": "You have been kicked",
    ".Util.reason": "Reason",
    ".Util.noreason": "No reason provided",
    ".Util.unknown": "Unknown",
    ".Util.has_failed": "has failed",
    ".Util.formkick": "%a is automatically kicked from the game",
    ".Util.formban": "%a is automatically banned from the game",

    ".banHandler.banned": "You have been banned!",
    ".banHandler.format": "§c§lYour have been banned!\n§r§7Time Left:§c %a\n§7Reason: §c%b§r\n§7By: §c%c",

    ".AdminChat.adminchat": "adminchat",

    ".ChatHandler.muted": "You are muted!",

    ".dimensionLock.stop": "You are not allowed to go to other dimensions!",

    ".Spam.slowdown": "Please send messages slowly",
    ".Spam.repeated": "You cannot send the same message again",
    ".Spam.kicked": "§c%a§g has been kicked for spamming",
    ".Spam.filter": "Your message contains a filtered word",
    ".Spam.long": "Your message is too long",
    ".Spam.blacklist": "Blacklisted message, warning",
    ".Spam.kickedBlacklist": "§c%a§g has been kicked for saying a blacklisted message",

    ">distance": "Distance",
    ">yReach": "yReach",
    ">HitLength": "HitLength",
    ">Angle": "Angle",
    ">Click Per Second": "Click Per Second",
    ">RotSpeed": "RotSpeed",
    ">RotSpeedX": "RotSpeedX",
    ">RotSpeedY": "RotSpeedY",
    ">Type": "Type",
    ">Pos": "Pos",
    ">PosDeff": "PosDeff",
    ">AttackTime": "AttackTime",
    ">UsingItem": "UsingItem",
    ">Moving": "Moving",
    ">Container": "Container",
    ">velocityY": "velocityY",
    ">velocityXZ": "velocityXZ",
    ">playerSpeed": "playerSpeed",
    ">Mph": "Mph",
    ">Reach": "Reach",
    ">Mode": "Mode",
    ">Break": "Break",
    ">Place": "Place",
    ">GameMode": "GameMode",
    ">illegalLength": "illegalLength",
    ">illegalRegax": "illegalRegax",
    ">Length": "Length",
    ">Block": "Block",
    ">RotationX": "RotationX",
    ">RotationY": "RotationY",
    ">relative": "relative",
    ">Delay": "Delay",
    ">typeId": "typeId",
    ">nameLength": "nameLength",
    ">CentreDis": "CentreDis",
    ">ItemType": "ItemType",
    ">ItemNameLength": "ItemNameLength",
    ">ItemLore": "ItemLore",
    ">EnchantLevel": "EnchantLevel",
    ">EnchantConflict": "EnchantConflict",
    ">ItemEnchantAble": "ItemEnchantAble",
    ">ItemEnchantRepeat": "ItemEnchantRepeat",
    ">ItemAmount": "ItemAmount",
    ">ItemTag": "ItemTag",
    ">Amount": "Amount",
    ">Ratio": "Ratio",
    ">Limit": "Limit",
    ">BlockPerSecond": "BPS",
    // Version 3.0.0 or upper version
    ".Util.unfair": "Unfair advantage of %a",
    ".Util.by": "(Immediate behavioral defense)",
    ".Util.operator": "By",
    ".Bot.by": "(Bot defensive action)",
    ".Spam.by": "(Anti spam automatic action)",
    ".Spam.spamming": "Spamming chat",
    ".Spam.blacklisted": "Blacklisted message",
    ".Bot.waitUI": "For security reason, you cannot chat untill you finished verify process. Please wait until the verify ui be shown",
    ".Bot.expired": "Expired verification",
    ".Bot.ui": "§a[This server is protected by Matrix AntiCheat]\n§gYou need to verify if you're not a bot §7(%a/%b)§g\nYou have §e%c§gseconds left\nEnter the code §e§l%d§r§g below",
    ".Bot.title": "Anti Bot Verification",
    ".Bot.failed": "Verification failed",
    ".Bot.ok": "You have been verified successfully",
    ".Border.reached": "You cannot access that location, you have reached the world border.",
    ".Border.outside": "You cannot access a location which is outside the world border.",
    ".Border.interact": "You cannot interact with a block or entity which is outside the world border.",
    "-borderSize.enter": "Please enter a border size.",
    "-borderSize.notANum": "Not a number!",
    "-borderSize.between": "Border size should between 100 to 1M!",
    "-borderSize.ok": "Sucessfully changed world border size to %a",
    "-help.borderSize": "borderSize <size/default> - Change the world border size",
    ".UI.exit": "Exit",
    ".UI.i": "Admin GUI",
    ".UI.i.a": "Moderate Players",
    ".UI.i.b": "Settings",
}
