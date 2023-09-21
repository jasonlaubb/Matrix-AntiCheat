import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import { world, Player, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server';

const autototem_c = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_totem') return;
    if(player.hasTag('anticheat:hasGUIopen')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
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