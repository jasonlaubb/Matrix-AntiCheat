import {
  system,
  world
} from "@minecraft/server"

import { prefix } from '../config'
import { Commands } from "./commands"

world.beforeEvents.chatSend.subscribe(data => {
  const player = data.sender
  const msg = data.message
  const spam = world.scoreboard.getObjective("spam").getScore(player.scoreboardIdentity)

  if (msg.startsWith(prefix)) {
    Commands(player, msg)
    data.cancel = true
    return
  }

  if(player.hasTag("mute")) return system.run(() => player.sendMessage(`§e[§cMatrix§e]§c You're muted!`))
  if(spam > 0) return system.run(() => player.sendMessage(`§e[§cMatrix§e]§c Please slow down your messages!`))

  if(spam === 0 && !player.hasTag("MatrixOP")) {
    system.run(() => {
      world.scoreboard.getObjective('spam').setScore(player.scoreboardIdentity, 50)
    })
  }

  const rank = player.getTags().filter(f => f.startsWith('rank:'))[0]
  if(rank == undefined) {
    rank = "§7Member"
  }
  data.cancel = true
  system.run(() => {
    world.sendMessage(`§8[§7${rank}§8] §7${player.name}§8: §r${msg.replaceAll("§k","")}`)
  })
})
