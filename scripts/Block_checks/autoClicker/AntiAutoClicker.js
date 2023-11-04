//@ts-check
import {
  antiAutoClickerEnabled,
  maximumCpsPlace
} from "../../config"
import {
  system,
  world
} from "@minecraft/server"
import { Detect, Util } from "../../Util/Util"

if (antiAutoClickerEnabled == true) {
  world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const autoAToggle = !world.getDynamicProperty("toggle:autoA")
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
        if (autoAToggle === false) return
        if (player.hasTag("MatrixOP")) return

        Detect.flag(player, 'AutoClicker', 'B', 'kick', [['Cps', getCps, maximumCpsPlace]], false, null)
        Util.setScore(world, player, 'placeCps', 0)
      })
    }
  })
}
