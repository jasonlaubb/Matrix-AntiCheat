import config from '../../../data/config.js';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import { world, Player, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';

const autototem_a = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_totem') return;
    if(player.hasTag('anticheat:moving')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      addScore(player, 'anticheat:autototemAVl', 1);
      flag(player, 'AutoTotem/A', getScore(player, 'anticheat:autototemAVl'));
      if(getScore(player, 'anticheat:autototemAVl') > config.modules.autototemA.VL) {
        clearScore(player, 'anticheat:autototemAVl');
        punish(player, 'AutoTotem/A', config.modules.autototemA.punishment)
      }
    }
  });
  if(!State('AUTOTOTEMA', config.modules.autototemA.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autototem_a }