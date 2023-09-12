import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import { world, system } from '@minecraft/server';

const autosheid_a = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity;
    if((uniqueId(player)) || ev.id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:moving')) {
      player.getComponent("equipment_inventory").setEquipment('offhand');
      addScore(player, 'anticheat:autosheidAVl', 1);
      flag(player, 'AutoSheid/B', getScore(player, 'anticheat:autosheidAVl'));
      if(getScore(player, 'anticheat:autosheidAVl') > config.modules.autosheidA.VL) {
        clearScore(player, 'anticheat:autosheidAVl');
        punish(player, 'AutoSheid/B', config.modules.autosheidA.punishment)
      }
    }
  });
  if(!config.modules.autosheidA.state) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autosheid_a }