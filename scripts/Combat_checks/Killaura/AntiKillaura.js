//@ts-check
import {
  antiKillauraEnabled, 
} from "../../config"

import {
  Player,
  world
} from "@minecraft/server"

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
