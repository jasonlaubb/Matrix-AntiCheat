import * as Minecraft from "@minecraft/server"
import {
  antiAutoClickerEnabled,
  maximumCpsPlace
} from "../../config"
import {
  system,
  world
} from "@minecraft/server"
import { Detect, Util } from "../../Util/Util"

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
      Util.addScore(world,player,'placeCps', 1)
    })
    if (getCps >= maximumCpsPlace) {
      system.run(() => {
        if (autoAToggle != true) return
        if (player.hasTag("MatrixOP")) return

        Detect.flag(player, 'AutoClicker', 'B', 'kick', [['Cps', getCps, maximumCps]], false)
        Util.setScore(world, player, 'placeCps', 0)
      })
    }
  })
}
