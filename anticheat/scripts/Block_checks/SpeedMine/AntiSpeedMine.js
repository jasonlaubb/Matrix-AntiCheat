import {
  antiSpeedMineEnabled,
  toolsNames,
  stoneTools,
  woodTools
} from "../../config"
import {
  system,
  GameMode,
  world
} from "@minecraft/server"
import { Detect, Util } from "../../Util/Util";

let speedMineToggle;

const GamemodeOf = Util.GamemodeOf

//* check toggle if enabled
if (antiSpeedMineEnabled == true) {
  world.beforeEvents.playerBreakBlock.subscribe((event) => {
    let player = event.player
    let block = event.block
    try {
      speedMineToggle = world.scoreboard.getObjective("toggle:speedMine").displayName
    } catch {
      speedMineToggle = true
    }
    let breakSpeed;
    let getNuke = world.scoreboard.getObjective("nukerTimer").getScore(player.scoreboardIdentity)
    let fastBrokenBlocks = ["minecraft:yellow_flower", "minecraft:red_flower", "minecraft:double_plant",
      "minecraft:wither_rose", "minecraft:tallgrass", "minecraft:hanging_roots", "minecraft:leaves",
      "minecraft:leaves2", "minecraft:azalea_leaves", "minecraft:azalea_leaves_flowered", "minecraft:deadbush",
      "minecraft:cocoa", "minecraft:chorus_plant", "minecraft:chorus_flower", "minecraft:cave_vines",
      "minecraft:cave_vines_body_with_berries", "minecraft:cave_vines_head_with_berries",
      "minecraft:glow_berries", "minecraft:carrots", "minecraft:cactus", "minecraft:big_dripleaf",
      "minecraft:beetroot", "minecraft:bamboo", "minecraft:bamboo_sapling", "minecraft:azalea",
      "minecraft:flowering_azalea", "minecraft:waterlily", "minecraft:melon_block", "minecraft:melon_stem",
      "minecraft:potatoes", "minecraft:pumpkin", "minecraft:carved_pumpkin", "minecraft:pumpkin_stem",
      "minecraft:sapling", "minecraft:seagrass", "minecraft:small_dripleaf_block", "minecraft:spore_blossom",
      "minecraft:reeds", "minecraft:sweet_berry_bush", "minecraft:sweet_berries", "minecraft:vine",
      "minecraft:wheat", "minecraft:kelp", "minecraft:crimson_fungus", "minecraft:warped_fungus",
      "minecraft:glow_lichen", "minecraft:brown_mushroom", "minecraft:red_mushroom", "minecraft:nether_wart",
      "minecraft:nether_sprouts", "minecraft:crimson_roots", "minecraft:warped_roots", "minecraft:twisting_vines",
      "minecraft:weeping_vines", "minecraft:slime", "minecraft:redstone_wire", "minecraft:unpowered_repeater",
      "minecraft:powered_repeater", "minecraft:unpowered_comparator", "minecraft:powered_comparator"
    ];
    //*speedMine Break value 
    let breakTimer = world.scoreboard.getObjective("mineTimer").getScore(player.scoreboardIdentity)
    let breakFlags = world.scoreboard.getObjective("mineFlags").getScore(player.scoreboardIdentity)

    //* clone block before broken
    let checkSelectedSlot;
    let getItemInSlot;
    let getEnchantment;
    let checkEfficiency;
    //* checkSelectedSlot if is a item or a tool
    try {
      checkSelectedSlot = player.getComponent("inventory").container.getItem(player.selectedSlot).typeId
    } catch {
      //*if value is undefined its mean the item is air
      checkSelectedSlot = "minecraft:air"
    }
    try {
      getItemInSlot = player.getComponent("inventory").container.getItem(player.selectedSlot)
      getEnchantment = getItemInSlot.getComponent("minecraft:enchantments").enchantments
      checkEfficiency = getEnchantment.hasEnchantment("efficiency")
    } catch {
      getItemInSlot = null
      getEnchantment = null
      checkEfficiency = null
    }
    //* get minecraft blocks 
    breakSpeed = 20
    //* 30 ticks
    let item;
    try {
      item = player.getComponent("inventory").container.getItem(player.selectedSlot).typeId
    } catch {
      item = "minecraft:air"
    }
    if (toolsNames.includes(item)) {
      breakSpeed = 4
    }
    if (stoneTools.includes(item)) {
      breakSpeed = 10
    }
    if (woodTools.includes(item)) {
      breakSpeed = 13
    }
    if (checkEfficiency > 0 || player.getEffect("haste") || fastBrokenBlocks.includes(block.type.id)) {
      breakSpeed = 0
    }
    if (breakTimer < 1) {
      if (speedMineToggle != true) return
      if (player.hasTag("MatrixOP")) return
      if (fastBrokenBlocks.includes(block.type.id)) return
      system.run(() => {
        Util.setScore(world, player, 'mineFlags', 0)
        Util.setScore(world, player, 'mineTimer', breakSpeed)
      })
    }
    if (breakTimer > 0) {
      system.run(() => {
        if (player.hasTag("MatrixOP") || getNuke >= 2 || breakTimer > breakSpeed || breakSpeed == 0 ||
          speedMineToggle != true) return
      })
      event.cancel = true
      system.run(() => {
        Util.addScore(world, player, 'mineFlags', 1)
      })
    }
    if (player.hasTag("hitBlock")) {
      system.run(() => {
        player.removeTag(`hitBlock`)
      })
    }
    if (breakFlags > 4) {
      system.run(() => {
        if (getNuke >= 2 || breakTimer > breakSpeed || breakSpeed == 0 || player.hasTag("MatrixOP") ||
          speedMineToggle != true || fastBrokenBlocks.includes(block.type.id) || GamemodeOf(player) === 1) return
          event.cancel = true
        Util.setScore(world, player, 'mineFlags', 0)
        Detect.flag(player, 'Speed Mine', 'A', 'none', [['Blocks', breakFlags + ' blocks', 'second']], false)
      })
    }
  })
}
