//@ts-check
import { world, ItemStack, Enchantment, Player } from "@minecraft/server";

/**
 * @param {Player} player 
 * @param {string} type 
 */
function getUIItem (player, type) {
  const item = new ItemStack(type, 1)

  //Create a custom item by a defined item
  item.setLore(['§r§7(Right click to open Matrix UI)', `§0§k${world.getDynamicProperty('Matrix:UI-key')}`])
  item.keepOnDeath = true
  item.nameTag = '§r§g§lMatrix UI'
  //@ts-expect-error
  item.getComponent('minecraft:enchantments').enchantments.addEnchantment(new Enchantment('unbreaking', 1))

  //@ts-expect-error
  player.getComponent('inventory').container.addItem(item.clone());
};

export { getUIItem }
