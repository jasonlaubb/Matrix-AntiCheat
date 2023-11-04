//@ts-check
import { Player, world } from "@minecraft/server"
import { antiFlyEnabled,detect,setScore }  from "../config"

world.afterEvents.itemUse.subscribe((event)=>{
  let player = event.source
  //@ts-expect-error
  let getItemInSlot = player.getComponent("inventory").container.getItem(player.selectedSlot)
let getEnchantment = getItemInSlot.getComponent("minecraft:enchantments").enchantments
  if(getItemInSlot.typeId.includes("trident")){
   
    let  checkRipTide = getEnchantment.hasEnchantment("riptide")
      if(checkRipTide>0){
        player.addTag(`trident`)
      }
  }
})

/** @param {Player} player */
export async function antiFlyB(player){
	try{
  const flyToggle = !world.getDynamicProperty("toggle:fly")
	if(antiFlyEnabled == true){
		if (flyToggle != true || player.hasTag("MatrixOP")) return
	
	let maximumDisMovement;
	maximumDisMovement = 0.7
	
let firstPosY = world.scoreboard.getObjective("groundY").getScore(player.scoreboardIdentity)/100
let firstPosX = world.scoreboard.getObjective("groundX").getScore(player.scoreboardIdentity)/100
let firstPosZ = world.scoreboard.getObjective("groundZ").getScore(player.scoreboardIdentity)/100
	let skip_check = world.scoreboard.getObjective("skip_check").getScore(player.scoreboardIdentity)
	
    let playerY; 
    let playerX; 
    let playerZ; 
    
    playerZ = Number(player.location.z.toFixed(2))*100
    playerX = Number(player.location.x.toFixed(2))*100
    playerY = Number(player.location.y.toFixed(2))*100
    
    
    let velocity = player.getVelocity(); 
    let velocityY = velocity.y
    let checkBlock = [ player.dimension.getBlock({ x: Math.floor(player.location.x) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z) }).typeId, 
player.dimension.getBlock({ x: Math.floor(player.location.x+1) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z) }).typeId,
player.dimension.getBlock({ x: Math.floor(player.location.x-1) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z) }).typeId,
player.dimension.getBlock({ x: Math.floor(player.location.x) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z+1) }).typeId,
player.dimension.getBlock({ x: Math.floor(player.location.x) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z-1) }).typeId,
player.dimension.getBlock({ x: Math.floor(player.location.x+1) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z+1) }).typeId,
player.dimension.getBlock({ x: Math.floor(player.location.x-1) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z+1) }).typeId,
player.dimension.getBlock({ x: Math.floor(player.location.x-1) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z+1) }).typeId,
player.dimension.getBlock({ x: Math.floor(player.location.x+1) , y: Math.floor(player.location.y-1), z: Math.floor(player.location.z-1) }).typeId
]
if(player.hasTag("slime") && velocityY<=0){
      player.removeTag(`slime`)
    }
    if(checkBlock.includes("minecraft:slime")){
      player.addTag(`slime`)
    }
    
    if(velocityY<0 && player.location.y<firstPosY || skip_check>0 || player.hasTag("slime") && velocityY>0){
    setScore(world,player,"groundZ",playerZ)
        setScore(world,player,"groundY",playerY)
          setScore(world,player,"groundX",playerX)
    }
     if(velocityY>maximumDisMovement){
      
        if(skip_check>0 || player.hasTag("slime") && velocityY>0) return
        detect(player,"tp",null,firstPosX+" "+firstPosY+" "+firstPosZ,true,"§e[§cMatrix§e] §can unNatural Movement §gFly §8(§gB§8) §cfrom §b"+player.name+" §8(§g"+velocityY+"§8/§g"+maximumDisMovement+"§8)")
    }

      }}catch (error){
      	player.runCommand(`title @s actionbar §c${error} flyB`) 
}} 
