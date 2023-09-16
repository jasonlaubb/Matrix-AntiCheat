import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import { world, Player, EntityEquipmentInventoryComponent, EquipmentSlot } from '@minecraft/server';

const autoshield_b = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:swinging_head')) {
      (player.getComponent("equipment_inventory") as EntityEquipmentInventoryComponent).setEquipment('offhand' as EquipmentSlot);
      addScore(player, 'anticheat:autosheidBVl', 1);
      flag(player, 'AutoSheid/B', getScore(player, 'anticheat:autosheidBVl'));
      if(getScore(player, 'anticheat:autosheidBVl') > config.modules.autoshieldB.VL) {
        clearScore(player, 'anticheat:autosheidBVl');
        punish(player, 'autosheid/B', config.modules.autoshieldB.punishment)
      }
    }
  });
  if(!config.modules.autoshieldB.state) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autoshield_b }