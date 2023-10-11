import * as Minecraft from "@minecraft/server"
import { system, ItemStack, world, ItemEnchantsComponent, Vector, Container,Player } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"
import { password,prefix } from "../config"
const world = Minecraft.world

let checkExistPlayer; 
let target; 
let Target; 
let getTags; 
let inventory; 
let targetX; 
let targetZ; 
let targetY; 
let commands = [ prefix+"unban", 
prefix+"ban", 
prefix+"itemCheck", 
 prefix+"notify", 
 prefix+"unnotify", 
 prefix+"xray_notify", 
 prefix+"xray_unnotify",
 prefix+"freeze", 
 prefix+"antixray disable", 
 prefix+"antixray enable", 
 prefix+"unfreez",
 prefix+"mute", 
 prefix+"unmute", 
 prefix+"op", 
 prefix+"deop", 
 prefix+"help", 
 prefix+"runCommand", 
 prefix+"rank", 
 prefix+"kick", 
 prefix+"antiSpeed", 
 prefix+"antiKillaura", 
 prefix+"antiSpeedMine", 
 prefix+"antiReachA", 
 prefix+"antiReachB", 
 prefix+"antiReachP", 
 prefix+"antiAuto", 
 prefix+"antiAutoP", 
 prefix+"antiNuker", 
 prefix+"antiScaffoldA", 
 prefix+"antiScaffoldB", 
 prefix+"antiCrasher", 
 prefix+"antiXray", 
 prefix+"antiFly", 
 prefix+"spawn", 
 prefix+"inventoryCheck", 
 prefix+"kit", 
 prefix+"toggles"
] 

world.beforeEvents.chatSend.subscribe((data) => {
	let player = data.sender
   let  msg = data.message
   let  x = player.location.x;
   let y = player.location.y;
 let  z = player.location.z;
 let  word = msg.trim().split(`"`)
 try{
   target = word[1].replaceAll(`"`,``).replaceAll(`@`,``) 
  } catch{  if (target == "" || target == undefined){
   	target = "no target selected"
   }} for (Target of world.getAllPlayers()){
   	if(Target.name.toLowerCase().includes(target.toLowerCase())){
	checkExistPlayer = Target.name 
	inventory = Target.getComponent("inventory").container 
	getTags = Target.getTags()
	targetX = Target.location.x
	targetZ = Target.location.z
	targetZ = Target.location.y
	} 
} 
	let spam = world.scoreboard.getObjective("spam").getScore(player.scoreboardIdentity)
	if (msg.startsWith(prefix) || player.hasTag("mute") || spam > 0) return 
	if (spam == 0){
    	system.run(()=>{
    	if (msg.startsWith(prefix)) return 
		if (player.hasTag("MatrixOP")) return 
    	player.runCommand(`scoreboard players set @s spam 50`) 
    	})} 
let rank; 
try{
   for (let tag of player.getTags()){
   	if (tag.startsWith("rank:")){
   	rank = tag.replaceAll("rank:","") 
    	}} 
    } catch {
    } if (rank == undefined){
    	rank = "§7Member"
    	} 
    data.cancel = true 
   system.run(()=>{
   world.sendMessage(`§8[ §7${rank} §8] §7${player.name}§8:§r${msg.replaceAll("§k","")}`) 
   }) 
 }) 
world.beforeEvents.chatSend.subscribe((data) => {
	let player = data.sender
   let  msg = data.message
   let  x = player.location.x;
   let y = player.location.y;
 let  z = player.location.z;
let  word = msg.trim().split(`"`)
try{
   target = word[1].replaceAll(`"`,``).replaceAll(`@`,``) 
  } catch{  if (target == "" || target == undefined){
   	target = "no target selected"
   }} for (Target of world.getAllPlayers()){
   	if(Target.name.toLowerCase().includes(target.toLowerCase())){
	checkExistPlayer = Target.name 
	inventory = Target.getComponent("inventory").container 
	getTags = Target.getTags()
	} 
}
	 
   if (msg.startsWith(prefix)){
   	data.cancel = true 
   } 
   if (msg.startsWith(prefix)){
   	for(let command of commands){
   	if(msg.startsWith(command)) return
   	} 
       player.sendMessage(`§e[§cMatrix§e] §cthis command doesnt exist >> §g${word[0].replaceAll("!","")} §c<<`) 
   }}) 
   world.beforeEvents.chatSend.subscribe((data) => {
	let player = data.sender
   let  msg = data.message
   let  x = player.location.x;
   let y = player.location.y;
 let  z = player.location.z;
let  word = msg.trim().split(`"`)
try{
  target = word[1].replaceAll(`"`,``).replaceAll(`@`,``) 
  } catch{  if (target == undefined){
   	target = "no target selected"
   }} 
  if (msg.startsWith(prefix+"op "+password)) {
  system.run(() => {
    player.addTag(`MatrixOP`)
    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ais opped Matrix`) 
  })}
  
  if (msg.startsWith(prefix+"deop") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §chis op has been removed\n§gBy§8:§b${player.name} `) 
      player.runCommand(`tag "${target}" remove MatrixOP`)
     }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
   }) 
  	}} 
if (msg.startsWith(prefix+"op") && player.hasTag("MatrixOP")){
  	if (msg.startsWith(prefix+"op "+password)) return 
  	if (target == checkExistPlayer){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §ais MatrixOP \n§gBy§8:§b${player.name} `) 
      player.runCommand(`tag "${target}" add MatrixOP`)
      }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  }) 
  	}}}) 
 world.beforeEvents.chatSend.subscribe((data) => {
  	let player = data.sender
   let  msg = data.message
   let  x = player.location.x;
   let y = player.location.y;
 let  z = player.location.z;
let  word = msg.trim().split(`"`)
try{
   target = word[1].replaceAll(`"`,``).replaceAll(`@`,``) 
  } catch{  if (target == "" || target == undefined){
   	target = "no target selected"
   }} for (Target of world.getAllPlayers()){
   	if(Target.name.toLowerCase().includes(target.toLowerCase())){
	checkExistPlayer = Target.name 
	inventory = Target.getComponent("inventory").container 
	getTags = Target.getTags()
	} 
} 
   if (msg.startsWith(prefix+"freeze") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	let reason; 
      reason = word[2].replaceAll(`"`).trim()
   if(reason == ""){
  	reason = "no reason specific" 
  	}  
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §chas been frozen \n§gBy§8:§b${player.name}\n§gReason§8:§c${reason}`) 
      player.runCommand(`tag "${target}" add freeze`)
      player.runCommand(`scoreboard players set @s freezeX ${Math.floor(targetX)}`) 
      player.runCommand(`scoreboard players set @s freezeZ ${Math.floor(targetZ)}`)
      player.runCommand(`scoreboard players set @s freezeY ${Math.floor(targetY)}`)  
      }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  }) 
  	}} 
  
  
  }) 
  world.beforeEvents.chatSend.subscribe((data) => {
  	let player = data.sender
   let  msg = data.message
   let  x = player.location.x;
   let y = player.location.y;
 let  z = player.location.z;
let  word; 
word = msg.trim().split(`"`)

  	try{
   target = word[1].replaceAll(`"`,``).replaceAll(`@`,``) 
  } catch{  if (target == "" || target == undefined){
   	target = "no target selected"
   }} for (Target of world.getAllPlayers()){
   	if(Target.name.toLowerCase().includes(target.toLowerCase())){
	checkExistPlayer = Target.name 
	inventory = Target.getComponent("inventory").container 
	getTags = Target.getTags()
	} 
}
   
if (msg.startsWith(prefix+"mute") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	let reason; 
      reason = word[2].replaceAll(`"`).trim() 
   if(reason == ""){
  	reason = "no reason specific" 
  	}  
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §chas been muted \n§gBy§8:§b${player.name}\n§gReason§8:§c${reason}`) 
      player.runCommand(`tag "${target}" add mute`)
      }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  }) 
  	}}
	let spam = world.scoreboard.getObjective("spam").getScore(player.scoreboardIdentity)
	if (spam != 0){
		data.cancel = true 
		if (player.hasTag("MatrixOP") || msg.startsWith(prefix)) return 
		player.sendMessage(`§e[§cMatrix§e] §cwait 1 second to chatting`)
		
	}
 if (player.hasTag("mute")){
		data.cancel = true 
		system.run(()=>{
			if (msg.startsWith(prefix)) return 
		player.sendMessage(`§e[§cMatrix§e] §cyou are currently muted`) 
		})} 
	if(msg.startsWith(prefix+"help") && player.hasTag("MatrixOP")){
			player.sendMessage(`§8§l--------------§r§cMatrix_AntiCheat§l§8--------------\n§c§lCommands list§r§8:\n§gto give player op§8:§r${prefix}op §8<§guser§8>\n§gto remove op from player§8:§r${prefix}deop §8<§guser§8>\n§gto kick player§8:§r${prefix}kick §8<§guser§8> §8<§greason§8>\n§gto ban player type§8:§r${prefix}ban §8<§guser§8> <§greason§8>\n§gto freeze player§8:§r${prefix}freeze §8<§guser§8> <§greason§8>\n§gto mute player§8:§r${prefix}mute §8<§guser§8> <§greason§8>\n§gto put player for get cheats notifications§8:§r${prefix}unnotify §8<§guser§8>\n§gto put player for get xray notifications§8:§r${prefix}xray_notify §8<§guser§8>\n§gto unfreeze player§8:§r${prefix}unfreeze §8<§guser§8>\n§gto unban player§8:§r${prefix}unban §8<§guser§8>\n§gto unmute player§8:§r${prefix}unmute §8<§guser§8>\n§gto remove player from get cheats notifications§8:§r${prefix}unnotify §8<§guser§8>\n§gto remove player from get xray notifications§8:§r${prefix}xray_unnotify §8<§guser§8>\n§gto change rank of player§8:§r${prefix}rank §8<§guser§8> §8<§grank§8>\n§gto run minecraft command§8:§r${prefix}runCommand §8<§gcommand§8>\n§gto §cdisable §gor §aenable §gToggles§8:§r${prefix}§8<§gtoggle§8> §8<§aenable§8/§cdisable§8>\n§gto check player inventory§8:§r${prefix}inventoryCheck §8<§guser§8>\n§gto check if there item in inventory of player§8:§r${prefix}itemCheck §8<§guser§8> §8<§gitem§8>\n§gto see toggles list§8:§r${prefix}toggles\n§8§l--------------§r§cMatrix_AntiCheat§l§8--------------\n§8§l      -------§r§gby§8:§gRaMiGamer§l§8-------      `) 
		} 
if (msg.startsWith(prefix+"notify") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	system.run(()=>{
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §ahas been put for get cheats notification\n§gBy§8:§b${player.name}`) 
      player.runCommand(`tag "${target}" add notify`) 
  	})} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  })}} 
  if (msg.startsWith(prefix+"xray_notify") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §ahas been put for get xray notification\n§gBy§8:§b${player.name}`) 
      player.runCommand(`tag "${target}" add notifyXray`) 
      }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  })}} 
  if (msg.startsWith(prefix+"unnotify") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	system.run(()=>{
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §chas been removed from get cheats notification\n§gBy§8:§b${player.name}`) 
      player.runCommand(`tag "${target}" remove notify`) 
  	})} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  })}} 
  if (msg.startsWith(prefix+"unmute") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	system.run(()=>{
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §ais currently unmuted!\n§gBy§8:§b${player.name}`) 
      player.runCommand(`tag "${target}" remove mute`) 
  	})} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  })}} 
  if (msg.startsWith(prefix+"xray_unnotify") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §chas been removed from get xray notification\n§gBy§8:§b${player.name}`) 
      player.runCommand(`tag "${target}" remove notifyXray`) 
      }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  })}} 
  	if(commands.includes(word[1])){
  	if (player.hasTag("MatrixOP")) return 
  	player.sendMessage(`§e[§cMatrix§e] §cyou dont have permission to use this command!`) 
  	} 
  if (msg.startsWith(prefix+"unban") && player.hasTag("MatrixOP")){
  	system.run(()=>{
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §ais currently unbanned\n§gBy§8:§b${player.name}`) 
      player.runCommand(`scoreboard objectives add "${target.toLowerCase()}" dummy "${target.toLowerCase()}"`) 
  	})}
  if (msg.startsWith(prefix+"unfreeze") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §ahas been unfreeze\n§gBy§8:§b${player.name}`) 
      player.runCommand(`tag "${target}" remove freeze`) 
      }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  }) 
  	}} 
  if (msg.startsWith(prefix+"runCommand") && player.hasTag("MatrixOP")){
  	
  	system.run(() => {
  	try{
  	player.runCommand(`${msg.replaceAll(prefix+"runCommand","")}`) 
  	player.sendMessage(`§e[§cMatrix§e] §acommand has been runned successfully`) 
  if (msg.includes(checkExistPlayer)){
  	player.runCommand(`tag ${checkExistPlayer} add skip_check`) 
  } 
     } catch (error){
     	player.sendMessage(`§e[§cMatrix§e] §ccommand runned with error ${error}`) 
} }) 
	} if (msg.startsWith(prefix+"rank") && player.hasTag("MatrixOP")){
		let rank; 
		let Rank; 
		try{
		for (let tag of getTags){
			if(tag.startsWith("rank:")){
				rank = tag.replaceAll("rank:","") 
				}} 
			} catch {
				rank = "nothing"
				} try {
					Rank = word[2].trim() 
					} catch {
					Rank = "null"
						} if (Rank == ""){
							Rank = "null" 
							} 
				if (target == checkExistPlayer || Rank != "null"){
					
  	system.run(() => {
  	if(Rank == "null") return 
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §ahis rank has been changed\n§gBy§8:§b${player.name}\n§gRank§8:§r${Rank}`) 
      player.runCommand(`tag "${target}" remove "rank:${rank}"`) 
      player.runCommand(`tag "${target}" add "rank:${Rank}§r"`) 
 })} if (target != checkExistPlayer || Rank == "null"){
 	system.run(() => {
 	if (target != checkExistPlayer){
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  } if (Rank == "null"){
  	player.sendMessage(`§e[§cMatrix§e] §ctype rank!`) 
  	} 
  }) 
 	} 
	}}) 
	world.beforeEvents.chatSend.subscribe((data) => {
		
  	let player = data.sender
   let  msg = data.message
   let  x = player.location.x;
   let y = player.location.y;
 let  z = player.location.z;
let  word = msg.trim().split(`"`)

try{
   target = word[1].replaceAll(`"`,``).replaceAll(`@`,``)
  } catch{  if (target == undefined){
   	target = "no target selected"
   }} 
if (msg.startsWith(prefix+"ban") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	let reason; 
      reason = word[2].replaceAll(`"`).trim()
   if(reason == ""){
  	reason = "no reason specific" 
  	} 
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §chas been banned from server\n§gBy§8:§b${player.name}\n§gReason§8:§c${reason}`) 
      player.runCommand(`tag "${target}" add ban`)
      player.runCommand(`tag "${target}" add "Reason:${reason}§r" `) 
      player.runCommand(`tag "${target}" add "By:${player.name}§r" `) 
      player.runCommand(`scoreboard players set "${target}" bantimer 40`) 
      player.runCommand(`kick "${target}" .\n§8 >> §c§lYou are banned bad boy\n§r§8 >> §gReason§8:§c${reason}\n§8 >> §gBy§8:§c${player.name}`) 
      }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  }) 
  	}}
  if (msg.startsWith(prefix+"kick") && player.hasTag("MatrixOP")){
  	if (target == checkExistPlayer){
  	let reason; 
      reason = word[2].replaceAll(`"`).trim()
   if(reason == ""){
  	reason = "no reason specific" 
  	} 
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §b${target} §chas been kicked from server\n§gBy§8:§b${player.name}\n§gReason§8:§c${reason}`) 
      player.runCommand(`kick "${target}" .\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§c${reason}\n§8 >> §gBy§8:§c${player.name}`) 
      }) 
  	} if(target != checkExistPlayer){
  	system.run(() => {
  	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
  }) 
  	}}
  if (msg.startsWith(prefix+"antiXray enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti xray has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:xray`) 
  })} 
  if (msg.startsWith(prefix+"antiXray disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti xray has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:xray dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiNuker enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti nuker has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:nuker`) 
  })} 
  if (msg.startsWith(prefix+"antiNuker disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti nuker has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:nuker dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiAutoA enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti auto clicker attack has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:auto`) 
  })} 
  if (msg.startsWith(prefix+"antiAutoA disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti auto clicker attack has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:auto dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiKillaura enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti killaura has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:killaura`) 
  })} 
  if (msg.startsWith(prefix+"antiKillaura disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti killaura has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:killaura dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiReachA enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti reachA has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:reachA`) 
  })} 
  if (msg.startsWith(prefix+"antiReachA disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti reachA has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:reachA dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiReachB enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti reachB has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:reachB`) 
  })} 
  if (msg.startsWith(prefix+"antiReachB disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti reachB has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:reachB dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiReachP enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti reachP has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:reachP`) 
  })} 
  if (msg.startsWith(prefix+"antiReachP disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti reachP has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:reachP dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiScaffoldA enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldA has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:scaffoldA`) 
  })} 
  if (msg.startsWith(prefix+"antiScaffoldA disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldA has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:scaffoldA dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiScaffoldB enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldB has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:scaffoldB`) 
  })} 
  if (msg.startsWith(prefix+"antiScaffoldB disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldB has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:scaffoldB dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiAutoP enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti auto clicker place has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:autoA`) 
  })} 
  if (msg.startsWith(prefix+"antiAutoP disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti auto clicker place has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:autoA dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiSpeedMine enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti speedMine has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:speedMine`) 
  })} 
  if (msg.startsWith(prefix+"antiSpeedMine disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti speedMine has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:speedMine dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiKillaura enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti killaura has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:speed`) 
  })} 
  if (msg.startsWith(prefix+"antiKillaura disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti killaura has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:killaura dummy`) 
  })} if (msg.startsWith(prefix+"antiCrasher enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti crasher has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:crasher`) 
  })} 
  if (msg.startsWith(prefix+"antiCrasher disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti crasher has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:crasher dummy`) 
  })} if (msg.startsWith(prefix+"antiSpeed enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti speed has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:speed`) 
  })} 
  if (msg.startsWith(prefix+"antiSpeed disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti speed has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:speed dummy`) 
  })} 
  if (msg.startsWith(prefix+"antiFly enable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti fly has enabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives remove toggle:fly`) 
  })} 
  if (msg.startsWith(prefix+"antiFly disable") && player.hasTag("MatrixOP")){
  	system.run(() => {
  	world.sendMessage(`§e[§cMatrix§e] §aanti fly has §cdisabled§r\n§gBy§8:§b${player.name} `) 
      player.runCommand(`scoreboard objectives add toggle:fly dummy`) 
  })} 
if (msg.startsWith(prefix+"inventoryCheck")){
	let item; 
    let amount;  
  	for (let i = 0; i < inventory.size; i++) {
  try{
  item = inventory.getItem(i).typeId.replaceAll("minecraft:","") 
  } catch {
  item = "air"
  	} try{
  amount = inventory.getItem(i).amount 
  } catch {
  amount = 1
  	} 
player.sendMessage(`§e[§cMatrix§e] §gslot number §8(§g${i}§8) §gincluding §c${item} §gamount §c${amount} `) 
      } 
  }
if (msg.startsWith(prefix+"toggles") && player.hasTag("MatrixOP")){
				player.sendMessage(`§c§lToggles§8:§r\n§ganti speed toggle §8(§cantiSpeed§8)\n§ganti reach toggle§8 (§cantiReach§8<§greach_type§8>§8) §greach types§8:\n§gbreak§8:§cB\n§gplace§8:§cP\n§gAttack§8:§cA\n§ganti nuker toggle§8 (§cantiNuker§8)\n§ganti speed mine toggle§8 (§cantiSpeedMine§8)\n§ganti xray toggle §8(§cantiXray§8)\n§ganti scaffold toggle §8(§cantiScaffold§8<§cscaffold_type§8>)\n§gscaffold types§8:\n§gwhen the player eyes is looking up and placing blocks under him§8:§cA\n§gwhen player is placing blocks and item in hand of player doesnt block was placed§8:§cB\n§ganti auto clicker toggle §8(§cantiAuto§8<§cAuto clicker type§8>)§g\nauto clicker types§8:\n§gAuto clicker attack§8:§cA\n§gAuto clicker place§8:§cP\n§ganti crasher toggle §8(§cantiCrasher§8)\n§ganti fly toggle §8(§cantiFly§8)`) 
				} 
if (msg.startsWith(prefix+"itemCheck")){
	if(target == checkExistPlayer){
 let itemSearch = word[2].trim() 
 for (let i = 0; i < inventory.size; i++) {
 	let item; 
    let amount;  
    try{
  item = inventory.getItem(i).typeId.replaceAll("minecraft:","") 
  } catch {
  item = "air"
  	} try{
  amount = inventory.getItem(i).amount 
  } catch {
  amount = 1
  	} 
  if (item == itemSearch){
  	player.sendMessage(`§g[§cMatrix§g] §aSuccessfully found §8(§g${itemSearch}§8) §gamount §8(§g${amount}§8) §gin slot §8(§g${i}§8)`) 
  	}} 
 } if(target != checkExistPlayer){
 	player.sendMessage(`§e[§cMatrix§e] §c>> §g${target}§c << this target doesn't exist `) 
 	} 
} 
}) 
	