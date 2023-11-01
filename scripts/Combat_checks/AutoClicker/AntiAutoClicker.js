import { Detect, Util } from "../../Util/Util";
import {
  antiAutoClickerEnabled,
  maximumCps
} from "../../config"
import {
  system,
  world
} from "@minecraft/server"

const { setScore, addScore } = Util

let autoToggle;
if (antiAutoClickerEnabled == true) {
  world.afterEvents.entityHitEntity.subscribe((event) => {
    try {
      autoToggle = world.scoreboard.getObjective("toggle:auto").displayName
    } catch {
      autoToggle = true
    }
    let attacker = event.damagingEntity
    let target = event.hitEntity
    let targetName;
    if (attacker.typeId == undefined) return
    if (attacker.typeId == "minecraft:player") {
      targetName = target.name
      if (targetName == undefined) {
        targetName = target.typeId
      }
      let cps2 = world.scoreboard.getObjective("cps").getScore(attacker.scoreboardIdentity)
      let illegalCps = world.scoreboard.getObjective("cps2").getScore(attacker.scoreboardIdentity)
      let cps;
      cps = world.scoreboard.getObjective("Seccps").getScore(attacker.scoreboardIdentity)
      if (cps2 => cps) {
        cps = cps2
      }
      let tryAutoClicker = world.scoreboard.getObjective("tryAutoClicker").getScore(attacker.scoreboardIdentity)
      addScore(world, attacker, 'cps', 1)
      addScore(world, attacker, 'cps3', 1)
      if (tryAutoClicker >= 5) {
        if (autoToggle != true) return
        if (attacker.hasTag("MatrixOP")) return
        Detect.flag(attacker, 'AutoClicker', 'A', 'kick', [['Cps', illegalCps, maximumCps],['Target', targetName.replace("minecraft:","").replaceAll("_"," ")]], false)
        setScore(world, attacker, 'tryAutoClicker', 0)
      }
    }
  })
}
async function nukerCPS (player) {
  let tryAutoClicker = world.scoreboard.getObjective("tryAutoClicker").getScore(player.scoreboardIdentity)
  let nukerFlag = world.scoreboard.getObjective("sendMsgT").getScore(player.scoreboardIdentity)
  let nukerLength = world.scoreboard.getObjective("nukeLength").getScore(player.scoreboardIdentity)
  let rescps = world.scoreboard.getObjective("rescps4").getScore(player.scoreboardIdentity)
  let cps2 = world.scoreboard.getObjective("cps").getScore(player.scoreboardIdentity)
  let cps;
  if (nukerFlag == 1) {
    Detect.flag(player, 'Nuker', 'A', 'none', [['Blocks', nukerLength + 1, 'Blocks']], false)
    setScore(world,player,"nukeLength",0)
  }
  cps = world.scoreboard.getObjective("Seccps").getScore(player.scoreboardIdentity)
  if (cps2 >= cps) {
    cps = cps2
  }
  setScore(world,player,"trueCps",cps)

  let cps3 = world.scoreboard.getObjective("cps3").getScore(player.scoreboardIdentity)
  let cps4;
  cps4 = world.scoreboard.getObjective("Seccps2").getScore(player.scoreboardIdentity)
  if (cps3 >= cps4) {
    cps4 = cps3
  }
  if (cps4 > maximumCps / 2) {
    setScore(world,player,"cps2",cps4*2)
    addScore(world,player,"tryAutoClicker",1)
  }
  if (tryAutoClicker == 1) {
    if (autoToggle != true) return
      player.onScreenDisplay.setTitle('§cdoubel Clicking')
      player.onScreenDisplay.updateSubtitle('§gPlease slow your cps')
    if (rescps == 9) {
      setScore(world,player,"Seccps2",cps3)
    }
  }
}

export { nukerCPS }
