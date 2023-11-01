import {
  antiNukerEnabled,
  nukerTimer
} from "../../config"
import {
  system,
  world,
} from "@minecraft/server"
import { 
  Util,
  Detect
} from '../../Util/Util'
let nukerToggle

const RecoverBlock = Util.RecoverBlock
const GamemodeOf = Util.GamemodeOf

if(antiNukerEnabled == true) {
  world.afterEvents.playerBreakBlock.subscribe((event) => {
    try {
      nukerToggle = world.scoreboard.getObjective("toggle:nuker").displayName
    } catch {
      nukerToggle = true
    }
    let player = event.player
    let block = event.block

    if (player.hasTag('stopBreakingBlock')) {
      RecoverBlock(player.dimension, block.location, block)
      return
    }
    let nukerLength = world.scoreboard.getObjective("nukeLength").getScore(player.scoreboardIdentity)
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
    let getItemInSlot;
    let getEnchantment;
    let checkEfficiency;
    try {
      getItemInSlot = player.getComponent("inventory").container.getItem(player.selectedSlot)
      getEnchantment = getItemInSlot.getComponent("minecraft:enchantments").enchantments
      checkEfficiency = getEnchantment.hasEnchantment("efficiency")
    } catch {
      getItemInSlot = null
      getEnchantment = null
      checkEfficiency = null
    }
    let getNukeTime = world.scoreboard.getObjective("nukerTimer").getScore(player.scoreboardIdentity)
    if(getNukeTime <= 0) {
      system.run(() => {
        Util.setScore(world, player, 'nukerTimer', nukerTimer)
      })
    }
    if(getNukeTime >= 1) {
      system.run(() => {
        if(nukerToggle != true || player.hasTag("MatrixOP")) return
        Util.addScore(world, player, 'nukeLength', 1)
        Util.setScore(world, player, 'sendMsgT', 6)
      })
      RecoverBlock(player.dimension, block.location, block)
    }
    if(checkEfficiency > 0 && getNukeTime >= 1 || player.getEffect("haste") && getNukeTime >= 1 ||
      fastBrokenBlocks.includes(block.type.id) && getNukeTime >= 1 || GamemodeOf(player) === 1) {
      system.run(() => {
        Util.setScore(world, player, 'nukeLength', 0)
        Util.setScore(world, player, 'sendMsgT', 0)
      })
    }
    if(nukerLength > 15) {
      //prevent the destroy
      player.addTag('stopBreakingBlock')
      world.scoreboard.getObjective('stop_break_timer').setScore(player, 120)
      RecoverBlock(player.dimension, block.location, block)
      if(player.hasTag("ban")) return
      system.run(() => {
        Detect.flag(player, 'Nuker', 'A', 'ban', null, false)
      })
    }
  })
}
