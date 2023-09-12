import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import { world, system } from '@minecraft/server';

const autototem_b = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity;
    if((uniqueId(player)) || ev.id !== 'anticheat:wear_totem') return;
    if(player.hasTag('anticheat:swinging_head')) {
      player.getComponent("equipment_inventory").setEquipment('offhand');
      addScore(player, 'anticheat:autototemBVl', 1);
      flag(player, 'AutoTotem/B', getScore(player, 'anticheat:autototemBVl'));
      if(getScore(player, 'anticheat:autototemBVl') > config.modules.autototemB.VL) {
        clearScore(player, 'anticheat:autototemBVl');
        punish(player, 'AutoTotem/B', config.modules.autototemB.punishment)
      }
    }
  });
  if(!config.modules.autototemB.state) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autototem_b }