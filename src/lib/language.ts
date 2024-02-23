import { world } from "@minecraft/server";
import en_US from "../data/langs/en_US";
import zh_TW from "../data/langs/zh_TW";
import ar from "../data/langs/ar";
import zh_CN from "../data/langs/zh_CN";
import vi_VN from "../data/langs/vi_VN";
import ro from "../data/langs/ro";
import it_IT from "../data/langs/it_IT";
import fr from "../data/langs/fr";
import ja_JP from "../data/langs/ja_JP";
// declare the dynamic language

import config from "../data/config"

let languageNow: string

export const getLang = () => languageNow

// All language exporter
export const langs: { [key: string]: { [key: string]: LangType | string } } = {
    "en_US": en_US,
    "zh_TW": zh_TW,
    "zh_CN": zh_CN,
    "ar": ar,
    "vi_VN": vi_VN,
    "ro": ro,
    "it_IT": it_IT,
    "fr": fr,
    "ja_JP": ja_JP
}

// when world initialized, update the language
export function worldInitializeAfterEvent () {
    languageNow ??= config.antiCheatOptions.language
    const language = world.getDynamicProperty("matrix:language") as string
    if (language === undefined) return; else
    if (!Object.keys(langs).includes(language)) return world.setDynamicProperty("matrix:language", undefined); else

    languageNow = language
}

export function changeLanguage (lang: string) {
    if (Object.keys(langs).includes(lang)) {
        languageNow = lang
        world.setDynamicProperty("matrix:language", lang)
        return true
    }
    return false
}
export const getAllLang = () => Object.keys(langs)

const arrayMap = {
    1: "%a",
    2: "%b",
    3: "%c",
    4: "%d",
    5: "%e",
    6: "%f",
    7: "%g",
    8: "%g"
}

export const lang = (key: LangType, ...regax: string[]): string => {
    let selected = langs[languageNow][key] ?? langs["en_US"][key]
    if (selected && regax.length > 0) {
        for (let i = 0; i < regax.length; i++) {
            selected = selected.replace((arrayMap as { [ key: number ]: string } )[i], regax[i])
        }
    }
    if (selected) return selected
    throw new Error ("[Language::lang] Invalid key for language, key = " + key)
}

type LangType = "-help.helpCDlist" | "-help.help" | "-help.toggles" | "-help.toggle" | "-help.op" | "-help.deop" | "-help.passwords" | "-help.flagmode" | "-help.rank" | "-help.rankclear" | "-help.defaultrank" | "-help.showallrank" | "-help.ban" | "-help.unban" | "-help.unbanremove" | "-help.unbanlist" | "-help.freeze" | "-help.unfreeze" | "-help.vanish" | "-help.unvanish" | "-help.invcopy" | "-help.invsee" | "-help.echestwipe" | "-help.lockdowncode" | "-help.lockdown" | "-help.unlock" | "-help.adminchat" | "-help.lang" | "-help.langlist" | "-about.line1" | "-about.version" | "-about.author" | "-toggles.toggle" | "-toggles.module" | "-toggles.toggleList" | "-toggles.unknownModule" | "-toggles.toggleChange" | "-toggles.unknownAction" | "-op.hasbeen" | "-op.please" | "-op.now" | "-op.wrong" | "-op.wait" | "-deop.lockdown" | "-deop.notadmin" | "-deop.hasbeen" | "-passwords.oldnew" | "-passwords.wrong" | "-passwords.changed" | "-flagmode.unknown" | "-flagmode.changed" | "-rank.unknownAction" | "-rank.enter" | "-rank.hasset" | "-rank.hasadd" | "-rank.already" | "-rank.hasremove" | "-rank.norank" | "-rank.empty" | "-rankclear.has" | "-rankclear.empty" | "-defaultrank.enter" | "-defaultrank.has" | "-showallrank.unknown" | "-showallrank.has" | "-ban.self" | "-ban.admin" | "-ban.reason" | "-ban.time" | "-ban.has" | "-unban.self" | "-unban.notban" | "-unbanremove.not" | "-unbanlist.none" | "-unbanlist.list" | "-freeze.self" | "-freeze.admin" | "-freeze.has" | "-freeze.already" | "-unfreeze.self" | "-unfreeze.not" | "-unfreeze.has" | "-unfreeze.admin" | "-mute.self" | "-mute.admin" | "-mute.has" | "-mute.already" | "-unmute.self" | "-unmute.not" | "-unmute.has" | "-unmute.admin" | "-vanish.has" | "-vanish.out" | "-invcopy.self" | "-invcopy.not" | "-invsee.self" | "-invsee.of" | "-echestwipe.self" | "-echestwipe.admin" | "-echestwipe.has" | "-lockdowncode.unknown" | "-lockdowncode.get" | "-lockdowncode.enter" | "-lockdowncode.set" | "-lockdowncode.number" | "-lockdowncode.length" | "-lockdowncode.random" | "-lockdowncode.unknownAction" | "-lockdown.enter" | "-lockdown.wrong" | "-lockdown.already" | "-lockdown.has" | "-unlock.not" | "-unlock.has" | "-adminchat.has" | "-adminchat.out" | "-lang.enter" | "-lang.unknown" | "-lang.has" | "-langlist.list" | ".CommandSystem.no_permission" | ".CommandSystem.unknown_command" | ".CommandSystem.command_disabled" | ".CommandSystem.command_disabled_reason" | ".CommandSystem.no_player" | ".CommandSystem.unknown_player" | ".CommandSystem.unknown" | ".CommandSystem.about" | ".Util.kicked" | ".Util.reason" | ".Util.noreason" | ".Util.unknown" | ".Util.has_failed" | ".Util.formkick" | ".Util.formban" | ".banHandler.banned" | ".banHandler.format" | ".AdminChat.adminchat" | ".ChatHandler.muted" | ".dimensionLock.stop" | ".Spam.slowdown" | ".Spam.repeated" | ".Spam.kicked" | ".Spam.filter" | ".Spam.long" | ".Spam.blacklist" | ".Spam.kickedBlacklist" | ">distance" | ">yReach" | ">HitLength" | ">Angle" | ">Click Per Second" | ">RotSpeed" | ">RotSpeedX" | ">RotSpeedY" | ">Type" | ">Pos" | ">PosDeff" | ">AttackTime" | ">UsingItem" | ">Moving" | ">Container" | ">velocityY" | ">velocityXZ" | ">playerSpeed" | ">Mph" | ">Reach" | ">Mode" | ">Break" | ">Place" | ">GameMode" | ">illegalLength" | ">illegalRegax" | ">Length" | ">Block" | ">RotationX" | ">RotationY" | ">relative" | ">Delay" | ">typeId" | ">nameLength" | ">CentreDis" | ">ItemType" | ">ItemNameLength" | ">ItemLore" | ">EnchantLevel" | ">EnchantConflict" | ">ItemEnchantAble" | ">ItemEnchantRepeat" | ">ItemAmount" | ">ItemTag" | ">Amount" | ">Ratio" | "-toggles.already" | ">Limit" | ">BlockPerSecond" | "-unban.add" | "-unbanremove.yes" | ".Bot.ui" | ".Bot.expired" | ".Bot.waitUI" | ".Bot.title" | ".Bot.failed" | ".Bot.ok" | ".Util.unfair" | ".Bot.by" | ".Spam.by" | ".Spam.spamming" | ".Spam.blacklisted" | ".Border.reached" | ".Border.outside" | ".Border.interact" | "-borderSize.enter" | "-borderSize.notANum" | "-borderSize.between"
| ".UI.exit" | ".UI.i" | ".UI.i.a" | ".UI.i.b" | "-borderSize.ok" | ".Util.by" | ".Util.operator" | "-help.borderSize" | "-help.about"