//@ts-check
import {
  world,
  Player
} from "@minecraft/server"
import {
  antiPhaseEnabled,
  detect,
  setScore,
} from "../config"


/** @param {Player} player */
export async function antiPhase(player) {
  const phaseToggle = !world.getDynamicProperty('toggle:phase')
  if (antiPhaseEnabled == true) {
    if (phaseToggle != true || player.hasTag("MatrixOP")) return
    let firstPosX = world.scoreboard.getObjective("phaseX").getScore(player.scoreboardIdentity) / 100
    let firstPosZ = world.scoreboard.getObjective("phaseZ").getScore(player.scoreboardIdentity) / 100
    let firstPosY = world.scoreboard.getObjective("phaseY").getScore(player.scoreboardIdentity) / 100
    let skipCheck = world.scoreboard.getObjective("skip_check").getScore(player.scoreboardIdentity)
    let playerY;
    let playerX;
    let playerZ;
    playerZ = Number(player.location.z.toFixed(2)) * 100
    playerX = Number(player.location.x.toFixed(2)) * 100
    playerY = Number(player.location.y.toFixed(2)) * 100
    
    let velocity = player.getVelocity();
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
      setScore(world,player,"phaseZ",playerZ)
        setScore(world,player,"phaseY",playerY)
          setScore(world,player,"phaseX",playerX)
    }
    if (head.isSolid == false && body.isSolid == false) {
      setScore(world,player,"phaseZ",playerZ)
        setScore(world,player,"phaseY",playerY)
          setScore(world,player,"phaseX",playerX)
    }
    if (head.isSolid == true || body.isSolid == true) {
      if (bypassFP.isSolid == true || bypassFP2.isSolid == true || body.typeId.includes("soul_sand") && head
        .isSolid == false || player.hasTag("riding") || player.isSwimming == true || player.isGliding &&  body.isSolid == true) return
detect(player,"tp",null,firstPosX+"  "+firstPosY+" "+firstPosZ,true,"§g[§cMatrix§g] §can unNatural Movement §gPhase §8(§gA§8) §chas been detected from §b"+player.name)
     
    }
  }
}
