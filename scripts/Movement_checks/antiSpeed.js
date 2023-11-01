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
import {
  LocalData 
  } from "../Util/DataBase"
let world = Minecraft.world

let speedToggle;
let distance;
let wasAttacked  = new LocalData("attack") 
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
      if(wasAttacked.get(player) == undefined){
      	wasAttacked.set(player,0)
      	} 
      if(wasAttacked.get(player)  >= 1){
      wasAttacked.set(player,wasAttacked.get(player)-1)
      maximumDisMovement = 2.5
      } if(wasAttacked.get(player)  < 1){
 	maximumDisMovement = 0.7
      	} 
      
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
      let distanceXZ = Math.sqrt(velocityX*velocityX+velocityZ*velocityZ)
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
      
        if (distanceXZ < maximumDisMovement && Math.abs(velocityX) < maximumDisMovement && Math.abs(velocityZ) < maximumDisMovement) {
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
if(distanceXZ > Math.abs(velocityX) && distanceXZ > Math.abs(velocityZ)){
	distance = distanceXZ 
	} 
if(distanceXZ < Math.abs(velocityX) && Math.abs(velocityX) > Math.abs(velocityZ)){
	distance = Math.abs(velocityX) 
	} 
	if(distanceXZ < Math.abs(velocityZ) && Math.abs(velocityZ) > Math.abs(velocityX)){
	distance = Math.abs(velocityZ) 
	} 

          if (distanceXZ > maximumDisMovement || Math.abs(velocityX) > maximumDisMovement || Math.abs(velocityZ) > maximumDisMovement) {
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
world.afterEvents.entityHurt.subscribe((event) => {
   const attacker = event.damageSource.damagingEntity
    const target = event.hurtEntity
    wasAttacked.set(attacker,30)
    }) 
export {
  distance
}
