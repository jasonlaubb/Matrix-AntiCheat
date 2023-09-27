import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import { world, Player, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';

const autoshield_a = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:moving')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      addScore(player, 'anticheat:autosheidAVl', 1);
      flag(player, 'AutoSheid/B', getScore(player, 'anticheat:autosheidAVl'));
      if(getScore(player, 'anticheat:autosheidAVl') > config.modules.autoshieldA.VL) {
        clearScore(player, 'anticheat:autosheidAVl');
        punish(player, 'AutoSheid/B', config.modules.autoshieldA.punishment)
      }
    }
  });
  if(!State('AUTOSHIELDA', config.modules.autoshieldA.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autoshield_a }