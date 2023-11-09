import * as Minecraft from "@minecraft/server"
import {
  antiKillauraEnabled, 
  setScore, 
  addScore
} from "../../config"
import {
  disXZ
} from "../Reach/AntiReach"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  Vector,
  Container
} from "@minecraft/server"
let world = Minecraft.world
let killauraToggle;
if (antiKillauraEnabled == true) {
  world.afterEvents.entityHitEntity.subscribe((event) => {
    try {
      killauraToggle = world.scoreboard.getObjective("toggle:killaura").displayName
    } catch {
      killauraToggle = true
    }
    if (killauraToggle != true) return
    let attacker = event.damagingEntity
    let target = event.hitEntity
    let targetName;
    if (attacker == undefined) return
    if (attacker.typeId == "minecraft:player") {
      let is_using_block = world.scoreboard.getObjective("block").getScore(attacker.scoreboardIdentity)
      let targetName;
      targetName = target.name;
      if (targetName == undefined) {
        targetName = target.typeId.replaceAll("minecraft:", "");
        targetName = targetName.replaceAll("_", "");
      }
      let {
        x,
        y,
        z
      } = target.location;
      let {
        x: attackerx,
        y: attackery,
        z: attackerz
      } = attacker.location;
      if (attacker.hasTag("is_using_item") || is_using_block > 0) {
        if (attacker.hasTag("MatrixOP")) return
        world.sendMessage(
          `§e[§cMatrix§e] §b${attacker.name} §chas been kicked!§r\n§gBy§8:§cMatrix\n§gReason§8:§ckillaura §8(§gA§8)§r`
          )
        attacker.runCommand(
          `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §gkillaura §8(§gA§8) §chas been detected from §b${attacker.name}\n§cTarget§8 = §8(§g${targetName}§8)"}]}`
          )
        attacker.runCommand(
          `kick "${attacker.name}" .\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§ckillaura §8(§gA§8)§r\n§8 >> §gBy§8:§cMatrix`
          )
      }
    }
  })
}
