import * as Minecraft from "@minecraft/server"
import {
  antiAutoClickerEnabled,
  maximumCps
} from "../../config"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  EffectTypes,
  Vector,
  Container,
  Player
} from "@minecraft/server"
let world = Minecraft.world
let autoToggle;
if (antiAutoClickerEnabled == true) {
  world.afterEvents.entityHitEntity.subscribe((event, entity, hitBlock, hitEntity) => {
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
      attacker.runCommand(`scoreboard players add "${attacker.name}" cps 1`)
      attacker.runCommand(`scoreboard players add "${attacker.name}" cps3 1`)
      if (tryAutoClicker >= 5) {
        if (autoToggle != true) return
        if (attacker.hasTag("MatrixOP")) return
        attacker.runCommand(
          `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gClicking §8(§gA§8) §chas been detected from §b${attacker.name}\n§cCps §8= §8(§g${illegalCps}§8/§g${maximumCps}§8)\n§cTarget§8 = §8(§g${targetName.replaceAll("minecraft:","").replaceAll("_"," ")}§8)"}]}`
          )
        attacker.runCommand(`scoreboard players set @s tryAutoClicker 0`)
        attacker.runCommand(
          `kick "${attacker.name}" .\n§8>> §cYou have been kicked!\n§8>> §gReason§r§8:§cplease Slow your clicking §8(§g${illegalCps}§8/§g${maximumCps}§8)\n§8>> §gBy§8:§cMatrix`
          )
      }
    }
  })
}
system.runInterval(() => {
  for (let player of world.getAllPlayers()) {
    let tryAutoClicker = world.scoreboard.getObjective("tryAutoClicker").getScore(player.scoreboardIdentity)
    let nukerFlag = world.scoreboard.getObjective("sendMsgT").getScore(player.scoreboardIdentity)
    let nukerLength = world.scoreboard.getObjective("nukeLength").getScore(player.scoreboardIdentity)
    let rescps = world.scoreboard.getObjective("rescps4").getScore(player.scoreboardIdentity)
    let cps2 = world.scoreboard.getObjective("cps").getScore(player.scoreboardIdentity)
    let cps;
    if (nukerFlag == 1) {
      player.runCommand(
        `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §gNuker §8(§gA§8) §chas been detected from §b${player.name}\n§cBlocks §8= §8(§g${nukerLength+1}§8/§gBlocks§8)"}]}`
        )
      player.runCommand(`scoreboard players set @s nukeLength 0`)
    }
    cps = world.scoreboard.getObjective("Seccps").getScore(player.scoreboardIdentity)
    if (cps2 >= cps) {
      cps = cps2
    }
    player.runCommand(`scoreboard players set @s trueCps ${cps}`)
    let cps3 = world.scoreboard.getObjective("cps3").getScore(player.scoreboardIdentity)
    let cps4;
    cps4 = world.scoreboard.getObjective("Seccps2").getScore(player.scoreboardIdentity)
    if (cps3 >= cps4) {
      cps4 = cps3
    }
    if (cps4 > maximumCps / 2) {
      player.runCommand(`scoreboard players set @s cps2 ${cps4*2}`)
      player.runCommand(`scoreboard players add @s tryAutoClicker 1`)
    }
    if (tryAutoClicker == 1) {
      if (autoToggle != true) return
      player.runCommand(`title @s title §cdoubel Clicking`)
      player.runCommand(`title @s subtitle §gPlease slow your cps`)
    }
    if (rescps == 9) {
      player.runCommand(`scoreboard players set @s Seccps2 ${cps3}`)
    }
  }
})
