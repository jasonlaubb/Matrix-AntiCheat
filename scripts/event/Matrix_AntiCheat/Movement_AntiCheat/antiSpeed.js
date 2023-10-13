import * as Minecraft from "@minecraft/server"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  Vector,
  Container,
  Player
} from "@minecraft/server"
import {
  antiSpeedEnabled,
  detect
} from "../config"
let world = Minecraft.world
let speedToggle;
let distance;
export async function antiSpeed(player) {
  try {
    try {
      speedToggle = world.scoreboard.getObjective("toggle:speed").displayName
    } catch {
      speedToggle = true
    }
    if (antiSpeedEnabled == true) {
      if (speedToggle != true || player.hasTag("MatrixOP")) return
      let maximumDisMovement;
      maximumDisMovement = 9.5
      let timer = world.scoreboard.getObjective("speedtimer").getScore(player.scoreboardIdentity)
      let firstPosX = world.scoreboard.getObjective("speedX").getScore(player.scoreboardIdentity) / 100
      let firstPosZ = world.scoreboard.getObjective("speedZ").getScore(player.scoreboardIdentity) / 100
      let speedFlags = world.scoreboard.getObjective("speedFlags").getScore(player.scoreboardIdentity)
      let normalMove = world.scoreboard.getObjective("normalS").getScore(player.scoreboardIdentity)
      let trySpeed = world.scoreboard.getObjective("trySpeed").getScore(player.scoreboardIdentity)
      let skipCheck = world.scoreboard.getObjective("skip_check").getScore(player.scoreboardIdentity)
      let theEnd = world.scoreboard.getObjective("the_end").getScore(player.scoreboardIdentity)
      let playerY;
      let playerX;
      let playerZ;
      playerZ = player.location.z.toFixed(2) * 100
      playerX = player.location.x.toFixed(2) * 100
      playerY = player.location.y.toFixed(2) * 100
      playerZ = playerZ.toFixed(0)
      playerX = playerX.toFixed(0)
      playerY = playerY.toFixed(0)
      distance = Math.sqrt((firstPosX - playerX / 100) * (firstPosX - playerX / 100) + (firstPosZ - playerZ / 100) * (
        firstPosZ - playerZ / 100)).toFixed(2)
      let velocity = player.getVelocity();
      let velocityY = velocity.y
      let velocityZ = velocity.z
      let velocityX = velocity.x
      if (normalMove > 5) {
        player.runCommand(`scoreboard players set @s normalS 0`)
        player.runCommand(`scoreboard players set @s speedFlags 0`)
      }
      if (player.isGliding == true && velocityY < 0 || player.hasTag("sleeping") || player.hasTag("riding") || player
        .getEffect("speed") || player.hasTag("MatrixOP")) {
        distance = 0
      }
      if (firstPosX == 0 || firstPosZ == 0) {
        if (playerX == 0 || playerZ == 0) return
        player.runCommand(`scoreboard players set @s speedX ${playerX}`)
        player.runCommand(`scoreboard players set @s speedZ ${playerZ}`)
      }
      if (timer > 19) {
        if (distance < maximumDisMovement) {
          player.runCommand(`scoreboard players add @s normalS 1`)
        }
        player.runCommand(`scoreboard players set @s speedtimer 0`)
        if (distance < maximumDisMovement) {
          player.runCommand(`scoreboard players set @s speedZ ${playerZ}`)
          player.runCommand(`scoreboard players set @s speedX ${playerX}`)
        }
        if (distance > maximumDisMovement) {
          if (speedFlags > 4 && distance > maximumDisMovement) return
          if (player.isGliding == true && velocityY < 0 || player.hasTag("sleeping") || player.hasTag("riding") ||
            player.getEffect("speed") || player.hasTag("skip_check") || player.hasTag("skip_checkS") || player.hasTag(
              "MatrixOP")) return
          player.runCommand(`scoreboard players set @s normalS 0`)
        }
        if (theEnd > 0) {
          if (distance > maximumDisMovement) {
            player.runCommand(`scoreboard players add @s trySpeed 1`)
          }
          if (trySpeed > 1) {
            if (player.isGliding == true && velocityY < 0 || player.hasTag("sleeping") || player.hasTag("riding") ||
              player.getEffect("speed") || player.hasTag("skip_check") || player.hasTag("skip_checkS") || player
              .hasTag("MatrixOP") || skipCheck > 0) return
            player.runCommand(`tp @s ${firstPosX} ${playerY/100} ${firstPosZ}`)
            player.runCommand(
              `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural Movement §gSpeed §8(§gA§8) §chas been detected from §b${player.name} §8(§g${distance}§8/§g${maximumDisMovement}§8) §gblocks"}]}`
              )
            player.runCommand(`scoreboard players set @s trySpeed 0`)
            player.runCommand(`scoreboard players set @s restrySpeed 0`)
          }
        }
        if (!theEnd > 0) {
          if (distance > maximumDisMovement) {
            player.runCommand(`scoreboard players set @s normalS 0`)
            detect(player, "tp", "hi", firstPosX + " " + playerY / 100 + " " + firstPosZ, true,
              "§e[§cMatrix§e] §can unNatural Movement §gSpeed §8(§gA§8) §chas been detected from §b" + player.name +
              " §8(§g" + distance + "§8/§g" + maximumDisMovement + "§8) §gblocks")
            player.runCommand(`scoreboard players set @s trySpeed 0`)
            player.runCommand(`scoreboard players set @s restrySpeed 0`)
          }
        }
      }
      if (player.isGliding == true && velocityY < 0 || player.hasTag("sleeping") || player.hasTag("riding") || player
        .getEffect("speed")) {
        player.runCommand(`scoreboard players set @s speedZ ${playerZ}`)
        player.runCommand(`scoreboard players set @s speedX ${playerX}`)
      }
      if (distance > maximumDisMovement) {
        if (player.hasTag("skip_check") || player.hasTag("skip_checkS")) {
          player.removeTag(`skip_check`)
          player.removeTag(`skip_checkS`)
          player.runCommand(`scoreboard players set @s speedZ ${playerZ}`)
          player.runCommand(`scoreboard players set @s speedX ${playerX}`)
        }
      }
    }
  } catch (error) {
    player.runCommand(`title @s actionbar §c${error} speed`)
  }
}
export {
  distance
}
