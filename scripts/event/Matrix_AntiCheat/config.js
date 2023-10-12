
//*Thank you to use our antiCheat!
//*the prefix here
let prefix = "#" 
let password = "passwordHere"
//*toggles: 
let antiReachBlockEnabled = true
let antiReachAttackEnabled = true
let antiKillauraEnabled = true
let antiAutoClickerEnabled = true
let antiScaffoldEnabled = true
let antiNukerEnabled = true 
let antiSpeedMineEnabled = true 
let antiXrayEnabled = true
let antiSpeedEnabled = true 
let antiFlyEnabled = true 
let antiCrasherEnabled = true 
let antiPhaseEnabled = true
//*methods
//*this is maximum cps can player reach 
let maximumCps = 12
let maximumCpsPlace = 12
//*this is how much player wait to can break second block like if nukerTimer = 2 its mean 2 ticks
//* 1 second = 20 ticks
let nukerTimer = 1
//*this list for tools which can break blocks fast
//* there you can edit items to give permission to item 
let toolsNames = [ "minecraft:netherite_hoe", 
	"minecraft:golden_hoe", 
	"minecraft:diamond_hoe", 
	"minecraft:netherite_pickaxe", 
	"minecraft:golden_pickaxe", 
	"minecraft:diamond_pickaxe", 
	"minecraft:netherite_axe", 
	"minecraft:golden_axe", 
	"minecraft:diamond_axe", 
	"minecraft:netherite_shovel", 
	"minecraft:golden_shovel", 
	"minecraft:diamond_shovel", 
	"minecraft:iron_pickaxe", 
	"minecraft:iron_axe", 
	"minecraft:iron_hoe", 
	"minecraft:iron_pickaxe" , 
	"minecraft:shears" 
	] 
  let stoneTools = [ "minecraft:stone_hoe", 
	"minecraft:stone_shovel", 
	"minecraft:stone_axe", 
	"minecraft:stone_pickaxe"
	]
     let woodTools = [ "minecraft:wooden_hoe", 
	"minecraft:wooden_shovel", 
	"minecraft:wooden_axe", 
	"minecraft:wooden_pickaxe"
	] 
//*list of xray blocks 
let xray = [ "minecraft:diamond_ore", 
"minecraft:deepslate_diamond_ore", 
"minecraft:emerald_ore", 
"minecraft:deepslate_emerald_ore", 
"minecraft:gold_ore", 
"minecraft:deepslate_gold_ore", 
"minecraft:ancient_debris" 
] 
try {
let modules = {
  speed: {
    maximumDistance: 9.5,
    punishment:"tp",
    punishmentKickMessage:"§gSpeed §8(§gA§8) §8(§g"+distance+"§8/§g"+maximumDistance+"§8)",
  },
  fly: {
    maximumDistance : 1.3,
    punishment:"tp",
    punishmentKickMessage:"§gfly §8(§gA§8) §8(§g"+distance+"§8/§g"+maximumDistance+"§8)",
  },
  reach:{
    maximumDistanceXZ : 3.7,
    maximumDistanceY: 4.8,
    punishment:"kick",
    punishmentKickMessage:"§creach §8(§gA§8) §8(§g"+distance+"§8)",
  },
  killauraA:{
punishment:"kick",
punishmentKickMessage:"§ckillaura §8(§gA§8)",
  },
  killauraB:{
    maximumAngle: 90,
    punishment:"kick",
punishmentKickMessage:"§ckillaura §8(§gB§8) §8(§g"+angle+"§8/§g"+modules.killauraB.maximumAngle+"§8)",
  },
  killauraC:{
    maximumEntitys: 1,
punishment:"kick",
punishmentKickMessage:"§ckillaura §8(§gC§8)",
  },
  nuker:{
  maximumTimeBeforeBreakBlock: 1,
punishment:"ban",
punishmentKickMessage:"§cnuker §8(§gA§8)",
  },
  speedMine:{
punishment:"none",
punishmentKickMessage:"§cSpeedMine §8(§gA§8)",
  },
  phase:{
punishment:"none",
punishmentKickMessage:"§cPhase §8(§gA§8)",
  },
  autoClikerA:{
punishment:"kick",
    maximumCps: 12,
punishmentKickMessage:"§cunNatural clicking §8(§gA§8) §8(§g"+cps+"§8/§g"+modules.autoClikerA.maximumCps+"§8)",
  },
  scaffold:{
punishment:"none",
punishmentKickMessage:"§cscaffold §8(§gA§8)",
  },
}} catch { };
function detect (player,punishment,punishmentKickMessage,Pos,notifyMessageBollean,notifyMessage){
  if(punishment == "kick"){
    player.runCommand(`kick "${player.name}" ${punishmentKickMessage}`)
  } if(punishment == "ban"){
    player.runCommand(`kick "${player.name}" ${punishmentKickMessage}`)
  } if(punishment == "tp"){
    player.runCommand(`tp ${Pos}`)
  }
  if(punishment == "kill"){
    player.kill() 
  }
  if(notifyMessageBollean == true){
    player.runCommand(`tellraw @a[tag=notify] {"rawtext":[{"text":"${notifyMessage}"}]}`)
  }
}
export { antiReachBlockEnabled,antiCrasherEnabled,antiPhaseEnabled,antiFlyEnabled,antiReachAttackEnabled,antiScaffoldEnabled,antiXrayEnabled,antiKillauraEnabled,antiAutoClickerEnabled,antiNukerEnabled,antiSpeedMineEnabled,antiSpeedEnabled, maximumCps,nukerTimer,toolsNames,woodTools,stoneTools,xray,maximumCpsPlace,password,prefix,detect } 
