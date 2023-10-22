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
  detect,
  setScore,
  addScore
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
      maximumDisMovement = 2.5
      
      let firstPosX = world.scoreboard.getObjective("speedX").getScore(player.scoreboardIdentity) / 100
       let firstPosY = world.scoreboard.getObjective("speedY").getScore(player.scoreboardIdentity) / 100
      let firstPosZ = world.scoreboard.getObjective("speedZ").getScore(player.scoreboardIdentity) / 100
      let skipCheck = world.scoreboard.getObjective("skip_check").getScore(player.scoreboardIdentity)
      
      let playerY;
      let playerX;
      let playerZ;
      playerZ = player.location.z.toFixed(2) * 100
      playerX = player.location.x.toFixed(2) * 100
      playerY = player.location.y.toFixed(2) * 100
    
      
      let velocity = player.getVelocity();
      let velocityY = velocity.y
      let velocityZ = velocity.z
      let velocityX = velocity.x
      let distanceX = velocityX
      let distanceZ = velocityZ
      
      if (player.isGliding == true || player.hasTag("sleeping") || player.hasTag("riding") || player
        .getEffect("speed") || player.hasTag("MatrixOP")) {
        distanceX = 0
        distanceZ = 0
      }

      if (firstPosX == 0 || firstPosZ == 0) {
        if (playerX == 0 || playerZ == 0) return
      setScore(world,player,"speedZ",playerZ)
        setScore(world,player,"speedY",playerY)
          setScore(world,player,"speedX",playerX)
      }
      
        if (Math.abs(distanceX) < maximumDisMovement || Math.abs(distanceZ) < maximumDisMovement) {
         setScore(world,player,"speedZ",playerZ)
        setScore(world,player,"speedY",playerY)
          setScore(world,player,"speedX",playerX)
        }
        
if (player.isGliding == true || player.hasTag("sleeping") || player.hasTag("riding") || player
        .getEffect("speed") || skipCheck>0) {
        
      setScore(world,player,"speedZ",playerZ)
        setScore(world,player,"speedY",playerY)
          setScore(world,player,"speedX",playerX)
      }
let distance;
if(Math.abs(distanceX)>Math.abs(distanceZ)){
  distance = Math.abs(distanceX)+" X"
}if(Math.abs(distanceX)<Math.abs(distanceZ)){
  distance = Math.abs(distanceZ)+" Z"
}

          if (Math.abs(distanceX) > maximumDisMovement || Math.abs(distanceZ) > maximumDisMovement) {
if( skipCheck>0 || player.hasTag("riding")) return
            
            
                         
            detect(player, "tp", null, firstPosX + " " + firstPosY + " " + firstPosZ, true,
              "§e[§cMatrix§e] §can unNatural Movement §gSpeed §8(§gA§8) §chas been detected from §b" + player.name +
              " §8(§g" + distance + "§8/§g" + maximumDisMovement + "§8) §gblocks")
          
          }
        }
    } catch (error) {
    player.runCommand(`title @s actionbar §c${error} speed`)
  }
}
export {
  distance
}
