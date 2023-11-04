//@ts-check
import { Detect } from "../../Util/Util"
import { system, Player } from "@minecraft/server"

/** @param {Player} player */
function spammer (player) {
  if (player.hasTag("MatrixOP")) return false
  if (player.hasTag("gui")) {
    system.run(() => Detect.flag(player, "spammer", "A", "kick", null, false, null))
    return true
  }
  if (player.hasTag("gui")) {
    system.run(() => Detect.flag(player, "spammer", "B", "kick", null, false, null))
    return true
  }
  
  return false
}

export { spammer }
