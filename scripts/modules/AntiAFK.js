//@ts-check
import {
  world,
  system,
  Player
} from "@minecraft/server"
import {
  ActionFromData
} from "@minecraft/server-ui"
import {
  antiAFKEnabled
} from "../config"

const afkTime = new Map()

if (antiAFKEnabled) {
system.runInterval(() => {
  const antiAFKtoggle = !!world.getDynamicProperty("toggle:afk")
  if (antiAFKtoggle === false) {
    return
  }
  
  for (const player of world.getPlayers({ excludeTags: ["MatrixOP"]})) {
    const afkTimeNow = Number(afkTime.get(player.id) ?? 0)
    const maxAfkLength = world.getDynamicProperty("afk:maxafktime") ?? 600
    const warnGUI = world.getDynamicProperty("afk:warnGUI") ?? false
    
    if (!player.hasTag("moving")) {
      afkTime.set(afkTimeNow + 1)
      if (afkTimeNow + 1 > maxAfkLength) {
        if (warnGUI === true) {
          player.addTag ("afk:warning")
          new ActionFromData ()
            .title ("AFK kick")
            .body ("You will be kicked soon!")
            .button ("-- click here to verify you are not afk!")
            .then (res => {
              player.removeTag ("afk:checking")
              if (res.cancelled) timerClear (player)
              if (res.selection === 0)
                timerClear (player)
            })
          if ((afkTimeNow + 1) > maxAfkLength + 30) {
              player.runCommandAsync (`kick "${player.name}"`)
              player.removeTag ("afk:checking")
              timerClear (player)
          }
        } else {
          player.runCommandAsync(`kick "${player.name}"`)
          player.removeTag ("afk:checking")
          timerClear (player)
        }
      }
    } else {
      if (afkTimeNow > 0) {
        timerClear (player)
      }
    }
  }
}, 20)

 world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    try {
      afkTime.delete(playerId)
    } catch { }
 })
 world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
   if (!initialSpawn) return
   player.removeTag("afk:warning")
 })
}

/** @param {Player} player */
function timerClear (player) {
  afkTime.delete(player.id)
}
