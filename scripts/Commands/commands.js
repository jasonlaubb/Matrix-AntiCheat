import {
  world,
  system
} from "@minecraft/server"
import {
  HELP_LIST,
  password,
  prefix,
  UiItemPrefix
} from "../config"
import {
  moderateAction
} from "../Moderation/moderation"
import {
  getUIItem
} from "../ui/getItem"

const commandHandler = (input) => {
  const regex = /(["'])(.*?)\1|\S+/g
  const matches = input.match(regex)
  const command = matches.shift().slice(prefix.length)
  const args = matches.map(arg => arg.replace(/^[@"]/g, '').replace(/"$/, ''))
  return [command, ...args]
}

const Real = (input, user, allowAdmin, canSelf) => {
  let target
  try {
    target = world.getPlayers({
      name: input
    })[0]
    if (target.id === user.id && canSelf !== true) throw "same target"
    if (allowAdmin !== true && target.hasTag('MatrixOP')) throw "target is admin"
  } catch {
    target = undefined
  }
  return target
}

class Error {
  user;
  constructor(user) {
    this.user = user
  }
  Target() {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cTarget should be valid for this command!`))
  }
  None(regax) {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cthis command doesnt exist >> §g${regax} §c<<`))
  }
  NoOp() {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cSorry but you don't have permisson to use this command.`))
  }
  Unexpact() {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cA unknown error happened.`))
  }
  NotTurner() {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cOnly allow §genable §cand §gdisable§c here.`))
  }
}

function Commands(player, message) {
  const regax = [...commandHandler(message)]

  switch (regax[0]) {
    //Op and deop
    case "op": {
      if (password === regax[1]) {
        system.run(() => {
          player.addTag('MatrixOP')
          world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ais opped Matrix`)
        })
      } else {
        system.run(() => {
          player.sendMessage(`§e[§cMatrix§e] §cIncorrect password`)
        })
      }
      break
    }
    case "deop": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true, true)
      if (target === undefined) return new Error(player).Target()
      system.run(() => {
        player.removeTag('MatrixOP')
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §chis op has been removed\n§gBy§8:§b${player.name}`)
      })
      break
    }
    //Mod command
    case "ban": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).ban(regax[2]))
      break
    }
    case "unban": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      if (regax[1] === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).unban())
      break
    }
    case "mute": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).mute(regax[2]))
      break
    }
    case "unmute": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).unmute())
      break
    }
    case "freeze": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).freeze(regax[2]))
      break
    }
    case "unfreeze": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).unfreeze())
      break
    }
    case "kick": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).ban(regax[2]))
      break
    }
    case "inventoryCheck": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()

      system.run(() => new moderateAction(target, player).seeInv())
      break
    }
    case "itemCheck": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()

      system.run(() => new moderateAction(target, player).seachInv())
      break
    }
    case "rank": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()
      if (regax[2] === undefined) return player.sendMessage(`§e[§cMatrix§e] §cRank should be valid`)

      target.getTags().filter(t => t.startsWith('rank:')).forEach(f => player.removeTag(f))
      target.addTag(`rank:${regax[2]}`)
      world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahis rank has been changed\n§gBy§8:§b${player.name}\n§gRank§8:§r${regax[2]}`)
      break
    }

    //Other command
    case "runCommand": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      system.run(() => {
        try {
          player.runCommand(regax[1])
          player.sendMessage(`§e[§cMatrix§e] §ccommand run sucessfully`)
        } catch (e) {
          player.sendMessage(`§e[§cMatrix§e] §ccommand runned with error ${e}`)
        }
      })
      break
    }
    case "ui": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      system.run(() => {
        getUIItem(player, UiItemPrefix)
      })
      break
    }
    case "notify": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()

      system.run(() => {
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahas been put for get cheats notification\n§gBy§8:§b${player.name}`)
        target.addTag('notify')
      })
      break
    }
    case "unnotify": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()

      system.run(() => {
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahas been removed from get cheats notification\n§gBy§8:§b${player.name}`)
        target.removeTag('notify')
      })
      break
    }
    case "xray_notify": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()

      system.run(() => {
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahas been put for get xray notification\n§gBy§8:§b${player.name}`)
        target.addTag('notifyXray')
      })
      break
    }
    case "xray_unnotify": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()

      system.run(() => {
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahas been put for get xray notification\n§gBy§8:§b${player.name}`)
        target.removeTag('notifyXray')
      })
      break
    }
    case "help": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      system.run(() => player.sendMessage(HELP_LIST))
    }
    case "toggles": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      system.run(() => player.sendMessage(`§c§lToggles§8:§r\n§ganti speed toggle §8(§cantiSpeed§8)\n§ganti reach toggle§8 (§cantiReach§8<§greach_type§8>§8) §greach types§8:\n§gbreak§8:§cB\n§gplace§8:§cP\n§gAttack§8:§cA\n§ganti nuker toggle§8 (§cantiNuker§8)\n§ganti speed mine toggle§8 (§cantiSpeedMine§8)\n§ganti xray toggle §8(§cantiXray§8)\n§ganti scaffold toggle §8(§cantiScaffold§8<§cscaffold_type§8>)\n§gscaffold types§8:\n§gwhen the player eyes is looking up and placing blocks under him§8:§cA\n§gwhen player is placing blocks and item in hand of player doesnt block was placed§8:§cB\n§ganti auto clicker toggle §8(§cantiAuto§8<§cAuto clicker type§8>)§g\nauto clicker types§8:\n§gAuto clicker attack§8:§cA\n§gAuto clicker place§8:§cP\n§ganti crasher toggle §8(§cantiCrasher§8)\n§ganti fly toggle §8(§cantiFly§8)\n§gabadpacket toggle §8(§cantiBadpacket§8)\n§gainvalidSprint toggle §8(§cantiInvalidSprint§8)`))
      break
    }

    //Toggle command
    case "antiXray": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti xray has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:xray')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti xray has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:xray', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiNuker": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti nuker has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:nuker')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti nuker has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:nuker', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiAutoA": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto clicker has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:auto')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto clicker has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:auto', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiKillaura": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti Killaura has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:killaura')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti Killaura has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:killaura', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiReachA": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reachA has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:reachA')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reachA has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:reachA', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiReachB": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reachB has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:reachB')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reachA has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:reachB', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiReachP": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reach place has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:reachP')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reach place has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:reachP', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiScaffoldA": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldA has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:scaffoldA')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldA has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:scaffoldA', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiScaffoldB": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldB has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:scaffoldB')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldB has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:scaffoldB', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiAutoP": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto place has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:autoA')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto place has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:autoA', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiSpeedMine": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto place has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:autoP')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto place has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:autoP', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiSpeed": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti speed has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:speed')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto place has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:speed', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiCrasher": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti crasher has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:crasher')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti crasher has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:crasher', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiFly": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti fly has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:fly')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti fly has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:fly', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiBadpacket": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti badpacket has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:badpacket')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti badpacket has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:badpacket', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiInvalidSprint": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti InvalidSprint has enabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.removeObjective('toggle:invalidsrpint')
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti InvalidSprint has disabled§r\n§gBy§8:§b${player.name} `)
            world.scoreboard.addObjective('toggle:invalidsrpint', '')
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    default: {
      new Error(player).None(regax[0])
    }
  }
}

export {
  Commands
}
