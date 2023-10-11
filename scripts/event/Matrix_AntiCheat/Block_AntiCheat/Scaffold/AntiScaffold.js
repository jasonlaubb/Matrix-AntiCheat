import * as Minecraft from "@minecraft/server"
import { antiScaffoldEnabled } from "../../config"
import { disX, disY, disZ, disXZ, limitOfReachX, limitOfReachY, limitOfReachZ } from "../Reach/AntiBreak&PlaceReach" 
import { system, ItemStack, world, ItemEnchantsComponent, Vector, Container,Player,BlockInventoryComponent } from "@minecraft/server"
let world = Minecraft.world
let scaffoldBToggle; 
let scaffoldAToggle; 
if (antiScaffoldEnabled == true){
    world.beforeEvents.playerPlaceBlock.subscribe((event)=>{
    	try{
		scaffoldBToggle = world.scoreboard.getObjective("toggle:scaffoldB").displayName 
		} catch {
		scaffoldBToggle = true 
			} try{
		scaffoldAToggle = world.scoreboard.getObjective("toggle:scaffoldA").displayName 
		} catch {
		scaffoldAToggle = true 
			} 
			let player = event.player 
      let block = event.block 
  	let { x, y, z } = block.location; 
   
    let blockName; 
 let  blockId = block.type.id.replaceAll("minecraft:",""); 
    blockName = blockId.replaceAll("_"," ") 
    let tryScaffold = world.scoreboard.getObjective("tryScaffold").getScore(player.scoreboardIdentity) 
    let { x: playerx, y: playery, z: playerz } = player.location;
    let playerX = playerx.toFixed(0)
     let playerZ = playerz.toFixed(0)
      let playerY = playery.toFixed(0)
      let block2 = player.dimension.getBlock({ x: Math.floor(player.location.x) , y: Math.floor(player.location.y+1), z: Math.floor(player.location.z) }).typeId;
      let checkSelectedSlot = player.getComponent("inventory").container.getItem(player.selectedSlot).typeId; 
      if(block2 == "minecraft:air" && player.hasTag("looking_up")){
    if (x == playerX && z == playerZ && y == playerY-1 || x == playerX-1 && z == playerZ && y == playerY-1 || x == playerX+1 && z == playerZ && y == playerY-1 || x == playerX && z == playerZ+1 && y == playerY-1 || x == playerX && z == playerZ-1 && y == playerY-1 || x == playerX+1 && z == playerZ+1 && y == playerY-1 || x == playerX-1 && z == playerZ-1 && y == playerY-1 || x == playerX+1 && z == playerZ-1 && y == playerY-1 || x == playerX-1 && z == playerZ+1 && y == playerY-1  ){
    	if (player.hasTag("MatrixOP")) return 
    if(scaffoldAToggle != true) return 
    system.run(()=>{ 
    	player.runCommand(`scoreboard players add @s tryScaffold 1`) 
    })}} 
    if(tryScaffold == 2 && block2 == "minecraft:air" && player.hasTag("looking_up")){
    	if (x == playerX && z == playerZ && y == playerY-1 || x == playerX-1 && z == playerZ && y == playerY-1 || x == playerX+1 && z == playerZ && y == playerY-1 || x == playerX && z == playerZ+1 && y == playerY-1 || x == playerX && z == playerZ-1 && y == playerY-1 || x == playerX+1 && z == playerZ+1 && y == playerY-1 || x == playerX-1 && z == playerZ-1 && y == playerY-1 || x == playerX+1 && z == playerZ-1 && y == playerY-1 || x == playerX-1 && z == playerZ+1 && y == playerY-1  ){
    	event.cancel = true
    system.run(()=>{ 
        player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gScaffold §8(§gA§8) §chas been detected from §b${player.name}\n§cBlock§8 = §8(§g${blockName}§8)"}]}`) 
    	})}} 
    	if(tryScaffold>2 && block2 == "minecraft:air" && player.hasTag("looking_up")){
    	if (x == playerX && z == playerZ && y == playerY-1 || x == playerX-1 && z == playerZ && y == playerY-1 || x == playerX+1 && z == playerZ && y == playerY-1 || x == playerX && z == playerZ+1 && y == playerY-1 || x == playerX && z == playerZ-1 && y == playerY-1 || x == playerX+1 && z == playerZ+1 && y == playerY-1 || x == playerX-1 && z == playerZ-1 && y == playerY-1 || x == playerX+1 && z == playerZ-1 && y == playerY-1 || x == playerX-1 && z == playerZ+1 && y == playerY-1  ){
    	event.cancel = true
    system.run(()=>{ 
        player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gScaffold §8(§gA§8) §chas been detected from §b${player.name}\n§cBlock§8 = §8(§g${blockName}§8)"}]}`) 
       })}} if(block2 == "minecraft:air" && !player.hasTag("looking_up")){
    if (x == playerX && z == playerZ && y == playerY-1 || x == playerX-1 && z == playerZ && y == playerY-1 || x == playerX+1 && z == playerZ && y == playerY-1 || x == playerX && z == playerZ+1 && y == playerY-1 || x == playerX && z == playerZ-1 && y == playerY-1 || x == playerX+1 && z == playerZ+1 && y == playerY-1 || x == playerX-1 && z == playerZ-1 && y == playerY-1 || x == playerX+1 && z == playerZ-1 && y == playerY-1 || x == playerX-1 && z == playerZ+1 && y == playerY-1  ){
    	system.run(()=>{ 
    	player.runCommand(`scoreboard players set @s tryScaffold 0`) 
    	})}} 
 else { 
 if (checkSelectedSlot == block.typeId) return 
    	if (disX>limitOfReachX || disY>limitOfReachY || disZ>limitOfReachZ || disXZ>limitOfReachX || block.typeId == "minecraft:air"  ) return 
    if (player.hasTag("MatrixOP")) return 
    try{
    	player.runCommand(`give @s ${blockId}`) 
    } catch {} 
    if(scaffoldBToggle != true) return 
    	event.cancel = true
    system.run(()=>{ 
        player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gScaffold §8(§gB§8) §chas been detected from §b${player.name}\n§cItem in selected slot §8 = §8(§g${checkSelectedSlot.replaceAll("minecraft:","")}§8)"}]}`) 
    	})}

})
    } 
  