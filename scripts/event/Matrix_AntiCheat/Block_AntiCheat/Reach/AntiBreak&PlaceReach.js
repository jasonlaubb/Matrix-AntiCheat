import * as Minecraft from "@minecraft/server"
import { antiReachBlockEnabled } from "../../config"
import { system, ItemStack, world, ItemEnchantsComponent, Vector, Container,Player,BlockInventoryComponent } from "@minecraft/server"
let world = Minecraft.world
let reachBToggle;
let reachPToggle; 
if (antiReachBlockEnabled == true){
  world.beforeEvents.playerBreakBlock.subscribe((event)=>{
  	let player = event.player 
      let block = event.block 
  	try{
		reachBToggle = world.scoreboard.getObjective("toggle:reachB").displayName 
		} catch {
		reachBToggle = true 
			} 
			system.run(()=>{ 
  	player.runCommand(`scoreboard players set @s block 1`) 
}) 
  	let { x, y, z } = block.location; 
  let reachType; 
   let limitOfReachX; 
   limitOfReachX = 6;
   let limitOfReachZ; 
   limitOfReachZ = 6;
   let limitOfReachY; 
    limitOfReachY = 7;
   if (player.hasTag("is_jumping")){
   	limitOfReachY = 8
   	} 
 
   
    let blockName; 
 let  blockId = block.type.id.replaceAll("minecraft:",""); 
    blockName = blockId.replaceAll("_"," ") 
    let { x: playerx, y: playery, z: playerz } = player.location;
    let playerX = playerx.toFixed(2)
     let playerZ = playerz.toFixed(2)
      let playerY = playery.toFixed(2)
    let disY; 
    let disZ;
    let disX; 
    disY = Math.abs(y-playerY)
    disX = Math.abs(x-playerX)-0.2
    disZ = Math.abs(z-playerZ)-0.2
    
    
    let generalDis;
    if (playerY>y+5){
    	limitOfReachY = 5.4
    } if (playerY == y+5){
    	limitOfReachX = 3.1
        limitOfReachZ = 3.1
    }  if (playerY == y+4){
    	limitOfReachX = 4.7
        limitOfReachZ = 4.7
    }  if (playerY == y+3){
    	limitOfReachZ = 5.7
        limitOfReachX = 5.7
    } if (playerY == y+2){
    	limitOfReachX = 6
        limitOfReachZ = 6
    } if (playerY == y+1){
    	limitOfReachX = 6
        limitOfReachZ = 6
    }  if (playerY == y){
    	limitOfReachX = 6
        limitOfReachZ = 6
    }
    if (playerY == y-7){
    	limitOfReachX = 2.6
        limitOfReachZ = 2.6
    	} 
  if (playerY == y-6){
    	limitOfReachX = 4
        limitOfReachZ = 4
    }  if (playerY == y-5){
    	limitOfReachX = 4.8
        limitOfReachZ = 4.8
    }  if (playerY == y-4){
    	limitOfReachZ = 5.4
        limitOfReachX = 5.4
    } if (playerY == y-3){
    	limitOfReachX = 6
        limitOfReachZ = 6
    } if (playerY == y-2){
    	limitOfReachX = 6
        limitOfReachZ = 6
    }  if (playerY == y-1){
    	limitOfReachX = 6
        limitOfReachZ = 6
    } 
    
    
    
    let x1 = x+(disX*2)
    let z1 = z+(disZ*2)
    let y1 = y+(disY*2)
    let disY2 = Math.abs(y1-playerY) 
    let disZ2 = Math.abs(z1-playerZ) 
    let disX2 = Math.abs(x1-playerX) 
    
    if (disY>disY2){
    	disY = disY-1
    } 
    if (disZ>disZ2){
    	disZ = disZ-1
    } 
    if (disX>disX2){
    	disX = disX-1
       
    } 
    disX = disX.toFixed(2)
    disY = disY.toFixed(2)
    disZ = disZ.toFixed(2)
 let disXZ; 
 disXZ = Math.sqrt(disX*disX+disZ*disZ); 
 disXZ = disXZ.toFixed(2)
 let distance; 
    if (disX>limitOfReachX == true){
    	distance = disX; 
        reachType = "x" 
    }  
    if (disZ>limitOfReachZ == true){
    	distance = disZ; 
        reachType = "z" 
    } if (disY>limitOfReachY == true){
    	distance = disY; 
        reachType = "y" 
    } if (disXZ>limitOfReachX == true){
    	distance = disXZ; 
        reachType = "x§8,§gz" 
    } 
    if (disX<limitOfReachX && disY<limitOfReachY && disZ<limitOfReachZ ){
    	system.run(()=>{ 
    	player.runCommand(`scoreboard players set @s tryReachB 0`) 
})}
    if (disXZ>limitOfReachX || disX>limitOfReachX || disY>limitOfReachY || disZ>limitOfReachZ ){
    	if (player.hasTag("MatrixOP")) return 
    if(reachBToggle != true) return 
    system.run(()=>{ 
    	player.runCommand(`execute  positioned ${x} ${y} ${z} run kill @e[r=1.5,type=item,name="${blockName}"]`)})
    	event.cancel = true 
    system.run(()=>{ 
        player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gReach §8(§gB§8) §chas been detected from §b${player.name}\n§cDistance §8= §8(§g${distance}§8/§gBlocks§8)\n§cBlock§8 = §8(§g${blockName}§8)\n§cReach type §8= (§g${reachType}§8)"}]}`) 
    	})}
}) 
    }
    let limitOfReachX;
    let limitOfReachY; 
    let limitOfReachZ; 
    let disY; 
    let disZ;
    let disX; 
    let disXZ; 
  if (antiReachBlockEnabled == true){
    	
    world.beforeEvents.playerPlaceBlock.subscribe((event)=>{
    	try{
		reachPToggle = world.scoreboard.getObjective("toggle:reachP").displayName 
		} catch {
		reachPToggle = true 
			} 
			let player = event.player 
      let block = event.block 
	system.run(()=>{ 
    	player.runCommand(`scoreboard players set @s block 1`) }) 
  	let { x, y, z } = block.location; 
  let reachType; 
 
   
   limitOfReachX = 6;
   
   limitOfReachZ = 6;
   
    limitOfReachY = 7;
   if (player.hasTag("is_jumping")){
   	limitOfReachY = 8
   	} 
   
    let blockName; 
 let  blockId = block.type.id.replaceAll("minecraft:",""); 
    blockName = blockId.replaceAll("_"," ") 
    let { x: playerx, y: playery, z: playerz } = player.location;
    let playerX = playerx.toFixed(2)
     let playerZ = playerz.toFixed(2)
      let playerY = playery.toFixed(2)
    
    
    disY = Math.abs(y-playerY)
    disX = Math.abs(x-playerX)-0.2
    disZ = Math.abs(z-playerZ)-0.2
    
    
    
    if (playerY>y+5){
    	limitOfReachY = 5.4
    } if (playerY == y+5){
    	limitOfReachX = 3.1
        limitOfReachZ = 3.1
    }  if (playerY == y+4){
    	limitOfReachX = 4.7
        limitOfReachZ = 4.7
    }  if (playerY == y+3){
    	limitOfReachZ = 5.7
        limitOfReachX = 5.7
    } if (playerY == y+2){
    	limitOfReachX = 6
        limitOfReachZ = 6
    } if (playerY == y+1){
    	limitOfReachX = 6
        limitOfReachZ = 6
    }  if (playerY == y){
    	limitOfReachX = 6
        limitOfReachZ = 6
    }
    if (playerY == y-7){
    	limitOfReachX = 2.6
        limitOfReachZ = 2.6
    	} 
  if (playerY == y-6){
    	limitOfReachX = 4
        limitOfReachZ = 4
    }  if (playerY == y-5){
    	limitOfReachX = 4.8
        limitOfReachZ = 4.8
    }  if (playerY == y-4){
    	limitOfReachZ = 5.4
        limitOfReachX = 5.4
    } if (playerY == y-3){
    	limitOfReachX = 6
        limitOfReachZ = 6
    } if (playerY == y-2){
    	limitOfReachX = 6
        limitOfReachZ = 6
    }  if (playerY == y-1){
    	limitOfReachX = 6
        limitOfReachZ = 6
    } 
    
  


    
    let x1 = x+(disX*2)
    let z1 = z+(disZ*2)
    let y1 = y+(disY*2)
    let disY2 = Math.abs(y1-playerY) 
    let disZ2 = Math.abs(z1-playerZ) 
    let disX2 = Math.abs(x1-playerX) 
    
    if (disY>disY2){
    	disY = disY-1
    } 
    if (disZ>disZ2){
    	disZ = disZ-1
    } 
    if (disX>disX2){
    	disX = disX-1
       
    } 
    disX = disX.toFixed(2)
    disY = disY.toFixed(2)
    disZ = disZ.toFixed(2)
 
 
 disXZ = Math.sqrt(disX*disX+disZ*disZ); 
 disXZ = disXZ.toFixed(2)
 let distance; 
    if (disX>limitOfReachX == true){
    	distance = disX; 
        reachType = "x" 
    }  
    if (disZ>limitOfReachZ == true){
    	distance = disZ; 
        reachType = "z" 
    } if (disY>limitOfReachY == true){
    	distance = disY; 
        reachType = "y" 
    } if (disXZ>limitOfReachX == true){
    	distance = disXZ; 
        reachType = "x§8,§gz" 
    } 
  
    if (disX<limitOfReachX && disY<limitOfReachY && disZ<limitOfReachZ ){
    	system.run(()=>{ 
    	player.runCommand(`scoreboard players set @s tryReachB 0`) 
    }) 
}
    if (disXZ>limitOfReachX || disX>limitOfReachX || disY>limitOfReachY || disZ>limitOfReachZ ){
if (player.hasTag("MatrixOP")) return 
if(reachPToggle != true) return 
    	event.cancel = true
system.run(()=>{ 
        player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gReach §8(§gP§8) §chas been detected from §b${player.name}\n§cDistance §8= §8(§g${distance}§8/§gBlocks§8)\n§cBlock§8 = §8(§g${blockName}§8)\n§cReach type §8= (§g${reachType}§8)"}]}`) 
        player.runCommand(`scoreboard players add @s tryReachB 1`) 
   }) }
 })
    } 
    export { disX, disY, disZ, disXZ, limitOfReachX, limitOfReachY, limitOfReachZ } 