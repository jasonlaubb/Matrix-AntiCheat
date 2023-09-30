/*
import { world, EquipmentSlot, EntityEquippableComponent, ItemEnchantsComponent, Enchantment } from '@minecraft/server';
import config from '../../../data/default-config.js';
import { flag, uniqueId, getGamemode, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const insteabreak_a = () => {
  const EVENT1 = world.afterEvents.entityHitBlock.subscribe(ev => {
  })
  const EVENT2 = world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const player = ev.player;
    if (getGamemode(player) == 1 || uniqueId(player)) return;
    const block = ev.block.typeId;
    const hold = (player.getComponent('EntityEquippable') as EntityEquippableComponent).getEquipment('mainhand' as EquipmentSlot);
    const holding = hold.typeId;
    const enchantLevel = ((hold.getComponent('ItemEnchants') as ItemEnchantsComponent).enchantments.getEnchantment('minecraft:efficiency') as Enchantment).level ?? 0;
    if (holding)
    if (!block.startsWith('minecraft:')) return;
    if (holding.endsWith('_axe') && (config.modules.insteabreakB.breakByAxe.includes(holding) || block.endsWith('_log') || block.endsWith('_wood') || ((config.modules.insteabreakB.woodType.filter(bty => block.startsWith(bty)) ?? false) && (config.modules.insteabreakB.miscType.filter(bty => block.endsWith(bty)) ?? false)))) {
      if (enchantLevel > config.modules.insteabreakB.minLevelOfAxe) return;
    }
  });
  if(!State('INSTEABREAKB', config.modules.insteabreakB.state)) {
    world.beforeEvents.playerBreakBlock.unsubscribe(EVENT2);
  };
};

export { insteabreak_a }
*/