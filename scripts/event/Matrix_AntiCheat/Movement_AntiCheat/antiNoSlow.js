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
export async function antiNoSlow(player) {
  try {
    try {
      speedToggle = world.scoreboard.getObjective("toggle:NoSlow").displayName
    } catch {
      speedToggle = true
    }
    if (antiSpeedEnabled == true) {
      if (speedToggle != true || player.hasTag("MatrixOP")) return
let firstPosY = world.scoreboard.getObjective("PosYS").getScore(player.scoreboardIdentity)/100
let firstPosX = world.scoreboard.getObjective("PosXS").getScore(player.scoreboardIdentity)/100
let firstPosZ = world.scoreboard.getObjective("PosZS").getScore(player.scoreboardIdentity)/100
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
      let head = player.dimension.getBlock({ x: Math.floor(player.location.x) , y: Math.floor(player.location.y+1), z: Math.floor(player.location.z) }).typeId;
      let body = player.dimension.getBlock({ x: Math.floor(player.location.x) , y: Math.floor(player.location.y), z: Math.floor(player.location.z) }).typeId;
if(head.includes("web") || body.includes("web") || player.hasTag("is_using_item")){
        if(velocityZ<0.040 || velocityX<0.040|| velocityX>-0.040 || velocityZ>-0.040){
          player.runCommand(`scoreboard players set @s PosXS ${playerX}`)
player.runCommand(`scoreboard players set @s PosYS ${playerY}`)
player.runCommand(`scoreboard players set @s PosZS ${playerZ}`)
        }}
      if(head.includes("web") || body.includes("web") || player.hasTag("is_using_item")){
        if(velocityZ>0.040 || velocityX>0.040|| velocityX<-0.040 || velocityZ<-0.040){
          
          detect(player,"tp",null,firstPosX+" "+firstPosY+" "+firstPosZ,true,"§e[§cMatrix§e] §can unNatural Movement §gNoSlow §8(§gA§8)")
          
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
