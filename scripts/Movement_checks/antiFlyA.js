import * as Minecraft from "@minecraft/server"
import { system, ItemStack, world, ItemEnchantsComponent, Vector, Container,Player } from "@minecraft/server"
import { antiFlyEnabled,detect }  from "../config"
let world = Minecraft.world

let flyToggle;
export async function antiFlyA(player){
	try{
	try{
		flyToggle = world.scoreboard.getObjective("toggle:fly").displayName 
		} catch {
		flyToggle = true 
			} 
	if(antiFlyEnabled == true){
		if (flyToggle != true || player.isFlying || player.hasTag("MatrixOP")) return
	let maximumDisMovement; 
	maximumDisMovement = 1.3
	
	let firstPosX = world.scoreboard.getObjective("flyX").getScore(player.scoreboardIdentity)/100
	let firstPosY = world.scoreboard.getObjective("flyY").getScore(player.scoreboardIdentity)/100
	let firstPosZ = world.scoreboard.getObjective("flyZ").getScore(player.scoreboardIdentity)/100
	let flyTp = world.scoreboard.getObjective("flyTp").getScore(player.scoreboardIdentity)
	let tryFly = world.scoreboard.getObjective("tryFly").getScore(player.scoreboardIdentity)
	let skip_check = world.scoreboard.getObjective("skip_check").getScore(player.scoreboardIdentity)
	let normalF = world.scoreboard.getObjective("normalF").getScore(player.scoreboardIdentity)
	let flyFlags = world.scoreboard.getObjective("flyFlags").getScore(player.scoreboardIdentity)
	let theEnd = world.scoreboard.getObjective("the_end").getScore(player.scoreboardIdentity)
    let playerY; 
    let playerX; 
    let playerZ; 
    
    playerZ = player.location.z.toFixed(2)*100
    playerX = player.location.x.toFixed(2)*100
    playerY = player.location.y.toFixed(2)*100
    playerZ = playerZ.toFixed(0)
    playerX = playerX.toFixed(0)
    playerY = playerY.toFixed(0)
    let distance;
    
 distance = Math.sqrt((firstPosY-player.location.y.toFixed(2))*(firstPosY-player.location.y.toFixed(2))) 
    let velocity = player.getVelocity(); 
    let velocityY = velocity.y
    let velocityZ = velocity.z
    let velocityX = velocity.x
    if(theEnd>0){
    if(normalF>199){
    	player.runCommand(`scoreboard players set @s normalF 0`) 
        player.runCommand(`scoreboard players set @s flyFlags 0`) 
        player.runCommand(`scoreboard players set @s flyTry 0`) 
        } 
     if (  player.hasTag("sleeping")  ||  velocityY<0 || player.getEffect("jump_boost") || player.getEffect("levitation") || player.hasTag("MatrixOP")){
     	player.runCommand(`scoreboard players set @s flyZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s flyX ${playerX}`) 
    player.runCommand(`scoreboard players set @s flyY ${playerY}`) 
 	 
     
     
      	distance = 0
     	} 
    if (distance>maximumDisMovement && player.hasTag("skip_check")){
    player.runCommand(`tag @s remove skip_check`) 
	player.runCommand(`scoreboard players set @s flyZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s flyX ${playerX}`) 
    player.runCommand(`scoreboard players set @s flyY ${playerY}`) 
 
     
     
      	distance = 0
      }
    if (firstPosX == 0 && firstPosZ == 0 && firstPosY == 0){
    	if (playerY == 0 && playerZ == 0 && playerX == 0) return 
    player.runCommand(`scoreboard players set @s flyX ${playerX}`) 
    player.runCommand(`scoreboard players set @s flyZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s flyY ${playerY}`) 
 
     
     
    	}

 if(distance<maximumDisMovement){
    	player.runCommand(`scoreboard players add @s normalF 1`) 
    	} 
    player.runCommand(`scoreboard players set @s flytimer 0`) 
    if(distance>maximumDisMovement){
    	player.runCommand(`scoreboard players set @s normalF 0`) 
        player.runCommand(`scoreboard players set @s flyTp 2`) 
        player.runCommand(`scoreboard players add @s flyTry 1`) 
        } 
      if (flyTp == 1){
      	if(distance<maximumDisMovement || player.hasTag("skip_check") || skip_check>0) return 
      	player.runCommand(`scoreboard players add @s flyFlags 1`)
          player.runCommand(`scoreboard players set @s skip_check 10`)  
          player.runCommand(`scoreboard players add @s tryFly 1`) 
      	} 
 if(flyTp == 1 && tryFly>1){
      	if(distance<maximumDisMovement || player.hasTag("skip_check")) return 
      	player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural Movement §gFly §8(§gA§8) §chas been detected from §b${player.name} §8(§g${distance.toFixed(2)}§8/§g${maximumDisMovement}§8) §gblocks"}]}`) 
      	player.runCommand(`tp @s ${firstPosX} ${firstPosY} ${firstPosZ}`)
          player.runCommand(`scoreboard players set @s tryFly 0`) 
          player.runCommand(`scoreboard players set @s resTryFly 0`) 
      	} 
      if (  player.hasTag("sleeping")  || velocityY<0 || distance<maximumDisMovement){
      	if (flyTp>0) return 
	player.runCommand(`scoreboard players set @s flyZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s flyX ${playerX}`) 
    player.runCommand(`scoreboard players set @s flyY ${playerY}`) 
      	} 
      if (flyFlags>= 4 && distance>maximumDisMovement){
      	player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural Movement §gFly §8(§gA§8) §chas been detected from §b${player.name} §8(§g${distance.toFixed(2)}§8/§g${maximumDisMovement}§8) §gblocks"}]}`) 
      	player.runCommand(`tp @s ${firstPosX} ${firstPosY} ${firstPosZ}`)
          player.runCommand(`scoreboard players set @s tryFly 0`) 
          player.runCommand(`scoreboard players set @s resTryFly 0`) 
      	player.runCommand(`scoreboard players set @s flyFlags 0`) 
          player.addTag(`ban`) 
          player.addTag(`Reason:§cFly §8(§gA§8) §cDistance §8= (§g${distance.toFixed(2)}§8/§g${maximumDisMovement}§8) §gBlocks`) 
          player.addTag(`By:§cMatrix§r`) 
          world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been banned!§r\n§gReason§8:§gFly §8(§gA§8) §cDistance §8= (§g${distance.toFixed(2)}§8/§g${maximumDisMovement}§8) §gBlocks\n§gBy§8:§cMatrix`) 
      	}} if(!theEnd>0){
      	if(normalF>399){
    	player.runCommand(`scoreboard players set @s normalF 0`) 
        player.runCommand(`scoreboard players set @s flyFlags 0`) 
        } 
     if (  player.hasTag("sleeping")  ||  velocityY<0 || player.getEffect("jump_boost") || player.getEffect("levitation") || player.hasTag("MatrixOP")){
     	player.runCommand(`scoreboard players set @s flyZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s flyX ${playerX}`) 
    player.runCommand(`scoreboard players set @s flyY ${playerY}`) 
      	distance = 0
     	} 
    if (distance>maximumDisMovement && player.hasTag("skip_check")){
    player.runCommand(`tag @s remove skip_check`) 
	player.runCommand(`scoreboard players set @s flyZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s flyX ${playerX}`) 
    player.runCommand(`scoreboard players set @s flyY ${playerY}`) 
      	distance = 0
      }
    if (firstPosX == 0 && firstPosZ == 0 && firstPosY == 0){
    	if (playerY == 0 && playerZ == 0 && playerX == 0) return 
    player.runCommand(`scoreboard players set @s flyX ${playerX}`) 
    player.runCommand(`scoreboard players set @s flyZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s flyY ${playerY}`) 
 
     
     
    	} if(distance<maximumDisMovement){
    	player.runCommand(`scoreboard players add @s normalF 1`) 
    	} 
    player.runCommand(`scoreboard players set @s flytimer 0`) 
    if(distance>maximumDisMovement){
    	player.runCommand(`scoreboard players set @s normalF 0`) 
        player.runCommand(`scoreboard players set @s flyTp 2`) 
        } 
      if (flyTp == 1){
      	if(distance<maximumDisMovement || player.hasTag("skip_check")) return 
          player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural Movement §gFly §8(§gA§8) §chas been detected from §b${player.name} §8(§g${distance.toFixed(2)}§8/§g${maximumDisMovement}§8) §gblocks"}]}`) 
      	player.runCommand(`tp @s ${firstPosX} ${firstPosY} ${firstPosZ}`) 
      	} 
      if (  player.hasTag("sleeping")  || velocityY<0 || distance<maximumDisMovement){
      	if (flyTp>0) return 
	player.runCommand(`scoreboard players set @s flyZ ${playerZ}`) 
    player.runCommand(`scoreboard players set @s flyX ${playerX}`) 
    player.runCommand(`scoreboard players set @s flyY ${playerY}`) 
      	} 
      	}
      }}catch (error){
      	player.runCommand(`title @s actionbar §c${error}`) 
}} 