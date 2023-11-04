//@ts-check
import {
  world,
  Player
} from "@minecraft/server"
import {
  antiSpeedEnabled,
  detect,
  setScore
} from "../config"

let speedToggle;
let distance;

/** @param {Player} player */
export async function antiNoSlow(player) {
  try {
    const speedToggle = !world.getDynamicProperty('toggle:NoSlow')
    if (antiSpeedEnabled == true) {
      if (speedToggle != true || player.hasTag("MatrixOP")) return
let firstPosY = world.scoreboard.getObjective("PosYS").getScore(player.scoreboardIdentity)/100
let firstPosX = world.scoreboard.getObjective("PosXS").getScore(player.scoreboardIdentity)/100
let firstPosZ = world.scoreboard.getObjective("PosZS").getScore(player.scoreboardIdentity)/100

      let playerY;
      let playerX;
      let playerZ;
      playerZ = Number(player.location.z.toFixed(2)) * 100
      playerX = Number(player.location.x.toFixed(2)) * 100
      playerY = Number(player.location.y.toFixed(2)) * 100
      
      
      let velocity = player.getVelocity();
      let velocityY = velocity.y
      let velocityZ = velocity.z
      let velocityX = velocity.x
      let head = player.dimension.getBlock({ x: Math.floor(player.location.x) , y: Math.floor(player.location.y+1), z: Math.floor(player.location.z) }).typeId;
      let body = player.dimension.getBlock({ x: Math.floor(player.location.x) , y: Math.floor(player.location.y), z: Math.floor(player.location.z) }).typeId;
if(head.includes("web") || body.includes("web")){
        if(velocityZ<0.040 || velocityX<0.040|| velocityX>-0.040 || velocityZ>-0.040 ){
          
          setScore(world,player,"PosZS",playerZ)
        setScore(world,player,"PosYS",playerY)
          setScore(world,player,"PosXS",playerX)
        }}
      if(head.includes("web") || body.includes("web")){
        if(velocityZ>0.040 || velocityX>0.040|| velocityX<-0.040 || velocityZ<-0.040){
          
          detect(player,"tp",null,firstPosX+" "+firstPosY+" "+firstPosZ,true,"§e[§cMatrix§e] §can unNatural Movement §gNoSlow §8(§gA§8)")
          
        }
      }
    }
  } catch (error) {
    player.runCommand(`title @s actionbar §c${error} Noslow`)
  }
}
export {
  distance
}
