import { world, ItemStack, Player } from "@minecraft/server";

function getUIItem (player, type) {
  const item = new ItemStack(type, 1)

  //ui item info
  item.setLore(['§r§7(Right click to open Matrix UI)', '§0§k' + world.getDynamicProperty('Matrix:UI-key')])
  item.keepOnDeath = true
  item.maxAmount = 1
  item.nameTag = '§r§g§lMatrix UI'

  player.getComponent('inventory').container.addItem(item.clone());
};

export { getUIItem }