import {
    EntityEquippableComponent,
    EntityInventoryComponent,
    EquipmentSlot,
    ItemStack,
    Player,
    system,
    world
} from "@minecraft/server";
import { helpList, toggleList, validModules } from "../../Data/Help"
import { isAdmin, isTimeStr, kick, timeToMs } from "../../Assets/Util";
import config from "../../Data/Config";
import { ban, unban, unbanList, unbanRemove } from "../moderateModel/banHandler";
import { freeze, unfreeze } from "../moderateModel/freezeHandler";
import { triggerEvent } from "../moderateModel/eventHandler";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import version from "../../version";
import lang from "../../Data/Languages/lang";
import { changeLanguage, getAllLang } from "../../Data/Languages/lang";

export { inputCommand }

function turnRegax (message: string, prefix: string) {
    const regex = /(["'])(.*?)\1|\S+/g
    const matches = message.match(regex)
    const command = matches.shift().slice(prefix.length)
    const args = matches.map(arg => arg.replace(/[@"]/g, '').replace(/"$/, ''))
    return [command, ...args]
}

class Cmds {
    enabled: boolean;
    adminOnly: boolean;
    requireTag: undefined | string[]
}

class Command {
    static new (player: Player, setting: Cmds): boolean {
        if (setting.enabled !== true) {
            system.run(() => player.sendMessage(`§bMatrix §7> §g `+lang(".CommandSystem.command_disabled")))
            return false
        }
        if (setting.adminOnly === true && !isAdmin(player)){
            system.run(() => player.sendMessage(`§bMatrix §7> §g `+lang(".CommandSystem.command_disabled_reason")))
            return false
        }
        if (setting.requireTag !== undefined && !player.getTags().some(tag => setting.requireTag.includes(tag))) {
            system.run(() => player.sendMessage(`§bMatrix §7> §g `+lang(".CommandSystem.no_permisson")))
            return false
        }
        return true
    }
}
async function inputCommand (player: Player, message: string, prefix: string): Promise<any> {
    const regax = turnRegax(message, prefix)

    switch (regax[0]) {
        case "about": {
            system.run(() =>
                player.sendMessage(`§bMatrix §7> §g ${lang("-about.line1")}\n§g${lang("-about.version")}: §cV${version.join('.')}\n§4${lang("-about.author")}: §cjasonlaubb\n§4GitHub: §chttps://github.com/jasonlaubb/Matrix-AntiCheat`)
            )
            break
        }
        case "help": {
            if (!Command.new(player, config.commands.help as Cmds)) return
            const helpMessage: string = helpList(prefix)
            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-help.helpCDlist")}\n${helpMessage}`))
            break
        }
        case "toggles": {
            if (!Command.new(player, config.commands.toggles as Cmds)) return
            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-toggles.toggleList")}\n${toggleList(prefix)}`))
            break
        }
        case "toggle": {
            if (!Command.new(player, config.commands.toggle as Cmds)) return
            if (regax[1] === undefined || !(new Set(validModules).has(regax[1]))) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-toggles.unknownModule").replace("%a", prefix)}`))
            if (regax[2] === undefined || !(new Set(["enable", "disable"]).has(regax[2]))) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-toggles.unknownAction")}`))

            world.setDynamicProperty(regax[1], regax[2] === "enable" ? true : false)

            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-toggles.toggleChange").replace("%a", regax[1]).replace("%b", regax[2])}`))
            break
        }
        case "op": {
            if (!Command.new(player, config.commands.op as Cmds)) return
            if (isAdmin(player)) {
                if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
                const target = world.getPlayers({ name: regax[1] })[0]
                if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
                target.setDynamicProperty("isAdmin", true)
                system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-op.hasbeen").replace("%a", target.name).replace("%b", player.name)}`))
            } else {
                const password: string = regax[1]
                const correctPassword = (world.getDynamicProperty("password") ?? config.commands.password) as string
                if (password === undefined || password.length <= 0) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-op.please")}`))
                if (password == correctPassword) {
                    player.setDynamicProperty("isAdmin", true)
                    system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-op.now")}`))
                } else {
                    system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-op.wrong")}`))
                }
            }
            break      
        }
        case "deop": {
            if (!Command.new(player, config.commands.deop as Cmds)) return
            if (world.getDynamicProperty("lockdown") === true) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${(lang("-deop.lockdown"))}`))
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (!isAdmin(target)) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-deop.notadmin").replace("%a", target.name)}`))
            target.setDynamicProperty("isAdmin", undefined)
            system.run(() => player.sendMessage(`§bMatrix §7> §g ${(lang("-deop.hasbeen").replace("%a", target.name).replace("%b", player.name))}`))
            break
        }
        case "passwords": {
            if (!Command.new(player, config.commands.passwords as Cmds)) return
            const oldPassword: string = regax[1]
            const newPassword: string = regax[2]
            const correctPassword = (world.getDynamicProperty("password") ?? config.commands.password) as string
            if (oldPassword === undefined || newPassword === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-passwords.oldnew")}`))
            if (oldPassword !== correctPassword) return system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-passwords.wrong")}`))

            world.sendMessage(`§bMatrix §7> §g ${player.name} ${lang("-passwords.changed")}`)
            world.setDynamicProperty("password", newPassword)
            break
        }
        case "flagmode": {
            if (!Command.new(player, config.commands.flagmode as Cmds)) return
            const mode: string = regax[1]
            if (mode === undefined || !(new Set(["all", "tag", "bypass", "admin"]).has(mode))) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-flagmode.unknown")}`))
            world.setDynamicProperty("flagMode", mode)
            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-flagmode.changed").replace("%a", mode)}`))
            break
        }
        case "rank": {
            if (!Command.new(player, config.commands.rank as Cmds)) return
            if (regax[1] === undefined || !(new Set(["set", "add", "remove"]).has(regax[1]))) return system.run(() => player.sendMessage(`§bMatrix §7> ${lang("-rank.unknownAction")}`))
            if (regax[2] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[2] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            const rank: string = regax[3]
            if (rank === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-rank.enter")}`))
            const ranks: string[] = target.getTags().filter(tag => tag.startsWith("rank:"))
            switch (regax[1]) {
                case "set": {
                    system.run(() => {
                        ranks.forEach(rank => target.removeTag(rank))
                        target.addTag(`rank:${rank}`)
                        player.sendMessage(`§bMatrix §7> §g ${lang("-rank.hasset").replace("%a", target.name).replace("%b", rank)}`)
                    })
                    break
                }
                case "add": {
                    if (!player.hasTag(`rank:${rank}`)) {
                        system.run(() => {
                            target.addTag(`rank:${rank}`)
                            player.sendMessage(`§bMatrix §7> §g ${lang("-rank.hasadd").replace("%a", target.name).replace("%b", rank)}`)
                        })
                    } else {
                        system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-rank.already").replace("%a", target.name).replace("%b", rank)}`))
                    }
                    break
                }
                case "remove": {
                    if (ranks.length > 0) {
                        if (player.hasTag(`rank:${rank}`)) {
                            system.run(() => {
                                player.sendMessage(`§bMatrix §7> §g ${lang("-rank.hasremove").replace("%a", target.name)}`)
                                player.removeTag(`rank:${rank}`)
                            })
                        } else {
                            system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-rank.norank").replace("%a", target.name).replace("%b", rank)}`))
                        }
                    } else {
                        system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-rank.empty").replace("%a", target.name)}`))
                    }
                    break
                }
            }
            break
        }
        case "rankclear": {
            if (!Command.new(player, config.commands.rankclear as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))

            const ranks: string[] = target.getTags().filter(tag => tag.startsWith("rank:"))
            if (ranks.length > 0) {
                system.run(() => {
                    ranks.forEach(rank => target.removeTag(rank))
                    player.sendMessage(`§bMatrix §7> §g ${lang("-rankclear.has").replace("%a", target.name)}`)
                })
            } else {
                system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-rankclear.empty").replace("%a", target.name)}`))
            }
            break
        }
        case "defaultrank": {
            if (!Command.new(player, config.commands.defaultrank as Cmds)) return
            const rank: string = regax[1]
            if (rank === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-defaultrank.enter")}`))
            world.setDynamicProperty("defaultRank", rank)
            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-defaultrank.has").replace("%a", rank)}`))
            break
        }
        case "showallrank": {
            if (!Command.new(player, config.commands.showallrank as Cmds)) return
            const toggle: string = regax[1]
            if (toggle === undefined || !(new Set(["true", "false"]).has(toggle))) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-showallrank.unknown")}`))
            world.setDynamicProperty("showAllRank", Boolean(toggle))
            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-showallrank.has").replace("%a", toggle)}`))
            break
        }
        case "ban": {
            if (!Command.new(player, config.commands.ban as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-ban.self")}`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-ban.admin")}`))

            const reason = regax[2]
            if (reason === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-ban.reason")}`))

            const time = regax[3]
            if (time === undefined || (!isTimeStr(time) && time != 'forever')) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-ban.time")}`))

            ban(player, 'reason', player.name, time === 'forever' ? time : Date.now() + timeToMs(time))
            system.run(() => world.sendMessage(`§bMatrix §7> §g ${lang("-ban.has").replace("%a", target.name).replace("%b", player.name)}`))
            break
        }
        case "unban": {
            if (!Command.new(player, config.commands.unban as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))

            const targetName = regax[1]

            if (unbanList().includes(targetName)) return system.run(() => player.sendMessage(`§bMatrix §7> §g ${targetName} has unbanned already`))
            if (targetName == player.name) return system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-unban.self")}`))

            unban(targetName)
            break
        }
        case "unbanremove": {
            if (!Command.new(player, config.commands.unbanremove as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))

            const targetName = regax[1]

            if (!unbanRemove(targetName)) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unbanremove.not").replace("%a", targetName)}`))
            break
        }
        case "unbanlist": {
            if (!Command.new(player, config.commands.unbanlist as Cmds)) return
            const list = unbanList()
            if (list.length === 0) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unbanlist.none")}`))
            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-unbanlist.list")}:\n${list.join("\n")}`))
            break
        }
        case "freeze": {
            if (!Command.new(player, config.commands.freeze as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-freeze.self")}`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-freeze.admin")}`))

            const freezed = freeze (target)

            if (freezed) {
                system.run(() => world.sendMessage(`§bMatrix §7> §g ${lang("-freeze.has").replace("%a", target.name).replace("%b", player.name)}`))
            } else {
                system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-freeze.already").replace("%a", target.name)}`))
            }
            break
        }
        case "unfreeze": {
            if (!Command.new(player, config.commands.unfreeze as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unfreeze.self")}`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unfreeze.admin")}`))

            const unfreezed = unfreeze (target)

            if (unfreezed) {
                system.run(() => world.sendMessage(`§bMatrix §7> §g ${lang("-unfreeze.has").replace("%a", target.name).replace("%b", player.name)}`))
            } else {
                system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unfreeze.not").replace("%a", target.name)}`))
            }
            break
        }
        case "mute": {
            if (!Command.new(player, config.commands.mute as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-mute.self")}`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-mute.admin")}`))
            if (target.getDynamicProperty("mute") === true) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-mute.already").replace("%a", target.name)}`))

            target.setDynamicProperty("mute", true)
            system.run(() => world.sendMessage(`§bMatrix §7> §g ${lang("-mute.has").replace("%a", target.name).replace("%b", player.name)}`))
            break
        }
        case "unmute": {
            if (!Command.new(player, config.commands.unmute as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unmute.self")}`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unmute.admin")}`))
            if (target.getDynamicProperty("mute") !== true) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unmute.not").replace("%a", target.name)}`))

            target.setDynamicProperty("mute", undefined)
            system.run(() => world.sendMessage(`§bMatrix §7> §c ${lang("-unmute.has").replace("%a", target.name).replace("%b", player.name)}`))
            break
        }
        case "vanish": {
            if (!Command.new(player, config.commands.vanish as Cmds)) return
            system.run(() => {
                triggerEvent(player, "matrix:vanish")
                player.addEffect(MinecraftEffectTypes.Invisibility, 19999999, { showParticles: false, amplifier: 2 })
                player.sendMessage(`§bMatrix §7> §g ${lang("-vanish.has")}`)
            })
            break
        }
        case "unvanish": {
            if (!Command.new(player, config.commands.unvanish as Cmds)) return
            system.run(() => {
                triggerEvent(player, "matrix:unvanish")
                player.removeEffect(MinecraftEffectTypes.Invisibility)
                player.sendMessage(`§bMatrix §7> §g ${lang("-vanish.out")}`)
            })
            break
        }
        case "invcopy": {
            if (!Command.new(player, config.commands.invcopy as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-invcopy.self")}`))

            const inputInv = ((target.getComponent(EntityInventoryComponent.componentId)) as EntityInventoryComponent).container;
            const outputInv = ((player.getComponent(EntityInventoryComponent.componentId)) as EntityInventoryComponent).container;

            for (let i = 0; i < inputInv.size; i++) {
                const item: ItemStack | undefined = inputInv.getItem(i);

                system.run(() => outputInv.setItem(i, item))
            }

            system.run(() => {
                const equupments = player.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent
                for (const slot in EquipmentSlot) {
                    equupments.setEquipment(slot as EquipmentSlot, equupments.getEquipment(slot as EquipmentSlot))
                }
            })

            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-invcopy.not").replace("%a", target.name)}`))
            break
        }
        case "invsee": {
            if (!Command.new(player, config.commands.invsee as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-invsee.self")}`))

            const inv = ((target.getComponent(EntityInventoryComponent.componentId)) as EntityInventoryComponent).container;

            let itemArray: string[] = []

            for (let i = 0; i < inv.size; i++) {
                const item: ItemStack | undefined = inv.getItem(i);

                if (item) {
                    itemArray.push(`§eSlot: §c${i} | §eItem: §c${item?.typeId}`)
                } else {
                    itemArray.push(`§eSlot: §c${i} | §eItem: §cEmpty`)
                }
            }

            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-invsee.of").replace("%a", target.name)}:\n${itemArray.join("\n")}`))
            break
        }
        case "echestwipe": {
            if (!Command.new(player, config.commands.echestwipe as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.no_player")}`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown_player")}`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-echestwipe.self")}`))
            if (isAdmin (player)) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-echestwipe.admin")}`))

            for (let i = 0; i < 27; i++) {
                player.runCommandAsync(`replaceitem entity @s slot.enderchest ${i} air`)
            }

            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-echestwipe.has").replace("%a", target.name).replace("%b", player.name)}`))
            break
        }
        case "lockdowncode": {
            if (!Command.new(player, config.commands.lockdowncode as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lockdowncode.unknown")}`))

            switch (regax[1]) {
                case "get": {
                    const code = world.getDynamicProperty("lockdowncode") ?? config.lockdowncode
                    system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-lockdowncode.get").replace("%a", code as string)}`))
                    break
                }
                case "set": {
                    if (regax[2] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lockdowncode.enter")}`))
                    system.run(() => {
                        world.setDynamicProperty("lockdowncode", regax[2])
                        player.sendMessage(`§bMatrix §7> §c ${lang("-lockdowncode.set").replace("%a", regax[2])}`)
                    })
                    break
                }
                case "random": {
                    const codeLength = regax[2] ?? 6

                    if (Number.isNaN(Number(codeLength))) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lockdowncode.number")}`))
                    if (Number(codeLength) < 1 || Number(codeLength) > 128) {
                        system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lockdowncode.length")}`))
                        return
                    }

                    const candidate = [
                        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                        'w', 'x', 'y', 'z'
                    ]

                    let code = ''
                    for (let i = 0; i < Number(codeLength); i++) {
                        code += candidate[Math.floor(Math.random() * candidate.length)]
                    }

                    system.run(() => {
                        world.setDynamicProperty("lockdowncode", code)
                        player.sendMessage(`§bMatrix §7> §g ${lang("-lockdowncode.set").replace("%a", code)}`)
                    })
                    break
                }
                default: {
                    system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lockdowncode.unknownAction")}`))
                
                }
            }
            break
        }
        case "lockdown": {
            if (!Command.new(player, config.commands.lockdown as Cmds)) return
            const code = world.getDynamicProperty("lockdowncode") ?? config.lockdowncode
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lockdown.enter")}`))
            if (regax[1] !== code) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lockdown.wrong")}`))
            if (world.getDynamicProperty("lockdown") === true) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lockdown.already")}`))

            system.run(() => {
                world.setDynamicProperty("lockdown", true)
                world.sendMessage(`§bMatrix §7> §g ${lang("-lockdown.has").replace("%a", player.name)}`)
                world.getAllPlayers().filter(players => isAdmin(players) === false).forEach(players => kick(players, "LockDown", 'Matrix'))
            })
            break
        }
        case "unlock": {
            if (!Command.new(player, config.commands.unlock as Cmds)) return
            if (!world.getDynamicProperty("lockdown")) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-unlock.not")}`))

            system.run(() => {
                world.setDynamicProperty("lockdown", undefined)
                world.sendMessage(`§bMatrix §7> §g ${lang("-unlock.has").replace("%a", player.name)}`)
            })
            break
        }
        case "adminchat": {
            if (!Command.new(player, config.commands.adminchat as Cmds)) return
            if (player.getDynamicProperty("adminchat")) {
                player.setDynamicProperty("adminchat", undefined)
                system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-adminchat.out")}`))
            } else {
                player.setDynamicProperty("adminchat", true)
                system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-adminchat.has")}`))
            }
            break
        }
        case "lang": {
            if (!Command.new(player, config.commands.lang as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-lang.enter")}`))
            if (!getAllLang().includes(regax[1])) return system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang("-lang.unknown").replace("%a", prefix)}`))

            system.run(() => {
                changeLanguage(regax[1])
                player.setDynamicProperty("lang", regax[1])
                player.sendMessage(`§bMatrix §7> §g ${lang("-lang.has").replace("%a", regax[1])}`)
            })
            break
        }
        case "langlist": {
            if (!Command.new(player, config.commands.langlist as Cmds)) return
            const list = getAllLang().map(value => `§a- ${value}`)
            system.run(() => player.sendMessage(`§bMatrix §7> §g ${lang("-langlist.list")}\n${list.join("\n")}`))
            break
        }
        default: {
            if (isAdmin (player)) {
                system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown").replace("%a", prefix)}`))
            } else {
                system.run(() => player.sendMessage(`§bMatrix §7> §c ${lang(".CommandSystem.unknown").replace("%a", prefix)}\n§7§o(${lang(".CommandSystem.about")})`))
            }
        }
    }
}