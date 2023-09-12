import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import { world, system } from '@minecraft/server';

const autototem_a = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity;
    if((uniqueId(player)) || ev.id !== 'anticheat:wear_totem') return;
    if(player.hasTag('anticheat:moving')) {
      player.getComponent("equipment_inventory").setEquipment('offhand');
      addScore(player, 'anticheat:autototemAVl', 1);
      flag(player, 'AutoTotem/A', getScore(player, 'anticheat:autototemAVl'));
      if(getScore(player, 'anticheat:autototemAVl') > config.modules.autototemA.VL) {
        clearScore(player, 'anticheat:autototemAVl');
        punish(player, 'AutoTotem/A', config.modules.autototemA.punishment)
      }
    }
  });
  if(!config.modules.autototemA.state) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autototem_a }