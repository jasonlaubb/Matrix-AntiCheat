import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import { world, system } from '@minecraft/server';

const autototem_c = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity;
    if((uniqueId(player)) || ev.id !== 'anticheat:wear_totem') return;
    if(player.hasTag('anticheat:hasGUIopen')) {
      player.getComponent("equipment_inventory").setEquipment('offhand');
      addScore(player, 'anticheat:autototemCVl', 1);
      flag(player, 'AutoTotem/C', getScore(player, 'anticheat:autototemCVl'));
      if(getScore(player, 'anticheat:autototemCVl') > config.modules.autototemC.VL) {
        clearScore(player, 'anticheat:autototemCVl');
        punish(player, 'AutoTotem/C', config.modules.autototemC.punishment)
      }
    }
  });
  if(!config.modules.autototemC.state) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autototem_c }