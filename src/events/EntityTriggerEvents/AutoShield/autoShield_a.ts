import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { world, Player, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const autoshield_a = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:moving')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      flag(player, 'AutoShield/A', config.modules.autoshieldA, [`isMoving=true`])
    }
  });
  if(!State('AUTOSHIELDA', config.modules.autoshieldA.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autoshield_a }