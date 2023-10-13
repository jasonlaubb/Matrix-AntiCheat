import * as Minecraft from "@minecraft/server"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  Vector,
  Container,
  Player,
  Enchantment
} from "@minecraft/server"
import {
  antiSpeed
} from "../Movement_AntiCheat/antiSpeed"
import {
  antiFly
} from "../Movement_AntiCheat/antiFly"
import {
  antiPhase
} from "../Movement_AntiCheat/antiNoClip"
import {
  antiCrasherA
} from "../misc_AntiCheat/Crasher/antiCrasherA"
import {
  antiCrasherB
} from "../misc_AntiCheat/Crasher/antiCrasherB"
import {
  antiCrasherC
} from "../misc_AntiCheat/Crasher/antiCrasherC"
import {
  antiSpeedEnabled,
  antiFlyEnabled,
  antiCrasherEnabled
} from "../config"
let world = Minecraft.world
world.afterEvents.playerSpawn.subscribe((event) => {
  let player = event.player
  player.runCommand(`function Software`)
  try {
    let oldReason;
    let oldBy;
    try {
      for (let tag of getTags) {
        if (tag.startsWith("Reason:")) {
          oldReason = tag.replaceAll("Reason:", "")
        }
        if (tag.startsWith("By:")) {
          oldBy = tag.replaceAll("By:", "")
        }
      }
    } catch {
      oldReason = "nothing"
      oldBy = "nothing"
    }
    let unban = world.scoreboard.getObjective(player.name.toLowerCase()).displayName
    if (unban == player.name.toLowerCase()) {
      player.runCommand(`tag @s remove ban`)
      player.runCommand(`tag @s remove "Reason:${oldReason}"`)
      player.runCommand(`tag @s remove "By:${oldBy}"`)
      player.runCommand(`scoreboard objectives remove "${player.name.toLowerCase()}"`)
      world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ahas been unbanned!`)
    }
  } catch {}
  player.addTag(`skip_check`)
  player.runCommand(`scoreboard players set @s skip_check 100`)
  player.runCommand(`scoreboard players set @s cps2 0`)
  player.runCommand(`scoreboard players set @s tryAutoClicker 0`)
})
system.runInterval(() => {
  for (let player of world.getPlayers()) {
    player.runCommand(`function Software`)
    let banTimer = world.scoreboard.getObjective("bantimer").getScore(player.scoreboardIdentity)
    let cps = world.scoreboard.getObjective("trueCps").getScore(player.scoreboardIdentity)
    let reason;
    let by;
    let tags = player.getTags()
    for (let tag of tags) {
      if (tag.startsWith("Reason:")) {
        reason = tag.replaceAll("Reason:", "")
      }
      if (tag.startsWith("By:")) {
        by = tag.replaceAll("By:", "")
      }
    }
    if (player.hasTag("freeze")) {
      let freezeX = world.scoreboard.getObjective("freezeX").getScore(player.scoreboardIdentity)
      let freezeZ = world.scoreboard.getObjective("freezeZ").getScore(player.scoreboardIdentity)
      let freezeY = world.scoreboard.getObjective("freezeY").getScore(player.scoreboardIdentity)
      player.runCommand(`tp @s ${freezeX} ${freezeY} ${freezeZ}`)
    }
    if (banTimer == 0 && player.hasTag("ban")) {
      player.runCommand(`scoreboard players set @s bantimer 40`)
      player.runCommand(`kick "${player.name}" .\n§8 >> §c§lYou are banned bad boy\n§r§8 >> §gReason§8:§c${reason}\n§8 >> §gBy§8:§c${by}`)
    }
    antiSpeed(player)
    antiFly(player)
    antiPhase(player)
    antiCrasherA(player)
    antiCrasherB(player)
    antiCrasherC(player)
  }
})
