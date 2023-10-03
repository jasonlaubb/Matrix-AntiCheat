import { world, Player, EntityEquippableComponent, EquipmentSlot, ItemStack } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const autotool_c = () => {
  const EVENT1 = world.afterEvents.playerBreakBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player) || player.typeId !== "minecraft:player") return;
    const itemStack1: ItemStack = (player.getComponent('EntityEquippableComponent') as EntityEquippableComponent).getEquipment('mainhand' as EquipmentSlot);
    const itemStack2: ItemStack = ev.itemStackBeforeBreak;
    const itemStack3: ItemStack = ev.itemStackAfterBreak;
    if ((itemStack2 !== itemStack3 && itemStack3 !== undefined) || (itemStack1 !== itemStack2 && itemStack1 !== undefined) || itemStack1 !== itemStack3) {
      ev.block.setType('minecraft:air');
      flag(player, 'AutoTool/C', config.modules.autotoolC as ModuleClass, [`selectSlot=${player.selectedSlot}`])
    }
  });
  if(!State('AUTOTOOLC', config.modules.autotoolB.state)) {
    world.afterEvents.playerBreakBlock.unsubscribe(EVENT1);
  };
};

export { autotool_c }