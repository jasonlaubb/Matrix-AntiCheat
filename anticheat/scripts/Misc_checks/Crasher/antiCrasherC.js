import * as Minecraft from "@minecraft/server"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  Vector,
  Container,
  Player
} from "@minecraft/server"
import {
  antiCrasherEnabled
} from "../../config"
let world = Minecraft.world
let crasherToggle;
export async function antiCrasherC(player) {
  if (antiCrasherEnabled == true) {
    let crasherToggle;
    try {
      crasherToggle = world.scoreboard.getObjective("toggle:crasher").displayName
    } catch {
      crasherToggle = true
    }
    if (crasherToggle != true) return
    try {
      let playerZ = player.location.z
      let playerX = player.location.x
      let playerY = player.location.y
    } catch {
      if (player.hasTag("MatrixOP")) return
      player.addTag(`ban`)
      player.addTag(`By:Matrix`)
      player.addTag(`Reason:§cCrasher §8(§gC§8) §8(§gC§8)§r`)
      player.runCommand(`scoreboard players set @s bantimer 40`)
      player.runCommand(`tp @s 100 100 100`)
      world.sendMessage(
        `§e[§cMatrix§e] §b${player.name} §chas been banned!§r\n§gBy§8:§bMatrix\n§gReason§8:§cCrasher §8(§gC§8)`)
      player.runCommand(
        `kick "${player.name}" .\n§8 >> §c§lYou are banned bad boy\n§r§8 >> §gReason§8:§cCrasher §8(§gC§8)\n§8 >> §gBy§8:§cMatrix`
        )
    }
  }
}
