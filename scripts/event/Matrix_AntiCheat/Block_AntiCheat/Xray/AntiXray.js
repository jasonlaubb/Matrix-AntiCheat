import * as Minecraft from "@minecraft/server"
import { antiXrayEnabled,xray } from "../../config"
import { system, ItemStack, world, ItemEnchantsComponent, Vector, Container,Player,BlockInventoryComponent } from "@minecraft/server"
let world = Minecraft.world
//* check toggle if enabled 
let xrayToggle;
if (antiXrayEnabled == true){
  world.beforeEvents.playerBreakBlock.subscribe((event)=>{
  	try{
		xrayToggle = world.scoreboard.getObjective("toggle:xray").displayName 
		} catch {
		xrayToggle = true 
			} 
			let player = event.player 
      let block = event.block 
     let xrayFlags = world.scoreboard.getObjective("xray").getScore(player.scoreboardIdentity) 
  	let { x, y, z } = block.location; 
  //* block location and player location (doesn't matter) 
  let { x: playerx, y: playery, z: playerz } = player.location;
  //* clone block before broken
  
  if (xray.includes(block.type.id)){
  	if(xrayToggle != true) return 
  system.run(()=>{ 
  	player.runCommand(`scoreboard players add @s xray 1`) 
  	})} 
  if (xrayFlags >= 5){
  	system.run(()=>{ 
  	if(xrayToggle != true) return 
  	if (player.hasTag("MatrixOP")) return 
  	player.runCommand(`tellraw @a[tag=notifyXray]{"rawtext":[{"text":"§g[§cMatrix§g] §gXray notification:\n§b${player.name} §chas found  §8(§g${brokenBlock.type.id.replaceAll("minecraft:","").replaceAll("_"," ")}§8)"}]}`) 
      player.runCommand(`scoreboard players set @s xray 0`) 
  	})}
}) 
    }