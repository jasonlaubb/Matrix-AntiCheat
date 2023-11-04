//@ts-check
import {
  antiXrayEnabled,
  xray
} from "../../config"
import {
  system,
  world
} from "@minecraft/server"
import { Detect, Util } from "../../Util/Util";

//* check toggle if enabled 
if (antiXrayEnabled == true) {
  world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const xrayToggle = !world.getDynamicProperty("toggle:xray")
    let player = event.player
    let block = event.block
    let xrayFlags = world.scoreboard.getObjective("xray").getScore(player.scoreboardIdentity)

    //* clone block before broken
    if (xray.includes(block.type.id)) {
      if (xrayToggle === false) return
      system.run(() => {
        Util.addScore(player, 'xray', 1)
      })
    }
    if (xrayFlags >= 5) {
      system.run(() => {
        if (xrayToggle != true) return
        if (player.hasTag("MatrixOP")) return
        Detect.notifyToTag(
          `§gXray notification:\n§b${player.name} §chas found  §8(§g${block.type.id.replaceAll("minecraft:","").replaceAll("_"," ")}§8)`,
          'notifyXray'
        )
        Util.setScore(player, 'xray', 0)
      })
    }
  })
}
