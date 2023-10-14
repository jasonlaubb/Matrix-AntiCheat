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
const world = Minecraft.world

world.afterEvents.playerSpawn.subscribe((event) => {
  let player = event.player
  player.runCommand(`function Software`)
  try {
    const tags = player.getTags();
    const oldReason = (tags.filter(tag => tag.startsWith("Reason:"))[0] ?? "nothing").replace("Reason:","")
    const oldBy = (tags.filter(tag => tag.startsWith("By:"))[0] ?? "nothing").replace("By:","")
    
    const unban = world.scoreboard.getObjective(player.name.toLowerCase()).displayName
    if (unban == player.name.toLowerCase()) {
      player.runCommand(`tag @s remove ban`)
      player.runCommand(`tag @s remove "Reason:${oldReason}"`)
      player.runCommand(`tag @s remove "By:${oldBy}"`)
      player.runCommand(`scoreboard objectives remove "${player.name.toLowerCase()}"`)
      world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ahas been unbanned!`)
    }
  } catch { }
  player.addTag(`skip_check`)
  player.runCommand(`scoreboard players set @s skip_check 100`)
  player.runCommand(`scoreboard players set @s cps2 0`)
  player.runCommand(`scoreboard players set @s tryAutoClicker 0`)
})
system.runInterval(() => {
  for (let player of world.getPlayers()) {
    player.runCommand(`function Software`)
    const banTimer = world.scoreboard.getObjective("bantimer").getScore(player.scoreboardIdentity)
    const cps = world.scoreboard.getObjective("trueCps").getScore(player.scoreboardIdentity)
    const tags = player.getTags()
    const reason = (tags.filter(tag => tag.startsWith("Reason:"))[0] ?? "nothing").replace("Reason:","")
    const by = (tags.filter(tag => tag.startsWith("By:"))[0] ?? "nothing").replace("By:","")
    
    if (player.hasTag("freeze")) {
      const freezeX = world.scoreboard.getObjective("freezeX").getScore(player.scoreboardIdentity)
      const freezeZ = world.scoreboard.getObjective("freezeZ").getScore(player.scoreboardIdentity)
      const freezeY = world.scoreboard.getObjective("freezeY").getScore(player.scoreboardIdentity)
      
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
