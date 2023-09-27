import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import { EntityEquippableComponent, EquipmentSlot, Player, world } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';

const autoshield_c = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:hasGUIopen')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      addScore(player, 'anticheat:autoshieldCVl', 1);
      flag(player, 'AutoShield/C', getScore(player, 'anticheat:autoshieldCVl'));
      if(getScore(player, 'anticheat:autoshieldCVl') > config.modules.autoshieldC.VL) {
        clearScore(player, 'anticheat:autoshieldCVl');
        punish(player, 'AutoShield/C', config.modules.autoshieldC.punishment)
      }
    }
  });
  if(!State('AUTOSHIELDC', config.modules.autoshieldC.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autoshield_c }