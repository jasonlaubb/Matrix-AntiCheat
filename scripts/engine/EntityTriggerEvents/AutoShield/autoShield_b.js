import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import { world, system } from '@minecraft/server';

const autosheid_b = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity;
    if((uniqueId(player)) || id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:swinging_head')) {
      player.getComponent("equipment_inventory").setEquipment('offhand');
      addScore(player, 'anticheat:autosheidBVl', 1);
      flag(player, 'AutoSheid/B', getScore(player, 'anticheat:autosheidBVl'));
      if(getScore(player, 'anticheat:autosheidBVl') > config.modules.autosheidB.VL) {
        clearScore(player, 'anticheat:autosheidBVl');
        punish(player, 'autosheid/B', config.modules.autosheidB.punishment)
      }
    }
  });
  if(!config.modules.autosheidB.state) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autosheid_b }