import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import { world, system } from '@minecraft/server';

const autoshield_c = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity;
    if((uniqueId(player)) || ev.id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:hasGUIopen')) {
      player.getComponent("equipment_inventory").setEquipment('offhand');
      addScore(player, 'anticheat:autoshieldCVl', 1);
      flag(player, 'AutoShield/C', getScore(player, 'anticheat:autoshieldCVl'));
      if(getScore(player, 'anticheat:autoshieldCVl') > config.modules.autoshieldC.VL) {
        clearScore(player, 'anticheat:autoshieldCVl');
        punish(player, 'AutoShield/C', config.modules.autoshieldC.punishment)
      }
    }
  });
  if(!config.modules.autoshieldC.state) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autoshield_c }