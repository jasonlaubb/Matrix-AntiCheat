import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import { world, EntityEquippableComponent, EquipmentSlot, Player } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';

const autototem_b = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_totem') return;
    if(player.hasTag('anticheat:swinging_head')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      addScore(player, 'anticheat:autototemBVl', 1);
      flag(player, 'AutoTotem/B', getScore(player, 'anticheat:autototemBVl'));
      if(getScore(player, 'anticheat:autototemBVl') > config.modules.autototemB.VL) {
        clearScore(player, 'anticheat:autototemBVl');
        punish(player, 'AutoTotem/B', config.modules.autototemB.punishment)
      }
    }
  });
  if(!State('AUTOTOTEMB', config.modules.autototemB.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autototem_b }