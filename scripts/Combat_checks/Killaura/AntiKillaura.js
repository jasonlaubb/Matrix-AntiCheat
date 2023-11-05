//@ts-check
import {
  antiKillauraEnabled, 
} from "../../config"

import {
  Player,
  world
} from "@minecraft/server"
import {
  disXZ
} from "../Reach/AntiReach"
if (antiKillauraEnabled == true) {
  world.afterEvents.entityHitEntity.subscribe((event) => {
    const killauraToggle = !world.getDynamicProperty('toggle:killaura')
    if (killauraToggle != true) return
    let attacker = event.damagingEntity
    let target = event.hitEntity

    if (attacker instanceof Player) {
      let is_using_block = world.scoreboard.getObjective("block").getScore(attacker.scoreboardIdentity)
      let targetName;
      //@ts-expect-error
      targetName = target.name;
      if (targetName == undefined) {
        targetName = target.typeId.replaceAll("minecraft:", "");
        targetName = targetName.replaceAll("_", "");
      }

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
world.afterEvents.entityHurt.subscribe((event) => {
   const explode = event.damageSource.cause
   const attacker = event.damageSource.damagingEntity
    const target = event.hurtEntity
  if (disXZ >= 2) {
        if (attacker.hasTag("MatrixOP")) return
        const getVector = (p1, p2) => ({
          x: p2.x - p1.x,
          y: p2.y - p1.y,
          z: p2.z - p1.z
        });
        const getNDP = (v1, v2) => (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z) / (Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2
          .z ** 2) * Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2));
        const angle = Math.acos(getNDP(attacker.getViewDirection(), getVector(attacker.location, target.location))) *
          (180 / Math.PI);
        if (angle > 90) {
          //this anti killaura by obsidian antiCheat ravrvir i set your copyrights dont worry about that
          world.sendMessage(
            `§e[§cMatrix§e] §b${attacker.name} §chas been kicked!§r\n§gBy§8:§cMatrix\n§gReason§8:§ckillaura §8(§gB§8)§r`
            )
          attacker.runCommand(
            `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §gkillaura §8(§gB§8) §chas been detected from §b${attacker.name}\n§cangle §8= §8(§g${angle}§8/§g90§8)\n§cTarget§8 = §8(§g${targetName}§8)"}]}`
            )
          attacker.runCommand(
            `kick "${attacker.name}" .\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§ckillaura §8(§gB§8) §cangle §8= §8(§g${angle}§8/§g90§8)§r\n§8 >> §gBy§8:§cMatrix`
            )
        }
                         }
          })
                  
