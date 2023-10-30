import * as Minecraft from "@minecraft/server"
import { system, ItemStack, world, ItemEnchantsComponent, Vector, Container,Player } from "@minecraft/server"
import { antiFlyEnabled,detect,setScore,addScore}  from "../config"
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
    
    let velocity = player.getVelocity(); 
    let velocityY = velocity.y
    let velocityZ = velocity.z
    let velocityX = velocity.x
    if (groundX == 0 && groundZ == 0 && groundY == 0){
    	if (playerY == 0 && playerZ == 0 && playerX == 0) return 
    setScore(world,player,"groundZ",playerZ)
        setScore(world,player,"groundY",playerY)
          setScore(world,player,"groundX",playerX)
    	}
    if(player.isOnGround == true && velocityY == 0 || skip_check>0){
    	setScore(world,player,"groundZ",playerZ)
        setScore(world,player,"groundY",playerY)
          setScore(world,player,"groundX",playerX)
    
    	} 
    
    if(velocityY == 0 && player.isOnGround == false && skip_check == 0){
    addScore(world,player,"flyTimer",2)
    	} if(flyTimer>14 && velocityY == 0){
    	if(player.hasTag("MatrixOP") || player.hasTag("inWater")) return 
    	detect(player,"tp",null,groundX+"  "+groundY+" "+groundZ,true,"§g[§cMatrix§g] §can unNatural Movement §gFly §8(§gA§8) §chas been detected from §b"+player.name+" §8(§gvelocity §8(§gY§8) = §c"+velocityY+"§8) §gblocks")
     setScore(world,player,"flyTimer",0)
    	} 
      }}catch (error){
      	player.runCommand(`title @s actionbar §c${error} flyA`) 
}} 
