import * as Minecraft from "@minecraft/server"
import { system, ItemStack, world, ItemEnchantsComponent, Vector, Container,Player } from "@minecraft/server"
import { antiFlyEnabled,detect }  from "../config"
let world = Minecraft.world

let flyToggle;
export async function antiFlyC(player){
	try{
	try{
		flyToggle = world.scoreboard.getObjective("toggle:fly").displayName 
		} catch {
		flyToggle = true 
			} 
	if(antiFlyEnabled == true){
		if (flyToggle != true || player.isFlying || player.hasTag("MatrixOP")) return
	
	let maximumDisMovement;
	maximumDisMovement = 1
	
let firstPosY = world.scoreboard.getObjective("groundY").getScore(player.scoreboardIdentity)/100
let firstPosX = world.scoreboard.getObjective("groundX").getScore(player.scoreboardIdentity)/100
let firstPosZ = world.scoreboard.getObjective("groundZ").getScore(player.scoreboardIdentity)/100
	let velocityYTime = world.scoreboard.getObjective("startMovingUp").getScore(player.scoreboardIdentity)
	let skip_check = world.scoreboard.getObjective("skip_check").getScore(player.scoreboardIdentity)
    let playerY; 
    let playerX; 
    let playerZ; 
    
    playerZ = player.location.z.toFixed(2)*100
    playerX = player.location.x.toFixed(2)*100
    playerY = player.location.y.toFixed(2)*100
    playerZ = playerZ.toFixed(0)
    playerX = playerX.toFixed(0)
    playerY = playerY.toFixed(0)
    
    let velocity = player.getVelocity(); 
    let velocityY = velocity.y
    let velocityZ = velocity.z
    let velocityX = velocity.x
    
    if(velocityY<0){
      player.runCommand(`scoreboard players set @s groundX ${playerX}`)
player.runCommand(`scoreboard players set @s groundY ${playerY}`)
player.runCommand(`scoreboard players set @s groundZ ${playerZ}`)
    }
     if(velocityY>maximumDisMovement){
      
        player.runCommand(`scoreboard players set @s skip_check 3`)
        detect(player,"tp",null,firstPosX+" "+firstPosY+" "+firstPosZ,true,"§e[§cMatrix§e] §can unNatural Movement §gFly §8(§gC§8) §cfrom §b"+player.name+" §8(§g"+velocityY+"§8/§g"+maximumDisMovement+"§8)")
        
      
    }
      }}catch (error){
      	player.runCommand(`title @s actionbar §c${error}`) 
}} 