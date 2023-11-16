import {
    EntityInventoryComponent,
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
import { ActionFormData } from "@minecraft/server-ui";
import version from "../../version";

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
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 This command is disabled`))
            return false
        }
        if (setting.adminOnly === true && !isAdmin(player)){
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You are not admin to use this command`))
            return false
        }
        if (setting.requireTag !== undefined && !player.getTags().some(tag => setting.requireTag.includes(tag))) {
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You don't have enough permisson to use this command`))
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
                player.sendMessage(`§2§l§¶Matrix >§4 Matrix is a minecraft bedrock anticheat that is based on @minecraft API\n§4Version: §cV${version.join('.')}\n§4Author: §cjasonlaubb\n§4GitHub: §chttps://github.com/jasonlaubb/Matrix-AntiCheat`)
            )
            break
        }
        case "help": {
            if (!Command.new(player, config.commands.help as Cmds)) return
            const helpMessage: string = helpList(prefix)
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Help command list:\n${helpMessage}`))
            break
        }
        case "toggles": {
            if (!Command.new(player, config.commands.toggles as Cmds)) return
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Toggle list:\n${toggleList(prefix)}`))
            break
        }
        case "toggle": {
            if (!Command.new(player, config.commands.toggle as Cmds)) return
            if (regax[1] === undefined || !(new Set(validModules).has(regax[1]))) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown module, try ${prefix}toggles`))
            if (regax[2] === undefined || !(new Set(["enable", "disable"]).has(regax[2]))) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown action, please use enable/disable only`))

            world.setDynamicProperty(regax[1], regax[2] === "enable" ? true : false)

            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${regax[1]} module has been ${regax[2]}d`))
            break
        }
        case "op": {
            if (!Command.new(player, config.commands.op as Cmds)) return
            if (isAdmin(player)) {
                if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
                const target = world.getPlayers({ name: regax[1] })[0]
                if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
                target.setDynamicProperty("isAdmin", true)
                system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has been opped by ${player.name}`))
            } else {
                const password: string = regax[1]
                const correctPassword = (world.getDynamicProperty("password") ?? config.commands.password) as string
                if (password === undefined || password.length <= 0) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the password`))
                if (password == correctPassword) {
                    player.setDynamicProperty("isAdmin", true)
                    system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You are now admin`))
                } else {
                    system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Wrong password`))
                }
            }
            break      
        }
        case "deop": {
            if (!Command.new(player, config.commands.deop as Cmds)) return
            if (world.getDynamicProperty("lockdown") === true) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 The server is in lockdown mode`))
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (!isAdmin(target)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${target.name} is not admin`))
            target.setDynamicProperty("isAdmin", undefined)
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has been deopped by ${player.name}`))
            break
        }
        case "passwords": {
            if (!Command.new(player, config.commands.passwords as Cmds)) return
            const oldPassword: string = regax[1]
            const newPassword: string = regax[2]
            const correctPassword = (world.getDynamicProperty("password") ?? config.commands.password) as string
            if (oldPassword === undefined || newPassword === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the old password and new password`))
            if (oldPassword !== correctPassword) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Wrong password`))

            world.sendMessage(`§2§l§¶Matrix >§4 ${player.name} has changed the password`)
            world.setDynamicProperty("password", newPassword)
            break
        }
        case "flagmode": {
            if (!Command.new(player, config.commands.flagmode as Cmds)) return
            const mode: string = regax[1]
            if (mode === undefined || !(new Set(["all", "tag", "bypass", "admin"]).has(mode))) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown action, please use all/tag/bypass/admin only`))
            world.setDynamicProperty("flagMode", mode)
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Flag mode has been set to ${mode}`))
            break
        }
        case "rank": {
            if (!Command.new(player, config.commands.rank as Cmds)) return
            if (regax[1] === undefined || !(new Set(["set", "add", "remove"]).has(regax[1]))) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown action, please use set/add/remove only`))
            if (regax[2] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
            const target = world.getPlayers({ name: regax[2] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            const rank: string = regax[3]
            if (rank === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the rank`))
            const ranks: string[] = target.getTags().filter(tag => tag.startsWith("rank:"))
            switch (regax[1]) {
                case "set": {
                    system.run(() => {
                        ranks.forEach(rank => target.removeTag(rank))
                        target.addTag(`rank:${rank}`)
                        player.sendMessage(`§2§l§¶Matrix >§4 ${target.name}'s rank has been set to ${rank}`)
                    })
                    break
                }
                case "add": {
                    if (!player.hasTag(`rank:${rank}`)) {
                        system.run(() => {
                            target.addTag(`rank:${rank}`)
                            player.sendMessage(`§2§l§¶Matrix >§4 ${target.name}'s rank has been added to ${rank}`)
                        })
                    } else {
                        system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${target.name} already has ${rank} §r§4 rank`))
                    }
                    break
                }
                case "remove": {
                    if (ranks.length > 0) {
                        if (player.hasTag(`rank:${rank}`)) {
                            system.run(() => {
                                player.sendMessage(`§2§l§¶Matrix >§4 ${target.name}'s rank has been removed`)
                                player.removeTag(`rank:${rank}`)
                            })
                        } else {
                            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${target.name} doesn't have ${rank} §r§4 rank`))
                        }
                    } else {
                        system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${target.name} doesn't have any rank`))
                    }
                    break
                }
            }
            break
        }
        case "rankclear": {
            if (!Command.new(player, config.commands.rankclear as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))

            const ranks: string[] = target.getTags().filter(tag => tag.startsWith("rank:"))
            if (ranks.length > 0) {
                system.run(() => {
                    ranks.forEach(rank => target.removeTag(rank))
                    player.sendMessage(`§2§l§¶Matrix >§4 ${target.name}'s rank has been cleared`)
                })
            } else {
                system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${target.name} doesn't have any rank`))
            }
            break
        }
        case "defaultrank": {
            if (!Command.new(player, config.commands.defaultrank as Cmds)) return
            const rank: string = regax[1]
            if (rank === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the rank`))
            world.setDynamicProperty("defaultRank", rank)
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Default rank has been set to ${rank}`))
            break
        }
        case "showallrank": {
            if (!Command.new(player, config.commands.showallrank as Cmds)) return
            const toggle: string = regax[1]
            if (toggle === undefined || !(new Set(["true", "false"]).has(toggle))) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown action, please use true/false only`))
            world.setDynamicProperty("showAllRank", Boolean(toggle))
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Show all rank has been set to ${toggle}`))
            break
        }
        case "ban": {
            if (!Command.new(player, config.commands.ban as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't ban yourself`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't ban admin`))

            const reason = regax[2]
            if (reason === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the reason`))

            const time = regax[3]
            if (time === undefined || (!isTimeStr(time) && time != 'forever')) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the time\nExample: 1d2h3m4s`))

            ban(player, 'reason', player.name, time === 'forever' ? time : Date.now() + timeToMs(time))
            system.run(() => world.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has been banned by ${player.name}`))
            break
        }
        case "unban": {
            if (!Command.new(player, config.commands.unban as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))

            const targetName = regax[1]

            if (unbanList().includes(targetName)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${targetName} has unbanned already`))
            if (targetName == player.name) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't unban yourself`))

            unban(targetName)
            break
        }
        case "unbanremove": {
            if (!Command.new(player, config.commands.unbanremove as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))

            const targetName = regax[1]

            if (!unbanRemove(targetName)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 ${targetName} has not unbanned yet`))
            break
        }
        case "unbanlist": {
            if (!Command.new(player, config.commands.unbanlist as Cmds)) return
            const list = unbanList()
            if (list.length === 0) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 There is no one in unban list`))
            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unban list:\n${list.join("\n")}`))
            break
        }
        case "freeze": {
            if (!Command.new(player, config.commands.freeze as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't freeze yourself`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't freeze admin`))

            const freezed = freeze (target)

            if (freezed) {
                system.run(() => world.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has been freezed by ${player.name}`))
            } else {
                system.run(() => world.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has freezed already`))
            }
            break
        }
        case "unfreeze": {
            if (!Command.new(player, config.commands.unfreeze as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't unfreeze yourself`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't unfreeze admin`))

            const unfreezed = unfreeze (target)

            if (unfreezed) {
                system.run(() => world.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has been unfreezed by ${player.name}`))
            } else {
                system.run(() => world.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has unfreezed already by ${player.name}`))
            }
            break
        }
        case "mute": {
            if (!Command.new(player, config.commands.mute as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't mute yourself`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't mute admin`))

            target.setDynamicProperty("mute", true)
            system.run(() => world.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has been muted by ${player.name}`))
            break
        }
        case "unmute": {
            if (!Command.new(player, config.commands.unmute as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please specify the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't unmute yourself`))
            if (isAdmin(target)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't unmute admin`))

            target.setDynamicProperty("mute", undefined)
            system.run(() => world.sendMessage(`§2§l§¶Matrix >§4 ${target.name} has been unmuted by ${player.name}`))
            break
        }
        case "vanish": {
            if (!Command.new(player, config.commands.vanish as Cmds)) return
            system.run(() => {
                triggerEvent(player, "matrix:vanish")
                player.addEffect(MinecraftEffectTypes.Invisibility, 19999999, { showParticles: false, amplifier: 2 })
                player.sendMessage(`§2§l§¶Matrix >§4 You are now vanished`)
            })
            break
        }
        case "unvanish": {
            if (!Command.new(player, config.commands.unvanish as Cmds)) return
            system.run(() => {
                triggerEvent(player, "matrix:unvanish")
                player.removeEffect(MinecraftEffectTypes.Invisibility)
                player.sendMessage(`§2§l§¶Matrix >§4 You are now no longer vanished`)
            })
            break
        }
        case "invcopy": {
            if (!Command.new(player, config.commands.invcopy as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't copy yourself`))

            const inputInv = ((target.getComponent(EntityInventoryComponent.componentId)) as EntityInventoryComponent).container;
            const outputInv = ((player.getComponent(EntityInventoryComponent.componentId)) as EntityInventoryComponent).container;

            for (let i = 0; i < inputInv.size; i++) {
                const item: ItemStack | undefined = inputInv.getItem(i);

                system.run(() => outputInv.setItem(i, item))
            }

            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Copied inventory from ${target.name}`))
            break
        }
        case "invsee": {
            if (!Command.new(player, config.commands.invsee as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't invsee yourself`))

            const inv = ((target.getComponent(EntityInventoryComponent.componentId)) as EntityInventoryComponent).container;

            let itemArray = []

            for (let i = 0; i < inv.size; i++) {
                const item: ItemStack | undefined = inv.getItem(i);

                if (item) {
                    itemArray.push(`§eSlot: §c${i} | §eItem: §c${item.typeId}`)
                } else {
                    itemArray.push(`§eSlot: §c${i} | §eItem: §cEmpty`)
                }
            }

            const invseeUI = new ActionFormData ()
                .title("inventory of " + player.name)
                .body(itemArray.join("\n"))
                .button("close")

            system.run(() => {
                invseeUI.show(player).then(res => {
                    if (res.canceled) return;
                    player.sendMessage(`§2§l§¶Matrix >§4 Closed inventory of ${target.name}`)
                })
            })
            break
        }
        case "echestwipe": {
            if (!Command.new(player, config.commands.echestwipe as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the player`))
            const target = world.getPlayers({ name: regax[1] })[0]
            if (target === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown player`))
            if (target.id === player.id) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't wipe yourself`))
            if (isAdmin (player)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 You can't wipe admin's enderchest`))

            for (let i = 0; i < 27; i++) {
                player.runCommandAsync(`replaceitem entity @s slot.enderchest ${i} air`)
            }

            system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Wiped enderchest from ${target.name}`))
            break
        }
        case "lockdowncode": {
            if (!Command.new(player, config.commands.lockdowncode as Cmds)) return
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the action you want`))

            switch (regax[1]) {
                case "get": {
                    const code = world.getDynamicProperty("lockdowncode") ?? config.lockdowncode
                    system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Lockdown code is ${code}`))
                    break
                }
                case "set": {
                    if (regax[2] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the code you want`))
                    system.run(() => {
                        world.setDynamicProperty("lockdowncode", regax[2])
                        player.sendMessage(`§2§l§¶Matrix >§4 Sucessfully changed lockdown code to ${regax[2]}`)
                    })
                    break
                }
                case "random": {
                    const codeLength = regax[2] ?? 6

                    if (Number.isNaN(codeLength)) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 The code length should be a number`))
                    if (Number(codeLength) < 1 || Number(codeLength) > 128) {
                        system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the code length between 1 and 128`))
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
                        player.sendMessage(`§2§l§¶Matrix >§4 Sucessfully random a lockdown code - ${code}`)
                    })
                    break
                }
                default: {
                    system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown action, please use get/set/random only`))
                
                }
            }
            break
        }
        case "lockdown": {
            if (!Command.new(player, config.commands.lockdown as Cmds)) return
            const code = world.getDynamicProperty("lockdowncode") ?? config.lockdowncode
            if (regax[1] === undefined) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Please enter the code`))
            if (regax[1] !== code) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Wrong code`))
            if (world.getDynamicProperty("lockdown") === true) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Lockdown has been enabled already`))

            system.run(() => {
                world.setDynamicProperty("lockdown", true)
                world.sendMessage(`§2§l§¶Matrix >§4 Lockdown has been enabled by ${player.name}`)
                world.getAllPlayers().filter(players => isAdmin(players) === false).forEach(players => kick(players, "LockDown", 'Matrix'))
            })
            break
        }
        case "unlock": {
            if (!Command.new(player, config.commands.unlock as Cmds)) return
            if (!world.getDynamicProperty("lockdown")) return system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Lockdown hasn't enabled`))

            system.run(() => {
                world.setDynamicProperty("lockdown", undefined)
                world.sendMessage(`§2§l§¶Matrix >§4 Lockdown has been disabled by ${player.name}`)
            })
            break
        }
        default: {
            if (isAdmin (player)) {
                system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown command, try ${prefix}help`))
            } else {
                system.run(() => player.sendMessage(`§2§l§¶Matrix >§4 Unknown command, try ${prefix}help\n§r§7§o(Use -about to see more information)`))
            }
        }
    }
}