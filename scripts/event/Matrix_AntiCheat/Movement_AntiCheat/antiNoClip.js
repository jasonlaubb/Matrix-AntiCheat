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
  antiPhaseEnabled
} from "../config"
let world = Minecraft.world
let phaseToggle;
export async function antiPhase(player) {
  try {
    phaseToggle = world.scoreboard.getObjective("toggle:phase").displayName
  } catch {
    phaseToggle = true
  }
  if (antiPhaseEnabled == true) {
    if (phaseToggle != true || player.hasTag("MatrixOP")) return
    let firstPosX = world.scoreboard.getObjective("phaseX").getScore(player.scoreboardIdentity) / 100
    let firstPosZ = world.scoreboard.getObjective("phaseZ").getScore(player.scoreboardIdentity) / 100
    let firstPosY = world.scoreboard.getObjective("phaseY").getScore(player.scoreboardIdentity) / 100
    let skipCheck = world.scoreboard.getObjective("skip_check").getScore(player.scoreboardIdentity)
    let playerY;
    let playerX;
    let playerZ;
    playerZ = player.location.z.toFixed(2) * 100
    playerX = player.location.x.toFixed(2) * 100
    playerY = player.location.y.toFixed(2) * 100
    playerZ = playerZ.toFixed(0)
    playerX = playerX.toFixed(0)
    playerY = playerY.toFixed(0)
    let velocity = player.getVelocity();
    let velocityY = velocity.y
    let velocityZ = velocity.z
    let velocityX = velocity.x
    let head = player.dimension.getBlock({
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y + 1),
      z: Math.floor(player.location.z)
    })
    let body = player.dimension.getBlock({
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y),
      z: Math.floor(player.location.z)
    })
    let bypassFP = player.dimension.getBlock({
      x: firstPosX,
      y: firstPosY,
      z: firstPosZ
    })
    let bypassFP2 = player.dimension.getBlock({
      x: firstPosX,
      y: firstPosY + 1,
      z: firstPosZ
    })
    if (firstPosX == 0 || firstPosZ == 0) {
      if (playerX == 0 || playerZ == 0) return
      player.runCommand(`scoreboard players set @s phaseX ${playerX}`)
      player.runCommand(`scoreboard players set @s phaseY ${playerY}`)
      player.runCommand(`scoreboard players set @s phaseZ ${playerZ}`)
    }
    if (head.isSolid == false && body.isSolid == false) {
      player.runCommand(`scoreboard players set @s phaseX ${playerX}`)
      player.runCommand(`scoreboard players set @s phaseY ${playerY}`)
      player.runCommand(`scoreboard players set @s phaseZ ${playerZ}`)
    }
    if (head.isSolid == true || body.isSolid == true) {
      if (bypassFP.isSolid == true || bypassFP2.isSolid == true || body.typeId.includes("soul_sand") && head
        .isSolid == false || player.hasTag("riding")) return
      player.runCommand(`scoreboard players set @s skip_check 3`)
      player.runCommand(`tp ${firstPosX} ${firstPosY} ${firstPosZ}`)
      player.runCommand(
        `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural Movement §gPhase §8(§gA§8) §chas been detected from §b${player.name}"}]}`
        )
    }
  }
}
