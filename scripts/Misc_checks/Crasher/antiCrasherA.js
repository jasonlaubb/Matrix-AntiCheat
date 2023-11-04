//@ts-check
import {
  system,
  world,
  Player
} from "@minecraft/server"
import {
  antiCrasherEnabled
} from "../../config"

/** @param {Player} player */
export async function antiCrasherA(player) {
  if (antiCrasherEnabled == true) {
    const crasherToggle = !world.getDynamicProperty('toggle:crasher')
    if (crasherToggle != true) return
    const playerZ = player.location.z
    const playerX = player.location.x
    const playerY = player.location.y
    if (playerX > 30000000 || playerY > 30000000 || playerZ > 30000000) {
      if (player.hasTag("MatrixOP")) return
      player.addTag(`ban`)
      player.addTag(`By:Matrix`)
      player.addTag(`Reason:§cCrasher§r`)
      player.runCommand(`scoreboard players set @s bantimer 40`)
      player.runCommand(`tp @s 100 100 100`)
      world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been banned!§r\n§gBy§8:§bMatrix\n§gReason§8:§cCrasher`)
      player.runCommand(
        `kick "${player.name}" .\n§8 >> §c§lYou are banned bad boy\n§r§8 >> §gReason§8:§cCrasher\n§8 >> §gBy§8:§cMatrix`
        )
    }
  }
}
system.beforeEvents.watchdogTerminate.subscribe((terminator) => {
  terminator.cancel = true
})
