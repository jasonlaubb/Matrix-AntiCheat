//*Thank you to use our antiCheat!
//*the prefix here
const prefix = "#"
const password = "passwordHere"
//*UI
const UiItemPrefix = 'minecraft:diamond'
//*toggles: 
const antiReachBlockEnabled = true
const antiReachAttackEnabled = true
const antiKillauraEnabled = true
const antiAutoClickerEnabled = true
const antiScaffoldEnabled = true
const antiNukerEnabled = true
const antiSpeedMineEnabled = true
const antiXrayEnabled = true
const antiSpeedEnabled = true
const antiFlyEnabled = true
const antiCrasherEnabled = true
const antiPhaseEnabled = true
const antiBadPacketEnabled = true
const antiInvalidSrpintEnabled = true
//*modules
const antiCombatLogEnabled = true
//*methods
//*this is maximum cps can player reach 
const maximumCps = 20
const maximumCpsPlace = 12
//*this is how much player wait to can break second block like if nukerTimer = 2 its mean 2 ticks
//* 1 second = 20 ticks
const nukerTimer = 1
//*this list for tools which can break blocks fast
//* there you can edit items to give permission to item 
const toolsNames = ["minecraft:netherite_hoe", "minecraft:golden_hoe", "minecraft:diamond_hoe",
  "minecraft:netherite_pickaxe", "minecraft:golden_pickaxe", "minecraft:diamond_pickaxe", "minecraft:netherite_axe",
  "minecraft:golden_axe", "minecraft:diamond_axe", "minecraft:netherite_shovel", "minecraft:golden_shovel",
  "minecraft:diamond_shovel", "minecraft:iron_pickaxe", "minecraft:iron_axe", "minecraft:iron_hoe",
  "minecraft:iron_pickaxe", "minecraft:shears"
]
const stoneTools = ["minecraft:stone_hoe", "minecraft:stone_shovel", "minecraft:stone_axe", "minecraft:stone_pickaxe"]
const woodTools = ["minecraft:wooden_hoe", "minecraft:wooden_shovel", "minecraft:wooden_axe", "minecraft:wooden_pickaxe"]
//*list of xray blocks 
const xray = ["minecraft:diamond_ore", "minecraft:deepslate_diamond_ore", "minecraft:emerald_ore",
  "minecraft:deepslate_emerald_ore", "minecraft:gold_ore", "minecraft:deepslate_gold_ore", "minecraft:ancient_debris"
]
const HELP_LIST = `§8§l--------------§r§cMatrix_AntiCheat§l§8--------------\n§c§lCommands list§r§8:\n§gto give player op§8:§r${prefix}op §8<§guser§8>\n§gto remove op from player§8:§r${prefix}deop §8<§guser§8>\n§gget Matrix UI item§8:§r${prefix}ui\n§gto kick player§8:§r${prefix}kick §8<§guser§8> §8<§greason§8>\n§gto ban player type§8:§r${prefix}ban §8<§guser§8> <§greason§8>\n§gto freeze player§8:§r${prefix}freeze §8<§guser§8> <§greason§8>\n§gto mute player§8:§r${prefix}mute §8<§guser§8> <§greason§8>\n§gto put player for get cheats notifications§8:§r${prefix}unnotify §8<§guser§8>\n§gto put player for get xray notifications§8:§r${prefix}xray_notify §8<§guser§8>\n§gto unfreeze player§8:§r${prefix}unfreeze §8<§guser§8>\n§gto unban player§8:§r${prefix}unban §8<§guser§8>\n§gto unmute player§8:§r${prefix}unmute §8<§guser§8>\n§gto remove player from get cheats notifications§8:§r${prefix}unnotify §8<§guser§8>\n§gto remove player from get xray notifications§8:§r${prefix}xray_unnotify §8<§guser§8>\n§gto change rank of player§8:§r${prefix}rank §8<§guser§8> §8<§grank§8>\n§gto run minecraft command§8:§r${prefix}runCommand §8<§gcommand§8>\n§gto §cdisable §gor §aenable §gToggles§8:§r${prefix}§8<§gtoggle§8> §8<§aenable§8/§cdisable§8>\n§gto check player inventory§8:§r${prefix}inventoryCheck §8<§guser§8>\n§gto check if there item in inventory of player§8:§r${prefix}itemCheck §8<§guser§8> §8<§gitem§8>\n§gto see toggles list§8:§r${prefix}toggles\n§8§l--------------§r§cMatrix_AntiCheat§l§8--------------\n§8§l      -------§r§gby§8:§gRaMiGamer§l§8-------      `
let modules
try {
  modules = {
    speed: {
      maximumDistance: 9.5,
      punishment: "tp",
      punishmentKickMessage: "§gSpeed §8(§gA§8) §8(§g" + distance + "§8/§g" + maximumDistance + "§8)",
    },
    fly: {
      maximumDistance: 1.3,
      punishment: "tp",
      punishmentKickMessage: "§gfly §8(§gA§8) §8(§g" + distance + "§8/§g" + maximumDistance + "§8)",
    },
    reach: {
      maximumDistanceXZ: 3.7,
      maximumDistanceY: 4.8,
      punishment: "kick",
      punishmentKickMessage: "§creach §8(§gA§8) §8(§g" + distance + "§8)",
    },
    killauraA: {
      punishment: "kick",
      punishmentKickMessage: "§ckillaura §8(§gA§8)",
    },
    killauraB: {
      maximumAngle: 90,
      punishment: "kick",
      punishmentKickMessage: "§ckillaura §8(§gB§8) §8(§g" + angle + "§8/§g" + modules.killauraB.maximumAngle + "§8)",
    },
    killauraC: {
      maximumEntitys: 1,
      punishment: "kick",
      punishmentKickMessage: "§ckillaura §8(§gC§8)",
    },
    nuker: {
      maximumTimeBeforeBreakBlock: 1,
      punishment: "ban",
      punishmentKickMessage: "§cnuker §8(§gA§8)",
    },
    speedMine: {
      punishment: "none",
      punishmentKickMessage: "§cSpeedMine §8(§gA§8)",
    },
    phase: {
      punishment: "none",
      punishmentKickMessage: "§cPhase §8(§gA§8)",
    },
    autoClikerA: {
      punishment: "kick",
      maximumCps: 12,
      punishmentKickMessage: "§cunNatural clicking §8(§gA§8) §8(§g" + cps + "§8/§g" + modules.autoClikerA.maximumCps +
        "§8)",
    },
    scaffold: {
      punishment: "none",
      punishmentKickMessage: "§cscaffold §8(§gA§8)",
    }
  }
} catch {};
function setScore(world,player,scoreboard,amount){
  const score = world.scoreboard.getObjective(scoreboard)
  score.setScore(player.scoreboardIdentity,amount)
}
  
function addScore(world,player,scoreboard,amount){
  let score = world.scoreboard.getObjective(scoreboard)
  score.setScore(player.scoreboardIdentity,score.getScore(player.scoreboardIdentity)+amount)
}
function detect(player, punishment, punishmentKickMessage, Pos, notifyMessageBollean, notifyMessage) {
  if(punishment == "kick") {
    player.runCommand(`kick "${player.name}" ${punishmentKickMessage}`)
  }
  if(punishment == "ban") {
    player.runCommand(`kick "${player.name}" ${punishmentKickMessage}`)
  }
  if(punishment == "tp") {
    player.runCommand(`tp ${Pos}`)
  }
  if(punishment == "kill") {
    player.kill()
  }
  if(notifyMessageBollean == true) {
    player.runCommand(`tellraw @a[tag=notify] {"rawtext":[{"text":"${notifyMessage}"}]}`)
  }
}
/**
 * @remarks
 * Contains a description of a vector.
 * @param x {number} X component of this vector
 * @param y {number} Y component of this vector
 * @param z {number} Z component of this vector
*/
class Vector3 {
  x
  y
  z
}
/**
 * @remarks
 Represents a two-directional vector.
 * @param x {number} X component of this vector
 * @param y {number} Y component of this vector
*/
class Vector2 {
  x
  y
}
export {
  antiReachBlockEnabled,
  antiCrasherEnabled,
  antiPhaseEnabled,
  antiFlyEnabled,
  antiReachAttackEnabled,
  antiScaffoldEnabled,
  antiXrayEnabled,
  antiKillauraEnabled,
  antiAutoClickerEnabled,
  antiNukerEnabled,
  antiSpeedMineEnabled,
  antiSpeedEnabled,
  antiBadPacketEnabled,
  antiInvalidSrpintEnabled,
  antiCombatLogEnabled,
  maximumCps,
  nukerTimer,
  toolsNames,
  woodTools,
  stoneTools,
  xray,
  maximumCpsPlace,
  password,
  prefix,
  detect,
  UiItemPrefix,
  HELP_LIST,
  modules,
  setScore,
  addScore,
  Vector3,
  Vector2
}
