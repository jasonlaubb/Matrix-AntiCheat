import * as Minecraft from "@minecraft/server"
import {
  antiAutoClickerEnabled,
  maximumCpsPlace
} from "../../config"
import {
  disX,
  disY,
  disZ,
  disXZ,
  limitOfReachX,
  limitOfReachY,
  limitOfReachZ
} from "../Reach/AntiBreak&PlaceReach"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  Vector,
  Container,
  Player,
  BlockInventoryComponent
} from "@minecraft/server"
let world = Minecraft.world
let autoAToggle;
if (antiAutoClickerEnabled == true) {
  world.afterEvents.playerPlaceBlock.subscribe((event) => {
    try {
      autoAToggle = world.scoreboard.getObjective("toggle:autoA").displayName
    } catch {
      autoAToggle = true
    }
    let player = event.player
    let block = event.block
    let {
      x,
      y,
      z
    } = block.location;
    let getCps = world.scoreboard.getObjective("placeCps").getScore(player.scoreboardIdentity)
    let blockName;
    let blockId = block.type.id.replaceAll("minecraft:", "");
    blockName = blockId.replaceAll("_", " ")
    let {
      x: playerx,
      y: playery,
      z: playerz
    } = player.location;
    let playerX = playerx.toFixed(0)
    let playerZ = playerz.toFixed(0)
    let playerY = playery.toFixed(0)
    system.run(() => {
      player.runCommand(`scoreboard players add @s placeCps 1`)
    })
    if (getCps >= maximumCpsPlace) {
      system.run(() => {
        if (autoAToggle != true) return
        if (player.hasTag("MatrixOP")) return
        player.runCommand(
          `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gClicking §8(§gB§8) §chas been detected from §b${player.name}\n§cCps §8= §8(§g${getCps}§8/§g${maximumCpsPlace}§8)\n§cBlock §8 = §8(§g${blockName}§8)"}]}`
          )
        player.runCommand(`scoreboard players set @s placeCps 0`)
        player.runCommand(
          `kick "${player.name}" .\n§8>> §cYou have been kicked!\n§8>> §gReason§r§8:§can unNatural §gClicking §8(§gB§8)§c Cps §8= §8(§g${getCps}§8/§g${maximumCpsPlace}§8)\n§8>> §gBy§8:§cMatrix`
          )
      })
    }
  })
}
