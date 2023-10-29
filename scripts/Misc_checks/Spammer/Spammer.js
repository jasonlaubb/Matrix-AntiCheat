import { Detect } from "../../Util/Util"

function spammer (player) {
  if (player.hasTag("MatrixOP")) return false
  if (player.hasTag("gui")) {
    system.run(() => Detect.flag(player, "spammer", "A", "kick", null, false))
    return true
  }
  if (player.hasTag("gui")) {
    system.run(() => Detect.flag(player, "spammer", "B", "kick", null, false))
    return true
  }
  
  return false
}

export { spammer }
