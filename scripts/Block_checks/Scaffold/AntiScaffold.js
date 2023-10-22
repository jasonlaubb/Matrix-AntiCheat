import * as Minecraft from "@minecraft/server"
import {
  antiScaffoldEnabled
} from "../../config"
import {
  disX,
  disY,
  disZ,
  disXZ,
  limitOfReachX,
  limitOfReachY,
  limitOfReachZ
} from "../Reach/AntiBreak&PlaceReach"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  Vector,
  Container,
  Player,
  BlockInventoryComponent
} from "@minecraft/server"

let world = Minecraft.world
let scaffoldBToggle;
let scaffoldAToggle;

const isUnderPlayer = (pos1, pos2) => {
  const p = { x: Math.floor(pos1.x), y: Math.floor(pos1.y), z: Math.floor(pos1.z) }
  if (p.y - 1 !== pos2.y) return false
  return !![-1, 0, 1].some(x => 
    [-1, 0, 1].some(z =>
      (p.z + x === pos2.x && p.z + z === pos2.z)
    )
  )
}

if (antiScaffoldEnabled == true) {
  world.beforeEvents.playerPlaceBlock.subscribe((event) => {
    try {
      scaffoldBToggle = world.scoreboard.getObjective("toggle:scaffoldB").displayName
    } catch {
      scaffoldBToggle = true
    }
    try {
      scaffoldAToggle = world.scoreboard.getObjective("toggle:scaffoldA").displayName
    } catch {
      scaffoldAToggle = true
    }
    let player = event.player
    let block = event.block
    let {
      x,
      y,
      z
    } = block.location;
    let blockName;
    let blockId = block.type.id.replaceAll("minecraft:", "");
    blockName = blockId.replaceAll("_", " ")
    let tryScaffold = world.scoreboard.getObjective("tryScaffold").getScore(player.scoreboardIdentity)

    let block2 = player.dimension.getBlock({
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y + 1),
      z: Math.floor(player.location.z)
    }).typeId;
    if (block2 == "minecraft:air" && player.hasTag("looking_up")) {
      if (isUnderPlayer(player.location, block.location) === true) {
        if (player.hasTag("MatrixOP")) return
        if (scaffoldAToggle != true) return
        system.run(() => {
          player.runCommand(`scoreboard players add @s tryScaffold 1`)
        })
      }
    }
    if (tryScaffold == 2 && block2 == "minecraft:air" && player.hasTag("looking_up")) {
      if (isUnderPlayer(player.location, block.location) === true) {
        event.cancel = true
        system.run(() => {
          player.runCommand(
            `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gScaffold §8(§gA§8) §chas been detected from §b${player.name}\n§cBlock§8 = §8(§g${blockName}§8)"}]}`
            )
        })
      }
    }
    if (tryScaffold > 2 && block2 == "minecraft:air" && player.hasTag("looking_up")) {
      if (isUnderPlayer(player.location, block.location) === true) {
        event.cancel = true
        system.run(() => {
          player.runCommand(
            `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gScaffold §8(§gA§8) §chas been detected from §b${player.name}\n§cBlock§8 = §8(§g${blockName}§8)"}]}`
            )
        })
      }
    }
    if (block2 == "minecraft:air" && !player.hasTag("looking_up")) {
      if (isUnderPlayer(player.location, block.location) === true) {
        system.run(() => {
          player.runCommand(`scoreboard players set @s tryScaffold 0`)
        })
      }
    }

    //scaffold/B - the god of false positive
    const blockView = player.getBlockFromViewDirection().block
    const buff = world.scoreboard.getObjective('scaffold_buff').getScore(player)
    if (blockView.id !== block.id && isUnderPlayer(player.location, block.location)) {
      system.run(() => world.scoreboard.getObjective('scaffold_buff').addScore(player, 1))
      if (buff + 1 >= 5) {
        system.run(() =>
          player.runCommand(
            `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gScaffold §8(§gB§8) §chas been detected from §b${player.name}\n§cBlock§8 = §8(§g${blockName}§8)"}]}`
          )
        )
      }
    } else system.run(() => world.scoreboard.getObjective('scaffold_buff').setScore(player, 0))

    //scaffold/C
    const rotation = player.getRotation()
    if (Math.trunc(rotation.x) === rotation.x || Math.trunc(rotation.y) === rotation.y) {
      system.run(() =>
        player.runCommand(
          `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gScaffold §8(§gC§8) §chas been detected from §b${player.name}\n§cBlock§8 = §8(§g${blockName}§8)"}]}`
        )
      )
    }
  })
}