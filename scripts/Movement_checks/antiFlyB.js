import * as Minecraft from "@minecraft/server"
import { system, ItemStack, world, ItemEnchantsComponent, Vector, Container,Player } from "@minecraft/server"
import { antiFlyEnabled,detect }  from "../config"
let world = Minecraft.world

let flyToggle;
export async function antiFlyB(player){
	try{
	try{
		flyToggle = world.scoreboard.getObjective("toggle:fly").displayName 
		} catch {
		flyToggle = true 
			} 
	if(antiFlyEnabled == true){
		if (flyToggle != true || player.hasTag("MatrixOP")) return
	
	let groundX = world.scoreboard.getObjective("groundX").getScore(player.scoreboardIdentity)/100
	let groundY = world.scoreboard.getObjective("groundY").getScore(player.scoreboardIdentity)/100
	let groundZ = world.scoreboard.getObjective("groundZ").getScore(player.scoreboardIdentity)/100
let flyTimer = world.scoreboard.getObjective("flyTimer").getScore(player.scoreboardIdentity)
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
    if (groundX == 0 && groundZ == 0 && groundY == 0){
    	if (playerY == 0 && playerZ == 0 && playerX == 0) return 
    player.runCommand(`scoreboard players set @s groundX ${playerX}`) 
    player.runCommand(`scoreboard players set @s groundZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s groundY ${playerY}`) 
    	}
    if(player.isOnGround == true){
    	player.runCommand(`scoreboard players set @s groundX ${playerX}`) 
    player.runCommand(`scoreboard players set @s groundZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s groundY ${playerY}`) 
    
    	} 
    if(velocityY == 0 && player.isOnGround == false){
    player.runCommand(`scoreboard players add @s flyTimer 2`) 
    	} if(flyTimer>14){
    	if(player.hasTag("MatrixOP")) return 
        player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural Movement §gFly §8(§gb§8) §chas been detected from §b${player.name} §8(§gvelocity §8(§gY§8) = §c${velocityY}§8) §gblocks"}]}`) 
      	player.runCommand(`tp @s ${groundX} ${groundY} ${groundZ}`) 
      player.runCommand(`scoreboard players set @s skip_check 3`) 
      player.runCommand(`scoreboard players set @s flyTimer 0`) 
    	} 
      }}catch (error){
      	player.runCommand(`title @s actionbar §c${error}`) 
}} 