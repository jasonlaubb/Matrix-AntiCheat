import * as Minecraft from "@minecraft/server"
import {
  antiScaffoldEnabled
} from "../../config"
import {
  system,
  world,
  Vector
} from "@minecraft/server"
import { Detect, Util } from "../../Util/Util"

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
          Util.addScore(world, player, 'tryScaffold', 1)
        })
      }
    }
    if (tryScaffold == 2 && block2 == "minecraft:air" && player.hasTag("looking_up")) {
      if (isUnderPlayer(player.location, block.location) === true) {
        event.cancel = true
        system.run(() => {
          Detect.flag(player, 'Scaffold', 'A', 'none', [['Block', blockName]], false)
        })
      }
    }
    if (tryScaffold > 2 && block2 == "minecraft:air" && player.hasTag("looking_up")) {
      if (isUnderPlayer(player.location, block.location) === true) {
        event.cancel = true
        system.run(() => {
          Detect.flag(player, 'Scaffold', 'A', 'none', [['Block', blockName]], false)
        })
      }
    }
    if (block2 == "minecraft:air" && !player.hasTag("looking_up")) {
      if (isUnderPlayer(player.location, block.location) === true) {
        system.run(() => {
          Util.setScore(world, player, 'tryScaffold', 0)
        })
      }
    }

    //scaffold/B - the god of false positive
    let blockView
    try {
      blockView = player.getBlockFromViewDirection().block
    } catch {
      blockView = { id: null }
    }
    
    const buff = world.scoreboard.getObjective('scaffold_buff').getScore(player)
    if (blockView.id !== block.id && isUnderPlayer(player.location, block.location)) {
      system.run(() => world.scoreboard.getObjective('scaffold_buff').addScore(player, 1))
      if (buff + 1 >= 5) {
        system.run(() =>
        Detect.flag(player, 'Scaffold', 'B', 'none', [['Block', blockName]])
        )
      }
    } else system.run(() => world.scoreboard.getObjective('scaffold_buff').setScore(player, 0))

    //scaffold/C
    const rotation = player.getRotation()
    if (Math.trunc(rotation.x) === rotation.x || Math.trunc(rotation.y) === rotation.y) {
      system.run(() => Detect.flag(player, 'Scaffold', 'C', 'none', [['Block', blockName]], false))
    }

    //scaffold/D - block place out of their view (cubecraft bypasses)
    const pos1 = player.location
    const pos2 = { x: block.location.x - 0.5, z: block.location.z - 0.5 }
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - rotation.y - 90;
    if (angle <= -180) angle += 360;
    angle = Math.abs(angle);

    if (angle > 95 && Vector.distance({ x: pos1.x, y: 0, z: pos1.z}, { x: pos2.x, y: 0, z: pos2.z }) > 2.1) {
      system.run(() => Detect.flag(player, 'Scaffold', 'D', 'none', [['Block', blockName]], false))
    }

    //scaffold/E - low x rotation
    if (rotation.x < 34.98 && isUnderPlayer(player.location, block.location)) {
      system.run(() => Detect.flag(player, 'Scaffold', 'E', 'none', [['Block', blockName]], false))
    }
  })
}
