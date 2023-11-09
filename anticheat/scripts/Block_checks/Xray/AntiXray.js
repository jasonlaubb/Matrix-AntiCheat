import * as Minecraft from "@minecraft/server"
import {
  antiXrayEnabled,
  xray
} from "../../config"
import {
  system,
  world
} from "@minecraft/server"
import { Detect, Util } from "../../Util/Util";
let world = Minecraft.world
//* check toggle if enabled 
let xrayToggle;
if (antiXrayEnabled == true) {
  world.beforeEvents.playerBreakBlock.subscribe((event) => {
    try {
      xrayToggle = world.scoreboard.getObjective("toggle:xray").displayName
    } catch {
      xrayToggle = true
    }
    let player = event.player
    let block = event.block
    let xrayFlags = world.scoreboard.getObjective("xray").getScore(player.scoreboardIdentity)

    //* clone block before broken
    if (xray.includes(block.type.id)) {
      if (xrayToggle != true) return
      system.run(() => {
        Util.addScore(player, 'xray', 1)
      })
    }
    if (xrayFlags >= 5) {
      system.run(() => {
        if (xrayToggle != true) return
        if (player.hasTag("MatrixOP")) return
        Detect.notifyToTag(
          `§gXray notification:\n§b${player.name} §chas found  §8(§g${brokenBlock.type.id.replaceAll("minecraft:","").replaceAll("_"," ")}§8)`,
          'notifyXray'
        )
        Util.setScore(world, player, 'xray', 0)
      })
    }
  })
}
